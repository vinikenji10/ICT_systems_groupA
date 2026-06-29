import os
from typing import TypedDict, List, Annotated
import nest_asyncio

# --- Correção para o erro 'no running event loop' ---
nest_asyncio.apply()

# --- Imports Básicos ---
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.mongodb import MongoDBSaver
from pymongo import MongoClient

# Carregando chaves (.env)
load_dotenv()

# --- 1. Configuração Básica do LLM ---
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite", temperature=0)

def get_recent_history(history: List[BaseMessage], k: int = 4) -> List[BaseMessage]:
    """Retorna as últimas 'k' mensagens do histórico para poupar tokens."""
    return history[-k:] if len(history) >= k else history

# ==============================================================================
# ESCREVA SEUS CHAINS E PROMPTS AQUI
# ==============================================================================
# Exemplo:
# custom_prompt = ChatPromptTemplate.from_messages([...])
# custom_chain = custom_prompt | llm



# ==============================================================================
# 1. DEFINIÇÃO DO ESTADO (GraphState)
# ==============================================================================
class GraphState(TypedDict):
    """
    Defina aqui todas as variáveis que vão trafegar entre os nós do seu grafo.
    """
    original_question: str
    final_answer: str
    
    # O add_messages faz o append automático no array de mensagens para a memória
    chat_history: Annotated[List[BaseMessage], add_messages]
    
    # Adicione seus próprios campos abaixo:
    # classification: str
    # retrieved_docs: list
    # etc...


# ==============================================================================
# 2. DEFINIÇÃO DOS NÓS (Nodes)
# ==============================================================================

def example_node_1(state: GraphState):
    """Exemplo de nó inicial."""
    print("--- Nó: Processando Entrada ---")
    question = state.get("original_question", "")
    
    # Sua lógica aqui...
    
    return {} # Retorne os campos do GraphState que você quer atualizar

def example_decision_node(state: GraphState):
    """Exemplo de nó que toma uma decisão ou gera resposta."""
    print("--- Nó: Gerando Resposta ---")
    
    # Exemplo simples de chamada de LLM direto:
    # response = llm.invoke(state.get("original_question"))
    # final_answer = response.content
    
    final_answer = "Essa é uma resposta de placeholder."
    return {"final_answer": final_answer}

def update_history_node(state: GraphState):
    """Nó final para atualizar o histórico de conversas no banco de dados."""
    print("--- Nó: Atualizando Histórico ---")
    original_question = state.get("original_question")
    final_answer = state.get("final_answer")
    
    novas_mensagens = []
    if original_question and final_answer:
        novas_mensagens.append(HumanMessage(content=original_question))
        novas_mensagens.append(AIMessage(content=final_answer))
        
    return {"chat_history": novas_mensagens}

# ==============================================================================
# 3. MONTAGEM E DEFINIÇÃO DO GRAFO (Edges)
# ==============================================================================
workflow = StateGraph(GraphState)

# Adicionando os nós ao grafo
workflow.add_node("node_1", example_node_1)
workflow.add_node("decision_node", example_decision_node)
workflow.add_node("update_history", update_history_node)

# Criando as conexões (Arestas)
workflow.add_edge(START, "node_1")
workflow.add_edge("node_1", "decision_node")
workflow.add_edge("decision_node", "update_history")
workflow.add_edge("update_history", END)

# Exemplo de Aresta Condicional (Comentado para referência)
# workflow.add_conditional_edges("node_1", lambda state: state["classification"], {
#     "rota_A": "node_A",
#     "rota_B": "node_B"
# })


# ==============================================================================
# 4. COMPILAÇÃO E MEMÓRIA (MongoDB)
# ==============================================================================
mongo_uri = f"mongodb+srv://agent:{os.getenv('MONGO_PASSWORD')}@checkpointer.xxxx.mongodb.net/?retryWrites=true&w=majority&appName=checkpointer"
client = MongoClient(mongo_uri)

# Instância de produção
memory = MongoDBSaver(client=client, db_name="checkpointing_db")
app = workflow.compile(checkpointer=memory)

# Instância de teste
test_memory = MongoDBSaver(client=client, db_name="test_checkpointing_db")
test_app = workflow.compile(checkpointer=test_memory)


# ==============================================================================
# 5. MÓDULO DE TESTE (Loop do Chatbot)
# ==============================================================================
TEST_THREAD_ID = "test_context_01"

def print_header():
    """Imprime o cabeçalho inicial do teste"""
    print("=" * 70)
    print("🤖 AGENTE LANGGRAPH (TEMPLATE LIMPO)")
    print("=" * 70)
    print()
    print("📋 Informações da Sessão:")
    print(f"   Thread ID: {TEST_THREAD_ID}")
    print()
    print("💡 Comandos disponíveis:")
    print("   - Digite sua pergunta normalmente")
    print("   - 'sair', 'quit' ou 'exit' para encerrar")
    print("   - Ctrl+C para interromper")
    print()
    print("=" * 70)
    print()

def run_chatbot():
    """Executa o loop principal do chatbot para testes no terminal."""
    print_header()
    
    config = {"configurable": {"thread_id": TEST_THREAD_ID}}
    
    while True:
        try:
            user_input = input("\nVocê: ")
            if user_input.lower() in ['sair', 'quit', 'exit']:
                print("\nEncerrando o agente. Até logo!")
                break
            if not user_input.strip():
                continue
            
            print("\n" + "-"*30 + " Processamento " + "-"*30)
            
            # Inicializa o estado com a pergunta do usuário
            initial_state = {"original_question": user_input}
            
            # Executa o grafo
            result = None
            for output in test_app.stream(initial_state, config=config):
                # Imprime os logs de cada nó para debug
                for key, value in output.items():
                    print(f"[Nó Executado: {key}]")
                result = output
            
            print("-" * 75)
            
            # Busca a resposta final gerada pelo grafo
            if result:
                # O result é um dicionário com a chave sendo o nome do ÚLTIMO nó executado
                last_node = list(result.keys())[0]
                final_answer = result[last_node].get("final_answer", "Desculpe, não consegui gerar uma resposta.")
                print(f"\n🤖 Agente: {final_answer}")
            
        except KeyboardInterrupt:
            print("\n\nOperação interrompida pelo usuário. Encerrando...")
            break
        except Exception as e:
            print(f"\n❌ Erro durante a execução: {e}")

if __name__ == "__main__":
    run_chatbot()
