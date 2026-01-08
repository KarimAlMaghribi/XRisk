#!/usr/bin/env python3
"""
Generates apispec.json from Swagger documentation in code.

Usage:
    python generate_api_spec.py
    python3 generate_api_spec.py
    ./deploy/generate_api_spec.py

Requirements:
    - DEBUG_ENABLED=true in .env (or set as environment variable)
    - flasgger installed (pip install flasgger)
    - Flask app must be importable

The generated apispec.json can be used with Swagger UI or other API documentation tools.
"""

import json
import sys
import os

os.environ['DEBUG_ENABLED'] = 'true'
if not os.environ.get('DATABASE_URL'):
    os.environ['DATABASE_URL'] = 'postgresql://dummy:dummy@localhost:5432/dummy'
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(script_dir)
server_dir = os.path.join(project_root, 'server')
sys.path.insert(0, server_dir)

try:
    from app import app
    
    with app.app_context():
        if hasattr(app, 'extensions') and 'flasgger' in app.extensions:
            swagger_instance = app.extensions['flasgger']
            spec = swagger_instance.get_apispecs()
        elif 'flasgger' in app.blueprints:
            with app.test_client() as client:
                response = client.get('/apispec.json')
                if response.status_code == 200:
                    spec = response.get_json()
                else:
                    raise Exception(f"Failed to get spec from /apispec.json: {response.status_code}")
        else:
            from flasgger import Swagger
            swagger_instance = Swagger(app)
            spec = swagger_instance.get_apispecs()
    
    if not spec:
        raise Exception("Failed to generate API spec - spec is empty")
    
    output_file = 'apispec.json'
    output_path = os.path.join(project_root, output_file)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(spec, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Generated {output_file}")
    print(f"  Total endpoints: {len(spec.get('paths', {}))}")
    
except ImportError as e:
    print(f"Error: {e}")
    print("\nPlease install required dependencies:")
    print("  pip install -r requirements.txt")
    print("\nOr install flasgger specifically:")
    print("  pip install flasgger")
    sys.exit(1)
except Exception as e:
    print(f"Error generating spec: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

