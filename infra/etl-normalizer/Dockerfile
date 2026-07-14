FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY infra/etl-normalizer/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY infra/etl-normalizer/contract.py infra/etl-normalizer/main.py infra/etl-normalizer/registry.py ./
COPY infra/etl/contracts ./contracts

RUN useradd --create-home --uid 10002 etl && chown -R etl:etl /app
USER etl

EXPOSE 8082
CMD ["python", "main.py"]
