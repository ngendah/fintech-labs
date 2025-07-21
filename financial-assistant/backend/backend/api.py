import os
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from llama_index.core.agent.workflow import AgentStream
from pydantic import FileUrl

from backend.llm.config import LLMConfig
from backend.llm.documents.document import Document
from backend.llm.llm import LLM
from backend.llm.tools import tools

enable_docs = os.getenv("ENABLE_DOCS", "false").lower() == "true"

app = (
    FastAPI()
    if enable_docs
    else FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
)


@app.websocket("chat/")
async def llm_chat(
    websocket: WebSocket,
):
    try:
        await websocket.accept()
        file_path = Path.cwd() / Path(
            ".tmp/downloads/2024-Annual-Report-Update.pdf"
        )
        documents = [
            Document(
                name="Safaricom Financials for 2024",
                description="Provides information about Safaricom 2024 annual financial performance report for the year. "
                "Use a detailed plain text question as input to the tool.",
                sources=[FileUrl(file_path.as_uri())],
            ),
        ]
        config = LLMConfig()
        llm = LLM(config=config, documents=documents, tools=tools)
        while True:
            query = await websocket.receive_text()
            handler = llm.query(query=query)
            async for ev in handler.stream_events():
                if isinstance(ev, AgentStream):
                    await websocket.send_text(ev.response)
    except WebSocketDisconnect:
        pass
