from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import sys
import io
import os
import logging
import gc
from contextlib import redirect_stdout
import traceback
from typing import Optional
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Virtual Python Lab Backend",
    description="Backend service for Virtual Python Lab",
    version="1.0.0"
)

# Get configuration from environment variables
CORS_ORIGINS = eval(os.getenv("CORS_ORIGINS", "['*']"))
ALLOWED_HOSTS = eval(os.getenv("ALLOWED_HOSTS", "['*']"))
COMPILER_TIMEOUT = int(os.getenv("COMPILER_TIMEOUT", "30"))

# Konfigurasi CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeExecutor:
    def __init__(self):
        self.globals = {}
        self.locals = {}
    
    async def execute(self, code: str) -> tuple[str, str]:
        stdout = io.StringIO()
        stderr = io.StringIO()
        
        try:
            with redirect_stdout(stdout):
                try:
                    async with asyncio.timeout(COMPILER_TIMEOUT):
                        exec(code, self.globals, self.locals)
                except asyncio.TimeoutError:
                    return "", f"Error: Code execution timed out after {COMPILER_TIMEOUT} seconds"
                except MemoryError:
                    gc.collect()  # Force garbage collection
                    return "", "Error: Memory limit exceeded"
            return stdout.getvalue(), ""
        except Exception as e:
            traceback.print_exc(file=stderr)
            return stdout.getvalue(), stderr.getvalue()
        finally:
            stdout.close()
            stderr.close()
            # Cleanup untuk mengurangi memory usage
            gc.collect()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    client = f"{websocket.client.host}:{websocket.client.port}"
    logger.info(f"New WebSocket connection from {client}")
    
    try:
        await websocket.accept()
        logger.info(f"WebSocket connection accepted for {client}")
        executor = CodeExecutor()
        
        while True:
            try:
                code = await websocket.receive_text()
                if not code:
                    continue
                    
                logger.info(f"Received code from {client}: {code[:50]}...")
                
                output, error = await executor.execute(code)
                logger.info(f"Code execution completed for {client}")
                
                if not websocket.client_state.DISCONNECTED:
                    await websocket.send_json({
                        "output": output,
                        "error": error
                    })
            except Exception as e:
                logger.error(f"Error during code execution for {client}: {str(e)}")
                if not websocket.client_state.DISCONNECTED:
                    await websocket.send_json({
                        "output": "",
                        "error": f"Server error: {str(e)}"
                    })
                break  # Keluar dari loop jika terjadi error
    except Exception as e:
        logger.error(f"WebSocket error for {client}: {str(e)}")
    finally:
        logger.info(f"WebSocket connection closed for {client}")
        if not websocket.client_state.DISCONNECTED:
            await websocket.close()
        gc.collect()  # Force garbage collection

@app.get("/health")
async def health_check():
    memory_usage = gc.get_count()
    return {
        "status": "healthy",
        "version": "1.0.0",
        "cors_origins": CORS_ORIGINS,
        "allowed_hosts": ALLOWED_HOSTS,
        "memory_usage": memory_usage
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    ) 