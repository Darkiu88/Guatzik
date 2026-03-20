import psutil
import time
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

# 👇 1. IMPORTAR TUS NUEVOS MÓDULOS (PLUGINS)
from routers import media, hardware

app = FastAPI()

# Configuración de seguridad (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 👇 2. ENCHUFAR LOS MÓDULOS (Rutas HTTP)
app.include_router(media.router, prefix="/api/media", tags=["Media"])
app.include_router(hardware.router, prefix="/api/hardware", tags=["Hardware"])

# --- UTILIDAD: CALCULAR VELOCIDAD DE RED ---
last_net_io = psutil.net_io_counters()
last_time = time.time()

def get_network_speed():
    global last_net_io, last_time
    
    current_net_io = psutil.net_io_counters()
    current_time = time.time()
    
    time_delta = current_time - last_time
    if time_delta == 0: return 0, 0
    
    # Bytes a Megabits (Mb)
    bytes_sent = current_net_io.bytes_sent - last_net_io.bytes_sent
    bytes_recv = current_net_io.bytes_recv - last_net_io.bytes_recv
    
    upload_speed = ((bytes_sent / time_delta) / (1024 * 1024)) * 8
    download_speed = ((bytes_recv / time_delta) / (1024 * 1024)) * 8  
    
    last_net_io = current_net_io
    last_time = current_time
    
    return upload_speed, download_speed

# --- ENDPOINT DE SALUD ---
@app.get("/")
def read_root():
    return {"system": "GUATZIK v3.0", "status": "ONLINE", "modules": ["Media", "Hardware"]}

# --- EL CEREBRO DE TIEMPO REAL (WEBSOCKET) ---
@app.websocket("/ws/system")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("[CONEXIÓN] Cliente Guatzik conectado.")
    
    try:
        while True:
            # 1. Leer CPU, RAM y Disco
            cpu_percent = psutil.cpu_percent(interval=None)
            ram = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            # 👇 3. LEER TEMPERATURA (NUEVO Y ALINEADO)
            cpu_temp = 0
            try:
                temps = psutil.sensors_temperatures()
                if 'coretemp' in temps: # Intel
                    cpu_temp = temps['coretemp'][0].current
                elif 'k10temp' in temps: # AMD
                    cpu_temp = temps['k10temp'][0].current
                elif temps: # Genérico
                    first_key = list(temps.keys())[0]
                    cpu_temp = temps[first_key][0].current

                # Redondear para que React no reciba muchos decimales
                cpu_temp = round(cpu_temp) 
            except:
                pass # Si falla, se queda en 0
            
            # 4. Calcular Red
            up_speed, down_speed = get_network_speed()
            total_speed = up_speed + down_speed
            
            # 5. Empaquetar datos
            payload = {
                "cpu_load": cpu_percent,
                "cpu_temp": cpu_temp,
                "ram_percent": ram.percent,
                "ram_used_gb": round(ram.used / (1024**3), 2),
                "ram_total_gb": round(ram.total / (1024**3), 1 ),
                "disk_percent": disk.percent,
                "net_speed_mb": round(total_speed, 1),
                "net_up_mb": round(up_speed, 2),
                "net_down_mb": round(down_speed, 2),
                "timestamp": time.strftime("%H:%M:%S")
            }
            
            # 👇 AQUI PONEMOS EL DETECTOR DE MENTIRAS 👇
            print(f"📡 Enviando pulso... Temp: {cpu_temp}°C")
            
            await websocket.send_json(payload)
            
            # Ritmo de actualización (0.5s = Fluido / 1.0s = Ahorro CPU)
            await asyncio.sleep(0.5)
            
    except WebSocketDisconnect:
        print("[DESCONEXIÓN] Cliente Guatzik cerrado.")
    except Exception as e:
        print(f"[ERROR CRÍTICO] {e}")
        await asyncio.sleep(5) # Esperar antes de reintentar si hay error grave