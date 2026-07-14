FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app
COPY infra/timescale-sink/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY infra/timescale-sink/main.py infra/timescale-sink/store.py ./
RUN useradd --create-home --uid 10003 etl-sink && chown -R etl-sink:etl-sink /app
USER etl-sink
EXPOSE 8083
CMD ["python", "main.py"]
