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

El botón «English» / «Español» cambia manualmente el idioma y guarda la elección en el navegador, con prioridad sobre la detección automática. Está disponible con la guía apagada o encendida. Si está encendida, interrumpe el audio anterior y reproduce la sección actual en el idioma elegido; si está apagada, permanece en silencio. Las explicaciones escuchadas se registran por idioma durante la visita.

La preferencia se comparte con toda la página mediante `src/lib/Idioma.tsx`: navegación, contenido, controles, etiquetas accesibles, título del documento y descripción. El diccionario inglés está en `src/lib/traducciones.en.json`; el español se conserva en el código fuente. Se mantiene la clave de almacenamiento existente para respetar elecciones anteriores. El mapa recibe el idioma seleccionado; los textos incorporados dentro de imágenes pertenecen a los archivos originales.

Verificación del renderizado bilingüe: `node scripts/test-idiomas.mjs`. Compilación: `npm run build`.
