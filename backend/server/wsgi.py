"""
xrisk - WSGI Application
Author: Manuel Schott

WSGI entry point for production deployment with Gunicorn
"""

import sys
import os

# Add server directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

# Load environment variables from .env and .env.local files as early as possible
from dotenv import load_dotenv
import os

# Load .env first
load_dotenv()

# Load .env.local if it exists (for local development)
if os.path.exists('.env.local'):
    load_dotenv('.env.local')

from app import create_app

# Create the application instance
# WSGI standard requires the variable to be named 'application'
application = create_app()

# Keep 'app' as alias for backwards compatibility
app = application

if __name__ == "__main__":
    app.run()
