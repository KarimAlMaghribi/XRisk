FROM python:3.11-slim

WORKDIR /app

# Install system dependencies including Caddy
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    curl \
    debian-keyring \
    debian-archive-keyring \
    apt-transport-https \
    ca-certificates \
    && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg \
    && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list \
    && apt-get update \
    && apt-get install -y caddy \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy .env and Caddyfile BEFORE application code to avoid layer conflicts
COPY .env /app/.env
COPY Caddyfile /etc/caddy/Caddyfile

# Copy application code
COPY . .

# Make startup script executable
RUN chmod +x startup.sh

# Create logs directory and Caddy data directory
# Caddy needs to write certificates and ACME data here (runs as root)
RUN mkdir -p /app/logs /app/caddy-data

# Create non-root user and set ownership
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app && \
    mkdir -p /home/appuser && \
    chown -R appuser:appuser /home/appuser && \
    chown -R root:root /app/caddy-data && \
    chmod 755 /app/caddy-data

# Create wrapper that captures ALL output (as root, will switch user in startup.sh)
RUN echo '#!/bin/bash' > /start-wrapper.sh && \
    echo 'set -x' >> /start-wrapper.sh && \
    echo 'echo "=== WRAPPER STARTING ==="' >> /start-wrapper.sh && \
    echo 'exec 2>&1' >> /start-wrapper.sh && \
    echo '/app/startup.sh' >> /start-wrapper.sh && \
    echo 'EXIT_CODE=$?' >> /start-wrapper.sh && \
    echo 'echo "=== STARTUP EXITED WITH CODE: $EXIT_CODE ==="' >> /start-wrapper.sh && \
    echo 'if [ $EXIT_CODE -ne 0 ]; then' >> /start-wrapper.sh && \
    echo '    echo "STARTUP FAILED - Container staying alive for debugging"' >> /start-wrapper.sh && \
    echo '    sleep 3600' >> /start-wrapper.sh && \
    echo 'fi' >> /start-wrapper.sh && \
    chmod +x /start-wrapper.sh

# Expose ports (80 for HTTP redirect, 443 for HTTPS, 8000 for Flask)
EXPOSE 80 443 8000

# Health check (check Gunicorn directly)
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://127.0.0.1:8000/health || exit 1

# Run wrapper (captures all output, stays alive on error)
CMD ["/start-wrapper.sh"]
