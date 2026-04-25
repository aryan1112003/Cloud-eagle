from langgraph.graph import StateGraph, END, START
from .state import AgentState
from .nodes.intent_node import intent_node
from .nodes.tool_node import tool_node
from .nodes.synthesis_node import synthesis_node


def build_graph():
    graph = StateGraph(AgentState)

    graph.add_node("intent",    intent_node)
    graph.add_node("tool",      tool_node)
    graph.add_node("synthesis", synthesis_node)

    graph.add_edge(START,       "intent")
    graph.add_edge("intent",    "tool")
    graph.add_edge("tool",      "synthesis")
    graph.add_edge("synthesis", END)

    return graph.compile()


agent = build_graph()
