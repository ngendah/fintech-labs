# TODO: Evaluate with (Ragas)[https://docs.ragas.io/]
#
from pathlib import Path

from llama_index.core.agent.workflow import (
    AgentInput,
    AgentOutput,
    AgentStream,
    ToolCall,
    ToolCallResult,
)
from pydantic import FileUrl

from .config import LLMConfig
from .llm import LLM, DataSource

# 📊 Basic Analysis
basic = [
    "What was Safaricom net income in 2022?",  # failing
    "How much revenue did Safaricom generate in 2023?",  # passing
    "How much revenue did Equity Bank generate in 2023?",  # passing
    "What were the total assets of Safaricom in 2021?",  # failing
    "How did Equity Bank's profit change in 2024 compared to 2023?",  # passing
    "Can you summarize the key financial highlights for Equity Bank in 2024?",  # passing
]

# 📈 Comparison Questions
comparison = [
    "Compare the net profits of Safaricom and Equity Bank in 2023.",
    "Which company had a higher return on equity in 2021?",
    "Compare total revenues between the two companies in 2022.",
    "In 2024, which company had stronger financial growth indicators?",
]

# 📝 Summarization
summarization = [
    "Give me a high-level summary of Safaricom’s 2021 financial report.",
    "Summarize the income statement for Equity Bank in 2024.",
    "What are the key insights from Safaricom’s 2023 annual report?",
]

# ❓ Incomplete / Clarification Needed
incomplete = [
    "How did Equity Bank perform last year?",
    "What was the revenue?",
    "Tell me about the financials of Safaricom.",
    "Compare both companies’ net income.",
    "How much profit was made in 2022?",
]

# ❌ Out-of-Scope Questions
out_of_scope = [
    "What’s the stock forecast for Safaricom in 2025?",
    "Compare Equity Bank’s performance with KCB Bank.",
    "What was Safaricom’s customer growth trend in 2020?",
    "How is the Kenyan banking sector expected to grow next year?",
    "Can you provide ESG rankings for Equity Bank?",
]

# 🧪 Edge Cases / Ambiguous Wording
edge_cases = [
    "How did things go financially for Safaricom in 2023?",
    "Which of the two did better in the latest year?",
    "Was Equity Bank more profitable than Safaricom last year?",
    "Show me the financial performance comparison for both firms.",
    "How were their earnings over the last few years?",
]


async def main():
    data_source = DataSource(
        sources=[
            FileUrl((Path.cwd() / Path("financial_report_sources.json")).as_uri())
        ],
    )
    config = LLMConfig()
    llm = LLM(config=config, document_source=data_source, verbose=True)
    handler = llm.query(
        "What can you tell me about safaricom financial performance in 2024?"
        # basic[4]
        # comparison[0],
        # summarization[1]
        # incomplete[2]
        # out_of_scope[3]
        # edge_cases[2]
    )
    current_agent = None
    async for event in handler.stream_events():
        if (
            hasattr(event, "current_agent_name")
            and event.current_agent_name != current_agent
        ):
            current_agent = event.current_agent_name
            print(f"\n{'=' * 50}")
            print(f"🤖 Agent: {current_agent}")
            print(f"{'=' * 50}\n")
        if isinstance(event, AgentStream):
            if event.delta:
                print(event.delta, end="", flush=True)
        elif isinstance(event, AgentInput):
            print("\n")
            print("📥 Agent Input")
            print(event.input)
            print("\n")
        elif isinstance(event, AgentOutput):
            if event.response.content:
                print("\n")
                print("📤 Agent Output")
                print(event.response.content)
                print("\n")
            if event.tool_calls:
                print("\n")
                print("🛠️ Planning to use tools")
                print(
                    [call.tool_name for call in event.tool_calls],
                )
                print("\n")
        elif isinstance(event, ToolCallResult):
            print("\n")
            print(f"🔧 Tool Result: ({event.tool_name}):")
            print(f"  Arguments: {event.tool_kwargs}")
            print(f"  Output: {event.tool_output}")
            print("\n")
        elif isinstance(event, ToolCall):
            print("\n")
            print(f"🔨 Calling Tool: {event.tool_name}")
            print(f"  With arguments: {event.tool_kwargs}")
            print("\n")
    response = await handler
    print(str(response))
