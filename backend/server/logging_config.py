"""
xrisk - Zentrale Logging-Konfiguration
Author: Manuel Schott

Zentrale Konfiguration für alle Logger mit einheitlicher Rotation und Komprimierung
"""

import os
import gzip
import shutil
import logging
from logging.handlers import TimedRotatingFileHandler


def gzip_rotator(source, dest):
    """
    Komprimiert rotierte Log-Dateien mit gzip
    
    Args:
        source: Pfad zur zu komprimierenden Datei
        dest: Ziel-Pfad (ohne .gz Extension)
    """
    with open(source, 'rb') as f_in:
        with gzip.open(f'{dest}.gz', 'wb') as f_out:
            shutil.copyfileobj(f_in, f_out)
    os.remove(source)


def create_rotating_file_handler(
    log_file_path: str,
    level: int = logging.INFO,
    formatter: logging.Formatter = None,
    when: str = 'midnight',
    interval: int = 1,
    backup_count: int = 7,
    encoding: str = 'utf-8'
) -> TimedRotatingFileHandler:
    """
    Erstellt einen konfigurierten TimedRotatingFileHandler mit Komprimierung
    
    Args:
        log_file_path: Vollständiger Pfad zur Log-Datei
        level: Log-Level (default: INFO)
        formatter: Optional - Logging Formatter (default: Standard-Format)
        when: Rotations-Intervall (default: 'midnight' = täglich um Mitternacht)
        interval: Intervall-Multiplikator (default: 1 = jeden Tag)
        backup_count: Anzahl der aufzubewahrenden Backup-Dateien (default: 7 Tage)
        encoding: Datei-Encoding (default: 'utf-8')
    
    Returns:
        Konfigurierter TimedRotatingFileHandler
    """
    handler = TimedRotatingFileHandler(
        log_file_path,
        when=when,
        interval=interval,
        backupCount=backup_count,
        encoding=encoding
    )
    
    # Dateiname-Suffix für rotierte Dateien: logfile.log.2025-11-11
    handler.suffix = '%Y-%m-%d'
    
    # Komprimierung aktivieren
    handler.rotator = gzip_rotator
    
    # Log-Level setzen
    handler.setLevel(level)
    
    # Formatter setzen (falls keiner übergeben wurde, Standard-Format verwenden)
    if formatter is None:
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
    handler.setFormatter(formatter)
    
    return handler


def setup_logger(
    logger_name: str,
    log_file_name: str,
    log_dir: str,
    level: int = logging.INFO,
    console_output: bool = True
) -> logging.Logger:
    """
    Richtet einen vollständig konfigurierten Logger mit Console- und File-Handler ein
    
    Args:
        logger_name: Name des Loggers (z.B. 'OpenAI_API')
        log_file_name: Dateiname der Log-Datei (z.B. 'openai_api.log')
        log_dir: Verzeichnis für Log-Dateien
        level: Log-Level (default: INFO)
        console_output: Ob auch auf Console geloggt werden soll (default: True)
    
    Returns:
        Konfigurierter Logger
    """
    import sys
    
    logger = logging.getLogger(logger_name)
    logger.setLevel(level)
    logger.handlers.clear()
    
    # Standard-Formatter
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    
    # Console Handler (STDOUT)
    if console_output:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(level)
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)
    
    # File Handler (mit Rotation)
    if log_dir:
        try:
            os.makedirs(log_dir, exist_ok=True)
            log_file_path = os.path.join(log_dir, log_file_name)
            file_handler = create_rotating_file_handler(
                log_file_path,
                level=level,
                formatter=formatter
            )
            logger.addHandler(file_handler)
            logger.info(f"Logger '{logger_name}' configured with daily rotation: {log_file_path}")
        except Exception as e:
            if console_output:
                logger.error(f"Failed to create file handler for {log_file_name}: {e}")
    
    logger.propagate = False
    return logger

