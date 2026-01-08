"""
Performance Logger - Zeitmessung für wichtige Funktionen
Author: Manuel Schott

Loggt Start/End-Zeiten und Dauer nur wenn DEBUG_ENABLED=True
"""

import logging
import time
from contextlib import contextmanager
from config import Config

logger = logging.getLogger('application')


@contextmanager
def perf_timer(operation_name):
    """
    Context Manager für Performance-Logging.
    Loggt Start, End und Dauer nur wenn DEBUG_ENABLED=True.
    
    Usage:
        with perf_timer("Workflow Execution"):
            # Code hier
            pass
    """
    # Nur im Debug-Modus loggen
    if not Config.DEBUG_ENABLED:
        yield
        return
    
    start_time = time.time()
    logger.info(f"[PERF] START: {operation_name}")
    
    try:
        yield
        
        # End-Zeit und Dauer
        end_time = time.time()
        duration = end_time - start_time
        logger.info(f"[PERF] END: {operation_name} - Duration: {duration:.2f}s")
        
    except Exception as e:
        # Bei Fehler auch loggen
        end_time = time.time()
        duration = end_time - start_time
        logger.error(f"[PERF] FAILED: {operation_name} - Duration: {duration:.2f}s - Error: {str(e)}")
        raise

