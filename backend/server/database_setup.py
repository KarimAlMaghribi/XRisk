#!/usr/bin/env python3
"""
Database setup script for xrisk application
Run this script to create the database and tables
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

load_dotenv()

if os.path.exists('.env.local'):
    load_dotenv('.env.local')

def create_database():
    """Create the database if it doesn't exist"""
    try:
        database_url = os.environ.get('DATABASE_URL')
        
        if not database_url:
            print("Error: Database connection string not found in environment variables")
            print("Please set DATABASE_URL in your .env file")
            return False
        
        if 'postgresql://' in database_url:
            db_name = database_url.split('/')[-1]
            base_url = database_url.rsplit('/', 1)[0]
            
            postgres_url = f"{base_url}/postgres"
            
            engine = create_engine(postgres_url)
            
            with engine.connect() as conn:
                result = conn.execute(text(f"SELECT 1 FROM pg_database WHERE datname = '{db_name}'"))
                if not result.fetchone():
                    conn.execute(text(f"CREATE DATABASE {db_name}"))
                    conn.commit()
                    print(f"Database '{db_name}' created successfully")
                else:
                    print(f"Database '{db_name}' already exists")
            
            return True
            
    except SQLAlchemyError as e:
        print(f"Database creation error: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False

def create_tables():
    """Create all tables in the database"""
    try:
        from app import app, db
        
        with app.app_context():
            db.create_all()
            print("All tables created successfully")
            return True
            
    except Exception as e:
        print(f"Table creation error: {e}")
        return False

def migrate_database():
    """Run database migrations for schema updates"""
    import logging
    from sqlalchemy import inspect, text
    
    logger = logging.getLogger('application')
    
    try:
        from app import app, db
        
        # This function might be called from app.py's create_app() where we're already in app_context
        # Or from main() where we need to create the context
        def _run_migrations():
            inspector = inspect(db.engine)
            
            # Migration 1: Add processing_since column to risk_assessments
            if 'risk_assessments' not in inspector.get_table_names():
                logger.info("Table 'risk_assessments' does not exist yet, skipping migration")
                print("Table 'risk_assessments' does not exist yet, skipping migration")
                return True
            
            columns = [col['name'] for col in inspector.get_columns('risk_assessments')]
            
            # Migration 1: processing_since
            if 'processing_since' not in columns:
                logger.info("Running migration: Adding 'processing_since' column...")
                print("Adding 'processing_since' column to risk_assessments table...")
                with db.engine.connect() as conn:
                    conn.execute(text('''
                        ALTER TABLE risk_assessments 
                        ADD COLUMN processing_since TIMESTAMP
                    '''))
                    conn.commit()
                logger.info("Migration completed: processing_since column added")
                print("processing_since column added successfully")
            else:
                logger.info("Migration check: processing_since column already exists")
            
            # Migration 2: retry_count
            if 'retry_count' not in columns:
                logger.info("Running migration: Adding retry mechanism columns...")
                print("Adding retry mechanism columns to risk_assessments table...")
                with db.engine.connect() as conn:
                    conn.execute(text('''
                        ALTER TABLE risk_assessments 
                        ADD COLUMN retry_count INTEGER DEFAULT 0 NOT NULL,
                        ADD COLUMN failed_at TIMESTAMP,
                        ADD COLUMN failed_reason TEXT,
                        ADD COLUMN admin_notified BOOLEAN DEFAULT FALSE NOT NULL
                    '''))
                    conn.commit()
                logger.info("Migration completed: retry mechanism columns added")
                print("Retry mechanism columns added successfully")
            else:
                logger.info("Migration check: retry mechanism columns already exist")
            
            # Migration 3: Rename inquery -> inquiry
            if 'inquery' in columns and 'inquiry' not in columns:
                logger.info("Running migration: Renaming 'inquery' column to 'inquiry'...")
                print("Renaming column 'inquery' to 'inquiry' in risk_assessments table...")
                with db.engine.connect() as conn:
                    # 1. Rename column
                    conn.execute(text('''
                        ALTER TABLE risk_assessments RENAME COLUMN inquery TO inquiry
                    '''))
                    conn.commit()
                logger.info("Migration completed: 'inquery' column renamed to 'inquiry'")
                print("Renamed column 'inquery' to 'inquiry' successfully")
                columns = [col['name'] for col in inspector.get_columns('risk_assessments')]
            # Migration 4: Update all status='inquery' to 'inquiry_awaiting_response'
            # Also clean up any very old status/inconsistencies.
            with db.engine.connect() as conn:
                # Only run if status column exists
                if 'status' in columns:
                    logger.info("Updating legacy statuses: 'inquery' → 'inquiry_awaiting_response', 'inquired' stays unchanged")
                    print("Updating legacy risk_assessments statuses in DB...")
                    conn.execute(text("""
                        UPDATE risk_assessments SET status='inquiry_awaiting_response' WHERE status='inquery';
                    """))
                    conn.commit()
                    print("Legacy status migration for 'inquery' complete.")
            
            # Migration 5: Create users table for authentication
            if 'users' not in inspector.get_table_names():
                logger.info("Running migration: Creating 'users' table...")
                print("Creating 'users' table for authentication...")
                with db.engine.connect() as conn:
                    conn.execute(text('''
                        CREATE TABLE users (
                            id SERIAL PRIMARY KEY,
                            user_uuid VARCHAR(36) UNIQUE NOT NULL,
                            email VARCHAR(255) UNIQUE NOT NULL,
                            password_hash VARCHAR(255),
                            name VARCHAR(255),
                            oauth_provider VARCHAR(50),
                            oauth_id VARCHAR(255),
                            is_active BOOLEAN DEFAULT TRUE NOT NULL,
                            is_verified BOOLEAN DEFAULT FALSE NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                            last_login TIMESTAMP,
                            email_verification_token VARCHAR(100) UNIQUE,
                            email_verification_token_expires TIMESTAMP,
                            password_reset_token VARCHAR(100) UNIQUE,
                            password_reset_token_expires TIMESTAMP
                        )
                    '''))
                    conn.execute(text('''
                        CREATE INDEX idx_users_email ON users(email)
                    '''))
                    conn.execute(text('''
                        CREATE INDEX idx_users_user_uuid ON users(user_uuid)
                    '''))
                    conn.commit()
                logger.info("Migration completed: users table created")
                print("Users table created successfully")
            else:
                logger.info("Migration check: users table already exists")
                
                # Migration 5.1: Add token fields to existing users table if missing
                user_columns = [col['name'] for col in inspector.get_columns('users')]
                
                if 'email_verification_token' not in user_columns:
                    logger.info("Running migration: Adding email verification token fields...")
                    print("Adding email verification token fields to users table...")
                    with db.engine.connect() as conn:
                        conn.execute(text('''
                            ALTER TABLE users 
                            ADD COLUMN email_verification_token VARCHAR(100) UNIQUE,
                            ADD COLUMN email_verification_token_expires TIMESTAMP
                        '''))
                        conn.commit()
                    logger.info("Migration completed: email verification token fields added")
                    print("Email verification token fields added successfully")
                
                if 'password_reset_token' not in user_columns:
                    logger.info("Running migration: Adding password reset token fields...")
                    print("Adding password reset token fields to users table...")
                    with db.engine.connect() as conn:
                        conn.execute(text('''
                            ALTER TABLE users 
                            ADD COLUMN password_reset_token VARCHAR(100) UNIQUE,
                            ADD COLUMN password_reset_token_expires TIMESTAMP
                        '''))
                        conn.commit()
                    logger.info("Migration completed: password reset token fields added")
                    print("Password reset token fields added successfully")
                
                # Migration: Add email_verification_token_hash column
                if 'email_verification_token_hash' not in user_columns:
                    logger.info("Running migration: Adding email_verification_token_hash column...")
                    print("Adding email_verification_token_hash column to users table...")
                    with db.engine.connect() as conn:
                        conn.execute(text('''
                            ALTER TABLE users 
                            ADD COLUMN email_verification_token_hash VARCHAR(64)
                        '''))
                        # Create index for faster lookups
                        conn.execute(text('''
                            CREATE INDEX IF NOT EXISTS idx_users_email_verification_token_hash 
                            ON users(email_verification_token_hash)
                        '''))
                        conn.commit()
                    logger.info("Migration completed: email_verification_token_hash column added")
                    print("email_verification_token_hash column added successfully")
                else:
                    logger.info("Migration check: email_verification_token_hash column already exists")
            
            return True
        
        try:
            db.engine
            return _run_migrations()
        except RuntimeError:
            # Not in context, create one
            with app.app_context():
                return _run_migrations()
            
    except Exception as e:
        error_msg = f"Migration error: {e}"
        try:
            logger.warning(error_msg)
        except:
            pass
        print(error_msg)
        print("Continuing anyway - this might be okay if it's a new installation")
        return True  # Don't fail deployment on migration errors

def main():
    """Main setup function"""
    print("xrisk Database Setup")
    print("===================")
    
    if not os.path.exists('.env'):
        print("Warning: .env file not found")
        print("Please create a .env file with your database configuration")
        print("Example:")
        print("DATABASE_URL=postgresql://username:password@localhost:5432/xrisk_db")
        print("OPENAI_API_KEY=your_openai_api_key_here")
        print("SECRET_KEY=your_secret_key_here")
        return
    
    print("\n1. Creating database...")
    if not create_database():
        print("Failed to create database")
        return
    
    print("\n2. Creating tables...")
    if not create_tables():
        print("Failed to create tables")
        return
    
    print("\n3. Running migrations...")
    migrate_database()
    
    print("\nDatabase setup completed successfully!")
    print("\nNext steps:")
    print("1. Make sure PostgreSQL is running")
    print("2. Update your .env file with correct database credentials")
    print("3. Run: python app.py")

if __name__ == '__main__':
    main()
