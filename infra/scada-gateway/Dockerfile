FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY infra/scada-gateway/requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

COPY infra/scada-gateway/main.py ./main.py
COPY infra/scada-gateway/config.example.yaml ./config.example.yaml

RUN useradd --create-home --uid 10004 scada \
    && mkdir -p /config \
    && chown -R scada:scada /app /config
USER scada

EXPOSE 8091
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8091"]
