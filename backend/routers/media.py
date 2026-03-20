from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import yt_dlp
import os

router = APIRouter()

# Carpeta donde caerán los videos
DOWNLOAD_DIR = "downloads"
if not os.path.exists(DOWNLOAD_DIR):
    os.makedirs(DOWNLOAD_DIR)

class DownloadRequest(BaseModel):
    url: str

@router.post("/download")
async def download_content(request: DownloadRequest):
    print(f"[MEDIA] Descargando: {request.url}")
    try:
        ydl_opts = {
            'outtmpl': f'{DOWNLOAD_DIR}/%(title)s.%(ext)s',
            'format': 'best',
            'noplaylist': True,
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(request.url, download=True)
            filename = ydl.prepare_filename(info)
        return {"status": "success", "file": filename}
    except Exception as e:
        print(f"[ERROR] {e}")
        raise HTTPException(status_code=500, detail=str(e))
