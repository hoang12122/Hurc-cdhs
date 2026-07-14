FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY infra/etl-accepted-relay/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY infra/etl-accepted-relay/main.py ./main.py
USER 65532:65532
CMD ["python", "main.py"]
