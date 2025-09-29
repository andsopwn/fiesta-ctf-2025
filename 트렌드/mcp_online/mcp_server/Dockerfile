FROM python:3.11-slim-bookworm

WORKDIR /app

# 시스템 패키지 업데이트 및 필요한 패키지 설치
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    wkhtmltopdf \
    xvfb \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY mcp_server.py .

COPY flag /flag

# 포트 노출
EXPOSE 8001

# 애플리케이션 실행
CMD ["python", "mcp_server.py"]
