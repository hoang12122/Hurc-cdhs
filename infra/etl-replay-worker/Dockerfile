FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app
COPY infra/etl-replay-worker/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY infra/etl-replay-worker/config.py infra/etl-replay-worker/control.py infra/etl-replay-worker/replay.py infra/etl-replay-worker/main.py ./
RUN useradd --create-home --uid 10004 etl-replay && chown -R etl-replay:etl-replay /app
USER etl-replay
EXPOSE 8084
CMD ["python", "main.py"]
