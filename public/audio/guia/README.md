# Guía de voz

Doce audios MP3 generados con `es-MX-DaliaNeural` (voz femenina, español de México) y `en-US-JennyNeural` (voz femenina, inglés estadounidense), velocidad -5%, mediante edge-tts 7.3.1. Los archivos en inglés están en `en/`.

Los textos están en `guiones.json` y `guiones.en.json`. Para regenerar desde la raíz del proyecto:

```sh
python -m pip install edge-tts==7.3.1
python scripts/generar-guia.py
```

La generación necesita conexión; los visitantes reproducen archivos estáticos del propio sitio, sin llamadas a un servicio de síntesis ni claves de API.

Para regenerar solo un idioma, añade `--language en` o `--language es`. Al cargar la página, la guía elige el primer idioma compatible de `navigator.languages`, en orden de preferencia (incluye variantes como es-MX, es-ES, en-US o en-GB). Usa `navigator.language` si no hay lista e inglés si no hay coincidencia. Los botones y la transcripción siguen el idioma del audio. No utiliza geolocalización.

La guía empieza apagada. Tras activarla, espera 650 ms sin desplazamiento para narrar una sección nueva. Las explicaciones completadas no se repiten automáticamente durante esa visita. El botón «Escuchar sección» permite repetirlas. Se detiene al silenciar, cambiar de sección u ocultar la pestaña. Al regresar, una explicación interrumpida puede comenzar de nuevo.
