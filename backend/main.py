import psutil 
import time 
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# Configuracion de seguridad (cors)
# Realizara que react (que corre en el puerto 5173) hable con python (puerto 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # El asterisco permite TODAS las conexiones (Tu celular)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- UTILIDAD: CALCULAR VELOCIDAD DE RED ---
# Psutil devuelve el total de bytes enviados desde que prendiste la PC.
# Necesitamos calcular la diferencia para saber la velocidad actual.
last_net_io = psutil.net_io_counters()
last_time = time.time()

def get_network_speed():
    global last_net_io, last_time
    
    current_net_io = psutil.net_io_counters()
    current_time = time.time()
    
    # Tiempo transcurrido
    time_delta = current_time - last_time
    if time_delta == 0: return 0, 0
    
    # Bytes transcurridos
    bytes_sent = current_net_io.bytes_sent - last_net_io.bytes_sent
    bytes_recv = current_net_io.bytes_recv - last_net_io.bytes_recv
    
    # Velocidad en MB/s
    upload_speed = (bytes_sent / time_delta) / (1024 * 1024)
    download_speed = (bytes_recv / time_delta) / (1024 * 1024)
    
    # Actualizar referencia
    last_net_io = current_net_io
    last_time = current_time
    
    return upload_speed, download_speed

# --- ENDPOINT DE SALUD (HTTP CLÁSICO) ---
@app.get("/")
def read_root():
    return {"system": "GUATZIK v3.0", "status": "OPERATIONAL", "backend": "Python/FastAPI"}

# --- EL CEREBRO DE TIEMPO REAL (WEBSOCKET) ---
@app.websocket("/ws/system")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("[CONEXIÓN] Cliente Guatzik conectado.")
    
    try:
        while True:
            # 1. Leer CPU y RAM
            cpu_percent = psutil.cpu_percent(interval=None)
            ram = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            # 2. Calcular Red
            up_speed, down_speed = get_network_speed()
            total_speed = up_speed + down_speed
            
            # 3. Empaquetar datos para React
            payload = {
                "cpu_load": cpu_percent,
                "ram_percent": ram.percent,
                "ram_used_gb": round(ram.used / (1024**3), 2),
                "disk_percent": disk.percent,
                "net_speed_mb": round(total_speed, 1), # Suma subida y bajada
                "net_up_mb": round(up_speed, 2),
                "net_down_mb": round(down_speed, 2),
                "timestamp": time.strftime("%H:%M:%S")
            }
            
            # 4. Enviar a React
            await websocket.send_json(payload)
            
            # 5. Esperar un poco (Ritmo de actualización)
            # 0.5 segundos es rápido y fluido ("Matrix style")
            await asyncio.sleep(0.5) 
            
    except WebSocketDisconnect:
        print("[DESCONEXIÓN] Cliente Guatzik cerrado.")
    except Exception as e:
        print(f"[ERROR] {e}")