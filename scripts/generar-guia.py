"""Genera los MP3 estáticos: pip install edge-tts==7.3.1; python scripts/generar-guia.py"""
import asyncio
import argparse
import json
from pathlib import Path
import edge_tts

DESTINO = Path(__file__).resolve().parents[1] / "public" / "audio" / "guia"

async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--language', choices=['es', 'en', 'all'], default='all')
    args = parser.parse_args()
    for language in (['es', 'en'] if args.language == 'all' else [args.language]):
        folder = DESTINO / 'en' if language == 'en' else DESTINO
        folder.mkdir(parents=True, exist_ok=True)
        source = 'guiones.en.json' if language == 'en' else 'guiones.json'
        voice = 'en-US-JennyNeural' if language == 'en' else 'es-MX-DaliaNeural'
        for guion in json.loads((DESTINO / source).read_text(encoding='utf-8')):
            await edge_tts.Communicate(guion['texto'], voice, rate='-5%').save(str(folder / f'{guion["id"]}.mp3'))
            print(f'Generado: {language}/{guion["id"]}')

if __name__ == "__main__":
    asyncio.run(main())
