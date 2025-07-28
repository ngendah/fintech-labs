import asyncio
import logging
import os
import tempfile
import uuid
from pathlib import Path
from typing import List
from urllib.parse import unquote, urlparse

import requests
from aiohttp import ClientSession
from llama_index.core.workflow import Context

logger = logging.getLogger(__name__)


async def _validate_url(session: ClientSession, url: str) -> None:
    try:
        async with session.head(
            url, allow_redirects=True, timeout=5
        ) as response:
            response.raise_for_status()
            content_type = response.headers.get("Content-Type", "").lower()
            if "application/pdf" not in content_type:
                raise ValueError(
                    f"Expected 'application/pdf', got Content-Type: {content_type} from url {url}"
                )
    except requests.RequestException as e:
        raise ValueError(f"URL validation request failed: {e}") from e


def _extract_filename(url: str) -> str:
    path = unquote(urlparse(url).path)
    filename = os.path.basename(path)
    return filename if filename else f"{uuid.uuid4().hex}.pdf"


async def _download_pdf(
    session: ClientSession, url: str, file_path: Path
) -> str:
    """Download a pdf file from the web and returns the file path"""
    try:
        # await _validate_url(session, url)
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "application/pdf,application/octet-stream",
        }
        async with session.get(
            url,
            headers=headers,
        ) as response:
            response.raise_for_status()
            with open(file_path, "wb") as f:
                async for chunk in response.content.iter_chunked(8192):
                    f.write(chunk)
        return file_path.as_posix()
    except requests.RequestException as e:
        logger.error(e)
        return f"File could not be download from the url {url}"


async def _retrieve_or_download_pdf(session: ClientSession, url: str) -> str:
    """Retrieve or Download a pdf file from the web and returns the file path"""
    filename = _extract_filename(url)
    temp_dir = Path(tempfile.gettempdir())
    file_path = temp_dir / filename
    if os.path.isfile(file_path):
        return file_path.as_posix()
    return await _download_pdf(session, url, file_path)


async def retrieve_pdfs(context: Context, urls: List[str]) -> List[str]:
    """Retrieve a list of pdf files from the web and returns the file paths. Your input should be the document urls to retrieve"""

    async def retrieve_or_download_files(s: ClientSession):
        tasks = [_retrieve_or_download_pdf(s, url) for url in urls]
        return await asyncio.gather(*tasks)

    async with ClientSession() as session:
        file_paths = await retrieve_or_download_files(session)
    return file_paths
