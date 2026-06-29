import os
from typing import TypedDict, List
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.documents import Document
from langchain_chroma import Chroma
import chromadb

from langgraph.graph import StateGraph, START, END

# Load environment variables (useful for local testing)
load_dotenv()

# ==============================================================================
# 1. AI AND VECTOR DATABASE SETUP
# ==============================================================================

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite", temperature=0)
embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001", transport="rest")

# Initialize the ChromaDB Cloud client
client = chromadb.CloudClient(
    api_key=os.getenv("CHROMADB_API_KEY"),
    tenant=os.getenv("CHROMADB_TENANT"),
    database=os.getenv("CHROMADB_DATABASE")
)

# Connect to the collection populated during synchronization
vector_store = Chroma(
    client=client,
    collection_name="website_info",
    embedding_function=embeddings,
)

# Configure the retriever (fetches the top 4 most relevant chunks)
retriever = vector_store.as_retriever(search_kwargs={"k": 4})


# ==============================================================================
# 2. STATE DEFINITION AND PROMPTS
# ==============================================================================

class GraphState(TypedDict):
    question: str
    retrieved_docs: List[Document]
    final_answer: str

qa_prompt = ChatPromptTemplate.from_messages([
    ("system", 
     "You are a helpful assistant for students at the Shibaura Institute of Technology (SIT). "
     "Your goal is to help students find information about university clubs, events, and facilities. "
     "Answer the user's question using EXCLUSIVELY the provided context below. "
     "If the information is not in the context, politely inform them that you don't have that information. "
     "Be friendly, concise, and helpful.\n\n"
     "Context:\n{context}"
    ),
    ("human", "{question}")
])

qa_chain = qa_prompt | llm


# ==============================================================================
# 3. NODES
# ==============================================================================

def retrieve_node(state: GraphState):
    """Fetches documents from ChromaDB."""
    print("--- Node: Retrieving Documents ---")
    question = state["question"]
    
    docs = retriever.invoke(question)
    print(f"Retrieved {len(docs)} chunks from the database.")
    
    return {"retrieved_docs": docs}

def generate_node(state: GraphState):
    """Generates the answer using Gemini and the retrieved context."""
    print("--- Node: Generating Answer ---")
    question = state["question"]
    docs = state.get("retrieved_docs", [])
    
    # Extract only the text content from the retrieved documents
    context_text = "\n\n".join([doc.page_content for doc in docs])
    
    response = qa_chain.invoke({"context": context_text, "question": question})
    
    return {"final_answer": response.content}


# ==============================================================================
# 4. GRAPH ASSEMBLY
# ==============================================================================

workflow = StateGraph(GraphState)

workflow.add_node("retrieve", retrieve_node)
workflow.add_node("generate", generate_node)

workflow.add_edge(START, "retrieve")
workflow.add_edge("retrieve", "generate")
workflow.add_edge("generate", END)

# Compile the graph WITHOUT a checkpointer (no memory, as requested)
rag_app = workflow.compile()


# ==============================================================================
# 5. EXTERNAL CALL FUNCTION (To be used in main.py)
# ==============================================================================

def run_rag_query(query: str) -> str:
    """Helper function to be called by the Cloud Function."""
    initial_state = {"question": query}
    
    # Execute the graph and get the final result
    result = rag_app.invoke(initial_state)
    
    return result.get("final_answer", "Sorry, an error occurred while formulating the answer.")

if __name__ == "__main__":
    # Simple test running the file directly in the terminal
    test_question = "Tell me about the technology clubs."
    print(f"Testing the question: '{test_question}'\n")
    
    answer = run_rag_query(test_question)
    print(f"\n🤖 Final Answer:\n{answer}")
