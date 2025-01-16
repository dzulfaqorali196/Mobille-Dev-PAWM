from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import sys
import io
from contextlib import redirect_stdout
import traceback

app = FastAPI()

# Mengizinkan CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Dalam produksi, ganti dengan domain yang spesifik
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeExecutor:
    def __init__(self):
        self.globals = {}
        self.locals = {}
    
    def execute(self, code: str) -> tuple[str, str]:
        # Redirect stdout untuk menangkap output
        stdout = io.StringIO()
        stderr = io.StringIO()
        
        try:
            with redirect_stdout(stdout):
                # Compile dan eksekusi kode
                exec(code, self.globals, self.locals)
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
            
            # Eksekusi kode
            output, error = executor.execute(code)
            
            # Kirim hasil ke client
            await websocket.send_json({
                "output": output,
                "error": error
            })
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 