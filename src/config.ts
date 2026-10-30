/**
 * Datos del desarrollo. TODO lo de este archivo es de ejemplo: edítalo con
 * los datos reales antes de publicar (nombre, teléfono, precios, amenidades).
 */
export const SITE = {
  nombre: 'Riviera del Sol',
  /** Palabra grande de la portada. */
  marca: 'Riviera del Sol',
  lema: 'Terrenos residenciales',
  /** WhatsApp en formato internacional, sin "+" ni espacios (México: 52 + 10 dígitos). */
  whatsapp: '5210000000000',
  whatsappVisible: '+52 000 000 0000',
  telefono: '000 000 0000',
  correo: 'ventas@tudominio.com',
  oficinas: 'Calle, número y colonia de tus oficinas de venta, Ciudad, Estado',
  direccion: 'Calle y colonia del desarrollo, Ciudad, Estado',
  /**
   * Foto de portada (ej. '/portada.jpg', guardada en la carpeta public/).
   * Si la dejas vacía, se muestra una ilustración de paisaje.
   */
  heroImagen: '',
  /**
   * Opcional: URL de inserción de Google Maps (Compartir → Insertar un mapa → copia el src).
   * Si la dejas vacía, se muestran los tiempos de traslado.
   */
  mapaEmbed: '',
  /** Opcional: enlace de Google Maps. Si lo dejas vacío, el botón no se muestra. */
  mapsUrl: '',
  /** Precio base por m² (MXN). Esquina +4 %, frente al parque +6 %. */
  precioM2: 8500,
  financiamiento: {
    engancheMin: 10,
    engancheMax: 50,
    plazos: [12, 24, 36, 48, 60],
  },
  amenidades: [
    { icono: 'shield', titulo: 'Acceso controlado' },
    { icono: 'trees', titulo: 'Parque central' },
    { icono: 'racket', titulo: 'Cancha de pádel' },
    { icono: 'route', titulo: 'Calles pavimentadas' },
    { icono: 'lightbulb', titulo: 'Alumbrado público' },
    { icono: 'droplets', titulo: 'Agua y drenaje' },
    { icono: 'footprints', titulo: 'Andadores' },
    { icono: 'sofa', titulo: 'Áreas de descanso' },
  ],
  cercanias: [
    { lugar: 'Plaza comercial', minutos: 10 },
    { lugar: 'Escuelas', minutos: 8 },
    { lugar: 'Hospital', minutos: 15 },
    { lugar: 'Carretera principal', minutos: 5 },
  ],
} as const

