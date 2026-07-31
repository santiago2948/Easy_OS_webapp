/**
 * Copy deck premium. Arco compacto B2B.
 * Claims alineados a Arquitectura Maestra:
 * Comercio exterior · marítimo + aéreo + terrestre · interlocutor responsable · Easy OS interno.
 */
export const CONTACT = {
  email: 'mailto:s.moreno@easy-logistics.co',
  phone: 'tel:+573208976999',
  phoneDisplay: '(+57) 320 8976999',
  whatsapp:
    'https://wa.me/573208976999?text=Hola%20Easy%20Logistics%2C%20quiero%20hablar%20con%20ustedes%20sobre%20una%20operaci%C3%B3n.',
}

export const QUOTE_PATH = '/app/cotizacion'

/** 0. Hero */
export const HERO = {
  kicker: 'Logística internacional B2B',
  title: 'Un planeta.',
  titleAccent: 'Una red logística.',
  lead: 'Marítimo, aéreo y terrestre con un interlocutor responsable de punta a punta.',
  ctaQuote: 'Cotizar',
  ctaPrimary: 'Hablar con un experto',
  ctaSecondary: 'Quiero hablar con un experto',
  hint: 'Scroll',
}

/** Transición post-hero · ensamblaje de marca */
export const BRAND_ASSEMBLY = {
  line: 'Comercio exterior con un aliado que responde.',
}

/**
 * 1. Cómo se trabaja (primera sección post-hero)
 */
export const FLOW = {
  id: 'como',
  kicker: 'Cómo trabajamos',
  title: 'Un solo recorrido. Cinco momentos claros.',
  subtitle: 'De la necesidad al cierre, con dueño en cada tramo.',
  steps: [
    {
      n: '01',
      t: 'Necesidad',
      d: 'Nos cuenta origen, destino, ventana y lo que no puede fallar.',
    },
    {
      n: '02',
      t: 'Cotización',
      d: 'Propuesta revisada, lista para decidir. No una lluvia de opciones.',
    },
    {
      n: '03',
      t: 'Coordinación',
      d: 'Booking, documentos y alineación con operadores. Una línea de responsabilidad.',
    },
    {
      n: '04',
      t: 'Seguimiento',
      d: 'Respuesta mientras la carga se mueve. Sin silencio operativo.',
    },
    {
      n: '05',
      t: 'Facturación',
      d: 'Cierre transparente. Sin sorpresas de último momento.',
    },
  ],
  ctaSoft: 'Cuéntenos su operación',
  contact: {
    whatsapp: 'WhatsApp',
    email: 'Correo',
    phone: 'Llamar',
  },
}

/** 2. Método Easy → paneles (oficio, sistema, resultado, criterio) */
export const METHOD = {
  id: 'easy',
  kicker: 'Por qué Easy',
  empathy: 'Sabemos lo que está en juego cuando una carga no puede fallar.',
  intro:
    'No le entregamos un software. Le entregamos una operación con criterio y un sistema que la sostiene.',
  slides: [
    {
      id: 'oficio',
      label: 'Oficio',
      title: 'Interlocutor con oficio',
      body: 'Alguien que entiende la operación y responde cuando importa. El juicio no se automatiza.',
      img: '/media/mode-sea.jpg',
    },
    {
      id: 'sistema',
      label: 'Sistema',
      title: 'Easy OS',
      body: 'Ordena lo repetible: menos fricción, menos error, más continuidad. La tecnología libera tiempo para acompañarlo.',
      img: '/media/slide-sistema.jpg',
    },
    {
      id: 'resultado',
      label: 'Resultado',
      title: 'Un solo resultado',
      body: 'Conectamos su importación con operadores marítimos y aéreos, y acompañamos hasta el cierre. La tecnología es el medio. El acompañamiento es el producto.',
      img: '/media/mode-road.jpg',
    },
    {
      id: 'criterio',
      label: 'Criterio',
      title: 'Claridad para decidir',
      body: 'Errores que encarecen una importación. Cómo leer una cotización. Documentación que no puede esperar. Compartimos criterio, no ruido.',
      img: '/media/slide-criterio.jpg',
    },
  ],
}

/** Interludio visual entre método y flujo */
export const VIDEO_BAND = {
  line: 'Del origen al destino.',
  subline: 'Marítimo, aéreo y terrestre. Un hilo de seguimiento continuo.',
}

/** Servicios por fase del recorrido (mapa bajo video) */
export const SERVICES = {
  kicker: 'Qué cubrimos',
  title: 'Servicios en cada tramo de su importación.',
  lead: 'Cotizamos y coordinamos el recorrido completo, con un interlocutor responsable.',
  note: 'No todos los servicios aplican en cada operación. Armamos la propuesta según origen, incoterm y destino.',
  phases: [
    {
      id: 'origen',
      label: 'Origen',
      tag: 'En el exterior',
      items: [
        {
          t: 'Transporte terrestre origen',
          d: 'Recogida en planta o bodega hacia puerto o aeropuerto.',
        },
        {
          t: 'Aduana origen',
          d: 'Coordinación del despacho de exportación cuando el incoterm lo requiere.',
        },
      ],
    },
    {
      id: 'transito',
      label: 'Tránsito',
      tag: 'Marítimo · Aéreo · Terrestre',
      items: [
        {
          t: 'Flete internacional',
          d: 'FCL, LCL o carga aérea entre origen y Colombia.',
        },
        {
          t: 'Seguro',
          d: 'Protección de la mercancía durante el trayecto internacional.',
        },
      ],
    },
    {
      id: 'destino',
      label: 'Destino',
      tag: 'En Colombia',
      items: [
        {
          t: 'Aduana destino',
          d: 'Coordinación con agente aduanero, declaración y levante.',
        },
        {
          t: 'Transporte terrestre destino',
          d: 'Puerto o aeropuerto hacia su bodega o punto de entrega.',
        },
        {
          t: 'Almacenamiento',
          d: 'Bodegaje y handling mientras la carga espera liberación o entrega.',
        },
        {
          t: 'Entrega final',
          d: 'Última milla con confirmación de recibido.',
        },
      ],
    },
    {
      id: 'express',
      label: 'Express',
      tag: 'Cuando el tiempo manda',
      items: [
        {
          t: 'Courier',
          d: 'Envíos urgentes de menor volumen con seguimiento dedicado.',
        },
      ],
    },
  ],
}

/** 4. Confianza */
export const TRUST = {
  id: 'confianza',
  kicker: 'Por qué confiar',
  title: 'Confianza que se construye en la ejecución.',
  subtitle: 'Oficio, cobertura y cierre. Lo que sostiene una relación B2B seria.',
  blocks: [
    {
      t: 'Experiencia',
      d: 'Operaciones internacionales con exigencia real, no improvisación de última hora.',
    },
    {
      t: 'Responsabilidad',
      d: 'Un interlocutor que conoce el tramo y asume la conversación difícil cuando hace falta.',
    },
    {
      t: 'Resultados',
      d: 'Operaciones que terminan limpias: documentos, coordinación y facturación alineados.',
    },
  ],
  coverage: {
    t: 'Cobertura',
    modes: [
      { mode: 'Marítimo', d: 'FCL y LCL con criterio de ruta, no solo de tarifa.' },
      { mode: 'Aéreo', d: 'Cuando el tiempo es el activo.' },
      { mode: 'Terrestre', d: 'Del puerto o aeropuerto a su bodega, con seguimiento.' },
    ],
  },
}

export const GEO = {
  what: 'Easy Logistics es un freight broker B2B en Colombia que conecta importadores con operadores de transporte marítimo y aéreo, con interlocutor claro y operación de punta a punta.',
  whoServes:
    'Empresas importadoras en Colombia que necesitan traer mercancía del exterior con control, sin fragmentar la operación entre intermediarios.',
  services: 'Flete marítimo FCL/LCL, carga aérea y coordinación operativa.',
  howQuote:
    'Brief de la operación, cotización revisada, booking, seguimiento documental y cierre transparente.',
  differentiator:
    'Combina criterio humano con Easy OS, su sistema operativo interno, para acelerar lo repetible y dedicar más tiempo a acompañar al cliente.',
}
