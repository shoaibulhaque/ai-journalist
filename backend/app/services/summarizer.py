import os

# langchain
from langchain.prompts import PromptTemplate
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_core.output_parsers import StrOutputParser
from langchain_groq import ChatGroq

# Check if GROQ_API_KEY is set
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise ValueError(
        "GROQ_API_KEY environment variable is required. "
        "Please set it in your .env file or environment."
    )

# Initialize LLM, using groq
llm = ChatGroq(model="llama3-8b-8192", temperature=0, api_key=groq_api_key)

# DucKDuckGo Search tool
search = DuckDuckGoSearchRun()

# Prompt template
prompt_template = """
You are a highly skilled AI journalist. Your task is to write a concise, engaging, and informative summary of a given topic based on a web search.

Your summary should be around 150-200 words, written in a clear and neutral tone, suitable for a news report.
Please synthesize the information from the search results into a coherent narrative. Do not just list the facts.

TOPIC:
{topic}

WEB SEARCH RESULTS:
{search_results}

Based on the above information, please generate the news summary.
"""
prompt = PromptTemplate.from_template(prompt_template)

# Langchain Chain
chain = prompt | llm | StrOutputParser()


def generate_summary_for_topic(topic: str) -> str:
    """
    Generate summary for a given topic using web search and llm
    """
    print(f"-> [Summarizer] Kicking off summarization for topic: {topic}")

    # A: Run the web search to get initial information
    print(f"-> [Summarizer] Performing web search...")
    search_results = search.run(f"news and recent developments about {topic}")
    print(f"-> [Summarizer] Web search completed.")

    # B: Invoke the chain with the topic and search results
    print(f"-> [Summarizer] Invoking LLM chain...")
    summary = chain.invoke({"topic": topic, "search_results": search_results})
    print(f"-> [Summarizer] LLM chain invocation complete.")

    return summary
