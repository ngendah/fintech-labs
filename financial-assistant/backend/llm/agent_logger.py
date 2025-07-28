import logging

from llama_index.core.agent.workflow import (
    AgentInput,
    AgentOutput,
    AgentStream,
    ToolCall,
    ToolCallResult,
)

logger = logging.getLogger(__name__)


async def agent_logging(handler):
    current_agent = None
    async for event in handler.stream_events():
        if (
            hasattr(event, "current_agent_name")
            and event.current_agent_name != current_agent
        ):
            current_agent = event.current_agent_name
            logger.debug(f"\n{'=' * 50}")
            logger.debug(f"🤖 Agent: {current_agent}")
            logger.debug(f"{'=' * 50}\n")
        if isinstance(event, AgentStream):
            if event.delta:
                logger.debug(event.delta, end="", flush=True)
        elif isinstance(event, AgentInput):
            logger.debug("\n")
            logger.debug("📥 Agent Input")
            logger.debug(event.input)
            logger.debug("\n")
        elif isinstance(event, AgentOutput):
            if event.response.content:
                logger.debug("\n")
                logger.debug("📤 Agent Output")
                logger.debug(event.response.content)
                logger.debug("\n")
            if event.tool_calls:
                logger.debug("\n")
                logger.debug("🛠️ Planning to use tools")
                logger.debug(
                    [call.tool_name for call in event.tool_calls],
                )
                logger.debug("\n")
        elif isinstance(event, ToolCallResult):
            logger.debug("\n")
            logger.debug(f"🔧 Tool Result: ({event.tool_name}):")
            logger.debug(f"  Arguments: {event.tool_kwargs}")
            logger.debug(f"  Output: {event.tool_output}")
            logger.debug("\n")
        elif isinstance(event, ToolCall):
            logger.debug("\n")
            logger.debug(f"🔨 Calling Tool: {event.tool_name}")
            logger.debug(f"  With arguments: {event.tool_kwargs}")
            logger.debug("\n")
