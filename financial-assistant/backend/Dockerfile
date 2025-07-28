FROM python:3.12-slim AS base
RUN pip install --no-cache-dir poetry
RUN adduser --system --group fintech-labs
ENV POETRY_VIRTUALENVS_PATH=/home/fintech-labs
ENV HOME=/home/fintech-labs
WORKDIR /home/fintech-labs

FROM base AS build
RUN mkdir app
COPY poetry.lock pyproject.toml app
RUN cd app && poetry install --only main --no-root --no-directory
COPY . app
RUN cd app && poetry install --only main \
    && find . \( -name cache -o -name artifacts -o -name __pycache__ \) -type d -exec rm -rf {} +;

FROM base
COPY --from=build --chown=fintech-labs:fintech-labs /home/fintech-labs .
USER fintech-labs
WORKDIR app
EXPOSE 8000
ENTRYPOINT ["poetry"]
CMD ["run", "fastapi", "run", "backend/api.py"]

