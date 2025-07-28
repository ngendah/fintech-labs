import logging
import os
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field, FileUrl, field_serializer

from llm.agent_logger import agent_logging
from llm.config import LLMConfig
from llm.llm import LLM, DataSource

logger = logging.getLogger(__name__)

enable_docs = os.getenv("ENABLE_DOCS", "false").lower() == "true"

app = (
    FastAPI()
    if enable_docs
    else FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
)


class Query(BaseModel):
    id: datetime = Field()
    role: str = Field()
    content: str = Field(max_length=255)

    @field_serializer("id")
    def serialize_id(self, dt: datetime, _info) -> int:
        return int(dt.timestamp() * 1000)


class QueryResponse(Query):
    role: str = Field(default="assistant")
    content: str = Field()
    has_error: bool = Field(default=False)
    error: str | None = Field(default=None)


@app.websocket("/chat")
async def llm_chat(
    websocket: WebSocket,
):
    try:
        await websocket.accept()
        data_source = DataSource(
            name="financial_reports_2023_to_2024_for_safaricom_and_equity_bank",
            description="Provides download urls for annual financial performance reports "
            "for the years 2023 to 2024, for Safaricom PLC and Equity Bank",
            sources=[
                FileUrl(
                    (
                        Path.cwd() / Path("financial_report_sources.json")
                    ).as_uri()
                )
            ],
        )
        config = LLMConfig()
        llm = LLM(config=config, document_source=data_source, verbose=True)
        while True:
            query_obj = await websocket.receive_json()
            query = Query.model_validate(query_obj)
            try:
                handler = llm.query(query=query.content)
                await agent_logging(handler)
                response = await handler
                response = QueryResponse(id=query.id, content=str(response))
                await websocket.send_json(response.model_dump())
            except Exception as err:
                logger.error(err)
                err_response = QueryResponse(
                    id=query.id,
                    content="An error has occurred, while processing your request",
                    has_error=True,
                )
                await websocket.send_json(err_response.model_dump())
    except WebSocketDisconnect:
        pass
    except Exception as err:
        websocket.close(code=0, reason="Internal server error")
