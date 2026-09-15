/**
 * Narrativa de la landing · Español.
 * Regla de edición: una idea por línea, nada que ya se haya dicho antes,
 * dato concreto por encima de adjetivo. Voz de usted, B2B.
 */
export const ES = {
  code: 'es',
  label: 'Español',

  hero: {
    kicker: 'Comercio exterior B2B',
    title: 'Un planeta.',
    titleAccent: 'Una red logística.',
    lead: 'Importación marítima, aérea y terrestre hacia Colombia, con una sola persona a cargo de principio a fin.',
    ctaQuote: 'Cotizar',
    ctaSecondary: 'Hablar con un experto',
    hint: 'Scroll',
  },

  brandAssembly: {
    line: 'Comercio exterior con alguien que responde.',
  },

  flow: {
    kicker: 'Cómo trabajamos',
    title: 'De la consulta al cierre, en cinco pasos.',
    subtitle: 'El mismo responsable en todos.',
    steps: [
      {
        n: '01',
        t: 'Necesidad',
        d: 'Origen, destino, incoterm y fecha límite. Con eso arrancamos.',
      },
      {
        n: '02',
        t: 'Cotización',
        d: 'Una propuesta revisada y comparable, no una lista de tarifas sueltas.',
      },
      {
        n: '03',
        t: 'Coordinación',
        d: 'Booking, documentos y operadores alineados antes del zarpe.',
      },
      {
        n: '04',
        t: 'Seguimiento',
        d: 'Aviso en cada hito: zarpe, tránsito, llegada y levante.',
      },
      {
        n: '05',
        t: 'Cierre',
        d: 'Factura sin cargos sorpresa y documentos entregados.',
      },
    ],
    ctaSoft: 'Cuéntenos su operación',
    contact: {
      whatsapp: 'WhatsApp',
      email: 'Correo',
      phone: 'Llamar',
    },
  },

  method: {
    kicker: 'Por qué Easy',
    empathy: 'Sabemos lo que está en juego cuando una carga no puede fallar.',
    intro:
      'No vendemos software. Operamos su importación con un sistema propio que la sostiene.',
    reelLabel: 'Por qué Easy',
    slides: [
      {
        id: 'oficio',
        label: 'Oficio',
        title: 'Interlocutor con oficio',
        body: 'Alguien que conoce su ruta, su carga y su aduana. El criterio no se automatiza.',
      },
      {
        id: 'sistema',
        label: 'Sistema',
        title: 'Easy OS',
        body: 'Nuestro sistema interno ordena documentos, hitos y tiempos. Menos fricción, menos error.',
      },
      {
        id: 'resultado',
        label: 'Resultado',
        title: 'Un solo hilo',
        body: 'Un responsable de origen a entrega, aunque intervengan cinco operadores distintos.',
      },
      {
        id: 'criterio',
        label: 'Criterio',
        title: 'Claridad para decidir',
        body: 'Qué encarece una importación, cómo leer una cotización, qué documento no puede esperar.',
      },
    ],
  },

  stories: {
    kicker: 'Clientes',
    title: 'Quiénes mueven su carga con Easy',
    subtitle: 'Importadores y marcas que ya operan su comercio exterior con nosotros.',
  },

  trust: {
    kicker: 'Por qué confiar',
    title: 'Lo concreto detrás de cada embarque.',
    subtitle: 'Cobertura, documentos y costos. Sin letra pequeña.',
    blocks: [
      {
        t: 'Cobertura real',
        d: 'FCL, LCL y carga aérea desde Asia, Europa y América hacia puertos y aeropuertos de Colombia.',
      },
      {
        t: 'Documentos al día',
        d: 'BL, factura comercial, packing list y certificados revisados antes de que la carga llegue.',
      },
      {
        t: 'Costos sin sorpresas',
        d: 'Flete, gastos locales y aduana cotizados desde el inicio. Lo que cambie, se avisa.',
      },
    ],
    coverage: {
      t: 'Cobertura',
      modes: [
        { key: 'sea', mode: 'Marítimo', d: 'FCL y LCL, con criterio de ruta y no solo de tarifa.' },
        { key: 'air', mode: 'Aéreo', d: 'Cuando el tiempo vale más que el flete.' },
        { key: 'road', mode: 'Terrestre', d: 'Del puerto o el aeropuerto a su bodega.' },
      ],
    },
  },

  contactCta: {
    title: 'Hablemos de su operación',
    lead: 'Carga especial, plazo corto o un incoterm poco común: déjenos su número y lo llamamos.',
    points: [
      'Respuesta en horas hábiles, no en días.',
      'Le contesta alguien que conoce su ruta.',
      '¿Ya tiene el detalle listo? Cotice directo.',
    ],
    form: {
      dialLabel: 'Código de país',
      phoneLabel: 'Teléfono',
      phonePlaceholder: '320 123 4567',
      next: 'Siguiente',
      nameLabel: 'Nombre',
      namePlaceholder: 'Su nombre',
      submit: 'Enviar',
      submitting: 'Enviando…',
      success: 'Gracias. Un especialista lo contactará pronto.',
      genericError: 'No se pudo enviar el formulario.',
      captchaMissing: 'Falta configurar VITE_TURNSTILE_SITE_KEY.',
      privacyNotice:
        'Usaremos su nombre y teléfono para contactarlo sobre su operación logística.',
      consentLabel: 'Autorizo el tratamiento de mis datos personales de acuerdo con la',
      consentPolicy: 'Política de Tratamiento de Datos Personales',
    },
  },

  /**
   * Mapa de servicios por tramo. Contenido listo, sección hoy no montada
   * en la landing (ver ServicesMap / VideoBand).
   */
  services: {
    kicker: 'Qué cubrimos',
    title: 'Servicios en cada tramo de su importación.',
    lead: 'Cotizamos y coordinamos el recorrido completo, tramo por tramo.',
    note: 'No todos aplican en cada operación. La propuesta se arma según origen, incoterm y destino.',
    phases: [
      {
        id: 'origen',
        label: 'Origen',
        tag: 'En el exterior',
        items: [
          { t: 'Transporte terrestre', d: 'Recogida en planta o bodega hacia puerto o aeropuerto.' },
          { t: 'Aduana de exportación', d: 'Despacho en origen cuando el incoterm lo exige.' },
        ],
      },
      {
        id: 'transito',
        label: 'Tránsito',
        tag: 'Marítimo · Aéreo',
        items: [
          { t: 'Flete internacional', d: 'FCL, LCL o carga aérea hasta Colombia.' },
          { t: 'Seguro de carga', d: 'Cobertura de la mercancía durante todo el trayecto.' },
        ],
      },
      {
        id: 'destino',
        label: 'Destino',
        tag: 'En Colombia',
        items: [
          { t: 'Aduana de importación', d: 'Agente aduanero, declaración y levante.' },
          { t: 'Transporte terrestre', d: 'Del puerto o aeropuerto a su bodega.' },
          { t: 'Almacenamiento', d: 'Bodegaje y handling mientras la carga espera.' },
          { t: 'Entrega final', d: 'Última milla con confirmación de recibido.' },
        ],
      },
      {
        id: 'express',
        label: 'Express',
        tag: 'Cuando el tiempo manda',
        items: [
          { t: 'Courier', d: 'Envíos urgentes de menor volumen con seguimiento dedicado.' },
        ],
      },
    ],
  },

  routeTags: ['Marítimo', 'Aéreo', 'Terrestre', 'Seguimiento'],

  nav: [
    { key: 'inicio', label: 'Inicio' },
    { key: 'como', label: 'Cómo' },
    { key: 'easy', label: 'Easy' },
    { key: 'contacto', label: 'Contacto' },
  ],

  footer: {
    blurb:
      'Freight broker B2B para importadores en Colombia. Criterio, cobertura y alguien que responde.',
    linksTitle: 'Enlaces',
    links: [
      { key: 'inicio', label: 'Inicio' },
      { key: 'como', label: 'Cómo trabajamos' },
      { key: 'easy', label: 'Easy' },
      { key: 'contacto', label: 'Contacto' },
    ],
    servicesTitle: 'Servicios',
    services: ['Flete marítimo FCL / LCL', 'Carga aérea', 'Transporte terrestre'],
    contactTitle: 'Contacto en Colombia',
    dataPolicy: 'Política de tratamiento de datos',
    cookiesPolicy: 'Política de cookies',
    rights: 'Todos los derechos reservados.',
  },

  ui: {
    quote: 'Cotizar',
    quoteShort: 'Cotizar',
    homeAria: 'Easy Logistics inicio',
    navAria: 'Principal',
    langAria: 'Idioma',
  },

  geo: {
    what: 'Easy Logistics es un freight broker B2B en Colombia que conecta importadores con operadores marítimos y aéreos, con un interlocutor claro y operación de punta a punta.',
    whoServes:
      'Empresas importadoras en Colombia que necesitan traer mercancía del exterior sin fragmentar la operación entre intermediarios.',
    services:
      'Flete marítimo FCL/LCL, carga aérea, transporte terrestre y coordinación aduanera.',
    howQuote:
      'Brief de la operación, cotización revisada, booking, seguimiento documental y cierre transparente.',
    differentiator:
      'Combina criterio humano con Easy OS, su sistema operativo interno, para acelerar lo repetible y dedicar más tiempo a acompañar al cliente.',
  },
}
