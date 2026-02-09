#!/bin/bash

echo "🚀 Iniciando Protocolo GUATZIK..."

# --- PASO 1: ENCENDER EL CEREBRO (BACKEND) ---
echo "🔌 Conectando Backend Python..."
cd backend
source venv/bin/activate
# El '&' al final es vital: hace que corra en segundo plano
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..
sleep 2 # Esperamos un poco para que el backend respire

# --- PASO 2: ENCENDER EL ROSTRO (FRONTEND) ---
echo "💻 Iniciando Interfaz Visual..."
# '-- --host' permite entrar desde el celular
npm run dev -- --host &
FRONTEND_PID=$!

echo " "
echo "✅ SISTEMA EN LÍNEA"
echo "------------------------------------------------"
echo "📱 Mira la IP 'Network' arriba para entrar con tu celular."
echo "🔴 Para apagar todo, presiona Ctrl + C"
echo "------------------------------------------------"

# Mantener el script vivo hasta que tú lo cierres
wait $BACKEND_PID $FRONTEND_PID
