FROM python:3.12-slim AS base
RUN pip install --no-cache-dir poetry
ENV POETRY_VIRTUALENVS_PATH=/app
RUN adduser --system --no-create-home --group fintech-labs

FROM base AS build
RUN mkdir /app
COPY . /app
RUN cd /app && poetry install --only main; \
    cd /app && find . \( -name cache -o -name artifacts -o -name __pycache__ \) -type d -exec rm -rf {} +;

FROM base
COPY --from=build --chown=fintech-labs:fintech-labs /app /app
USER fintech-labs
WORKDIR /app
EXPOSE 8000
ENTRYPOINT ["poetry"]
CMD ["run", "fastapi", "run", "backend/api.py"]

