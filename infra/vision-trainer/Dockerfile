FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY infra/vision-trainer/requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

COPY infra/vision-trainer/main.py ./main.py

RUN useradd --create-home --uid 10003 trainer \
    && mkdir -p /data /models \
    && chown -R trainer:trainer /app /data /models
USER trainer

EXPOSE 8090
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8090"]
