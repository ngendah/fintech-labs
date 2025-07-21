from pydantic import FileUrl
from .data.source import Document
from .llm import LLM
from .config import LLMConfig
from .tools import tools

if __name__=="__main__":
    documents = [
        Document(name="Safaricom Financials for 2024",
                 description="Safaricom, Annual financial performance report for the year 2024",
                 sources=[FileUrl("https://www.safaricom.co.ke/images/Downloads/2024-Annual-Report-Update.pdf")],
                 ),
    ]
    config = LLMConfig()
    llm = LLM(config, documents, tools)
    response = llm.query("What was safaricom Revenue Growth for the year 2024?")


