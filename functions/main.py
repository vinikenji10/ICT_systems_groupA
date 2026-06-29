import os
os.environ["OBJC_DISABLE_INITIALIZE_FORK_SAFETY"] = "YES"

from firebase_functions import https_fn
from firebase_functions.options import set_global_options
import firebase_admin
from firebase_admin import firestore
import chromadb
import json
from rag_agent import run_rag_query
from langchain_text_splitters import RecursiveCharacterTextSplitter

# For cost control, limit max instances
set_global_options(max_instances=10)

# Initialize Firebase Admin
if not firebase_admin._apps:
    firebase_admin.initialize_app()



@https_fn.on_request(timeout_sec=540) # Allow longer execution time for bulk sync
def sync_website_info(req: https_fn.Request) -> https_fn.Response:
    try:
        db = firestore.client()
        
        CHUNK_SIZE = 1000
        CHUNK_OVERLAP = 200
        
        # 1. Initialize Embeddings and Splitter
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-001",
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            transport="rest"
        )
        
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE, 
            chunk_overlap=CHUNK_OVERLAP
        )

        # 2. Initialize ChromaDB Cloud Client
        client = chromadb.CloudClient(
            api_key=os.getenv("CHROMADB_API_KEY"),
            tenant=os.getenv("CHROMADB_TENANT"),
            database=os.getenv("CHROMADB_DATABASE")
        )

        # 3. Get or Create Collection
        collection = client.get_or_create_collection(name='website_info')

        # Collections to sync based on requirements
        collections_to_sync = ['clubs', 'buildings', 'facilities', 'events']
        
        total_chunks_added = 0
        
        for coll_name in collections_to_sync:
            print(f"Fetching data from collection: {coll_name}")
            docs = db.collection(coll_name).stream()
            
            for doc in docs:
                data = doc.to_dict()
                doc_id = doc.id
                
                text_parts = []
                
                # Prioritize name/title and description for better context
                if 'name' in data:
                    text_parts.append(f"Name: {data.get('name')}")
                elif 'title' in data:
                    text_parts.append(f"Title: {data.get('title')}")
                    
                if 'description' in data:
                    text_parts.append(f"Description: {data.get('description')}")
                
                # Add remaining fields
                for k, v in data.items():
                    if k not in ['name', 'title', 'description']:
                        if isinstance(v, str):
                            text_parts.append(f"{k.capitalize()}: {v}")
                        elif isinstance(v, (int, float, bool)):
                            text_parts.append(f"{k.capitalize()}: {str(v)}")
                        elif isinstance(v, list):
                            # Convert simple lists to strings
                            list_str = ', '.join([str(item) for item in v if isinstance(item, (str, int, float, bool))])
                            if list_str:
                                text_parts.append(f"{k.capitalize()}: {list_str}")
                
                full_text = "\n".join(text_parts)
                
                if not full_text.strip():
                    continue

                # Split the text
                chunks = text_splitter.split_text(full_text)
                
                if not chunks:
                    continue

                # Generate IDs for each chunk (e.g. clubs_DOCID_0)
                chunk_ids = [f"{coll_name}_{doc_id}_{i}" for i in range(len(chunks))]
                
                # Create metadata to allow filtering in ChromaDB
                metadatas = [
                    {
                        "source_collection": coll_name, 
                        "document_id": doc_id, 
                        "chunk_index": i
                    } for i in range(len(chunks))
                ]
                
                # Generate embeddings for the chunks using Langchain's embed_documents
                chunk_embeddings = embeddings.embed_documents(chunks)
                
                # Upsert to ChromaDB
                collection.upsert(
                    ids=chunk_ids,
                    documents=chunks,
                    embeddings=chunk_embeddings,
                    metadatas=metadatas
                )
                
                total_chunks_added += len(chunks)

        success_msg = f"Success! Synced {total_chunks_added} chunks to ChromaDB."
        print(success_msg)
        return https_fn.Response(success_msg)
    
    except Exception as e:
        error_msg = f"Error syncing to ChromaDB: {e}"
        print(error_msg)
        return https_fn.Response(error_msg, status=500)


@https_fn.on_request(timeout_sec=120)
def ask_agent(req: https_fn.Request) -> https_fn.Response:
    """Endpoint for the Chatbot RAG Agent."""
    # Configura CORS para permitir chamadas do front-end
    if req.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
        }
        return https_fn.Response("", status=204, headers=headers)
        
    headers = {"Access-Control-Allow-Origin": "*"}
    
    try:
        req_json = req.get_json(silent=True)
        if not req_json or "question" not in req_json:
            return https_fn.Response(
                json.dumps({"error": "Please provide a 'question' in the JSON body."}), 
                status=400, 
                headers=headers,
                mimetype="application/json"
            )
            
        question = req_json["question"]
        print(f"Received question: {question}")
        
        # Chama a função principal do nosso agente
        answer = run_rag_query(question)
        print(f"Generated answer: {answer}")
        
        return https_fn.Response(
            json.dumps({"answer": answer}),
            status=200,
            headers=headers,
            mimetype="application/json"
        )
        
    except Exception as e:
        error_msg = f"Error generating answer: {e}"
        print(error_msg)
        return https_fn.Response(
            json.dumps({"error": str(e)}), 
            status=500, 
            headers=headers,
            mimetype="application/json"
        )