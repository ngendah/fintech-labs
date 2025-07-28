from typing import Any

from pydantic import HttpUrl


class PdfUrl(HttpUrl):
    @classmethod
    def validate(cls, value: Any) -> Any:
        url = super().validate(value)
        if not str(url).lower().endswith(".pdf"):
            raise ValueError("URL must point to a .pdf file")
        return url
