from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import sys
import io
import os
from contextlib import redirect_stdout
import traceback
from typing import Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Virtual Python Lab Backend",
    description="Backend service for Virtual Python Lab",
    version="1.0.0"
)

# Get configuration from environment variables
CORS_ORIGINS = eval(os.getenv("CORS_ORIGINS", "[]"))
ALLOWED_HOSTS = eval(os.getenv("ALLOWED_HOSTS", "[]"))
COMPILER_TIMEOUT = int(os.getenv("COMPILER_TIMEOUT", "30"))

# Konfigurasi CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "WEBSOCKET"],
    allow_headers=["*"],
)

class CodeExecutor:
    def __init__(self):
        self.globals = {}
        self.locals = {}
    
    async def execute(self, code: str) -> tuple[str, str]:
        # Redirect stdout untuk menangkap output
        stdout = io.StringIO()
        stderr = io.StringIO()
        
        try:
            # Set timeout untuk eksekusi kode
            with redirect_stdout(stdout):
                try:
                    # Jalankan kode dengan timeout
                    async with asyncio.timeout(COMPILER_TIMEOUT):
                        # Compile dan eksekusi kode
                        exec(code, self.globals, self.locals)
                except asyncio.TimeoutError:
                    return "", f"Error: Code execution timed out after {COMPILER_TIMEOUT} seconds"
            return stdout.getvalue(), ""
        except Exception as e:
            # Tangkap error dan format traceback
            traceback.print_exc(file=stderr)
            return stdout.getvalue(), stderr.getvalue()
        finally:
            stdout.close()
            stderr.close()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    executor = CodeExecutor()
    
    try:
        while True:
            # Terima kode dari client
            code = await websocket.receive_text()
            
            if not code:
                continue
                
            # Eksekusi kode
            output, error = await executor.execute(code)
            
            # Kirim hasil ke client
            await websocket.send_json({
                "output": output,
                "error": error
            })
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
        if not websocket.client_state.DISCONNECTED:
            await websocket.send_json({
                "output": "",
                "error": f"Server error: {str(e)}"
            })
    finally:
        if not websocket.client_state.DISCONNECTED:
            await websocket.close()

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    ) 