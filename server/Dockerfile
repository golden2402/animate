FROM python:3.11.6-slim-bookworm

ENV VENV /opt/venv
RUN python3 -m venv /opt/venv
ENV PATH "$VENV/bin:$PATH"

COPY ./requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt

WORKDIR /app
COPY ./app .

ENTRYPOINT ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
