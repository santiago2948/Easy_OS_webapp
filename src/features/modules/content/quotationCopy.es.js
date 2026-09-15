/**
 * Copy del módulo de cotización · Español.
 *
 * AVISO: los `id` de este archivo (import/export, fcl/lcl/air, 20STD…)
 * viajan al backend en el payload y en la consulta de rutas. Son claves,
 * no texto: traducir solo `title`, `description`, `tags` y `name`.
 */
export const ES = {
  locale: 'es-CO',

  landing: {
    kicker: 'Cotización B2B',
    titleLead: 'Cotiza tu operación en',
    titleAccent: 'pocos minutos',
    lead: 'Marítimo, aéreo o terrestre. Una propuesta revisada, lista para decidir.',
    benefits: ['Cotización en 7 minutos', '20+ países', 'Sin compromiso'],
    cta: 'Iniciar cotización',
    services: [
      {
        id: 'sea',
        title: 'Marítimo',
        description: 'FCL, LCL y carga de proyectos.',
        tags: ['FCL', 'LCL'],
      },
      {
        id: 'air',
        title: 'Aéreo',
        description: 'Express y consolidada para cargas urgentes.',
        tags: ['Express', 'Urgente'],
      },
      {
        id: 'road',
        title: 'Terrestre',
        description: 'Distribución nacional e internacional.',
        tags: ['Nacional', 'Última milla'],
      },
    ],
  },

  form: {
    operations: [
      {
        id: 'import',
        title: 'Importación',
        summaryLabel: 'IMPORT',
        description:
          'Trae tus productos desde el extranjero. Te ayudamos con toda la logística de importación.',
        tags: ['Aduanas', 'Transporte', 'Almacenamiento'],
      },
      {
        id: 'export',
        title: 'Exportación',
        summaryLabel: 'EXPORT',
        description: 'Lleva tus productos al mundo. Gestionamos toda la logística de exportación.',
        tags: ['Documentación', 'Embarque', 'Entrega'],
      },
    ],

    transports: [
      {
        id: 'fcl',
        title: 'FCL',
        summaryLabel: 'FCL',
        description: 'Full Container Load. Contenedor completo para tu carga exclusiva.',
        tags: ['Contenedor Completo', 'Carga Exclusiva'],
      },
      {
        id: 'lcl',
        title: 'LCL',
        summaryLabel: 'LCL',
        description: 'Less than Container Load. Comparte contenedor con otras cargas.',
        tags: ['Carga Parcial', 'Económico'],
      },
      {
        id: 'air',
        title: 'Aéreo',
        summaryLabel: 'AÉREO',
        description: 'Transporte aéreo. Ideal para cargas urgentes y de alto valor.',
        tags: ['Rápido', 'Urgente'],
      },
    ],

    containerTypes: [
      { id: '20STD', name: '20STD — Contenedor 20 pies estándar' },
      { id: '40STD', name: '40STD — Contenedor 40 pies estándar' },
      { id: '40HC', name: '40HC — Contenedor 40 pies high cube' },
      { id: '40HC-REEFER', name: '40HC-REEFER — Contenedor reefer 40 pies' },
    ],

    /** Punto de cargue/descargue según el modo. */
    point: { air: 'Aeropuerto', sea: 'Puerto' },

    progress: {
      stepOf: (step, total) => `Paso ${step} de ${total}`,
      completed: (percent) => `${percent}% completado`,
      aria: (percent) => `Progreso de cotización: ${percent}%`,
    },

    steps: {
      s1: {
        title: 'Configura tu operación logística',
        subtitle: 'Selecciona el tipo de operación y el modo de transporte',
      },
      s2: {
        title: 'Origen y Destino',
        titleFcl: 'Contenedor, origen y destino',
        subtitle: 'Selecciona el país y puerto de origen y destino',
        subtitleAir: 'Selecciona el país y aeropuerto de origen y destino',
        subtitleFcl:
          'Selecciona el tipo de contenedor y luego el origen y destino disponibles',
      },
      s3: {
        title: 'Datos de la Carga',
        subtitle: 'Ingresa los datos de tu carga',
        subtitleFcl: 'Indica la cantidad de contenedores y el valor declarado',
      },
      s4: {
        title: 'Resumen de su cotización',
        subtitle: 'Revisa los datos antes de continuar',
        subtitleLoading: 'Estamos preparando tu resumen',
      },
      s5: {
        title: 'Datos de contacto',
        titleSent: 'Cotización enviada',
        subtitle: 'Ingresa tus datos para enviarte el resultado de la cotización',
        subtitleSent: 'Revisa tu correo para el resultado',
      },
      fallbackTitle: (step) => `Paso ${step}`,
      fallbackSubtitle: 'Continúa completando tu cotización',
    },

    sections: {
      operation: 'Tipo de Operación',
      transport: 'Modo de Transporte',
      containerType: 'Tipo de contenedor',
      originCountry: 'País de Origen',
      destinationCountry: 'País de Destino',
      /** El modo de transporte se añade al final cuando hay uno elegido. */
      cargo: 'Datos de la Carga',
      contact: 'Datos de contacto',
    },

    fields: {
      country: 'País',
      containerType: 'Tipo de contenedor',
      containerQuantity: 'Cantidad de contenedores',
      cargoQuantity: 'Cantidad de Cargas',
      length: 'Largo (metros)',
      width: 'Ancho (metros)',
      height: 'Alto (metros)',
      weight: 'Peso (kg)',
      declaredValue: 'Valor declarado de la carga (USD)',
    },

    placeholders: {
      containerType: 'Selecciona un tipo de contenedor',
      country: 'Selecciona un país',
      /** pointLower = "puerto" o "aeropuerto" */
      point: (pointLower) => `Selecciona un ${pointLower}`,
      pointLocked: 'Primero elige el país',
      decimal: '0.00',
    },

    hints: {
      containerFirst:
        'Elige el contenedor para ver solo los orígenes y destinos disponibles en CRM.',
      declaredValueFcl:
        'Requerido para el cálculo del seguro y otros conceptos porcentuales.',
      declaredValue:
        'Monto en dólares estadounidenses. Requerido para seguros y conceptos porcentuales.',
      lockedCountry: 'País seleccionado',
    },

    loading: {
      routes: 'Cargando orígenes y destinos…',
      summary: 'Cargando el resumen de su cotización…',
    },

    summary: {
      selection: 'Resumen de tu selección',
      route: 'Resumen de Origen y Destino',
      cargo: 'Resumen de Datos de Carga',
      operationType: 'Tipo de Operación:',
      transportMode: 'Modo de Transporte:',
      origin: 'Origen:',
      destination: 'Destino:',
      containerType: 'Tipo de contenedor:',
      quantity: 'Cantidad:',
      dimensions: 'Dimensiones:',
      weight: 'Peso:',
      volume: 'Volumen:',
      declaredValue: 'Valor declarado:',
      grossWeight: 'Peso Bruto:',
      volumetricWeight: 'Peso Volumétrico:',
      chargeableWeightAir: 'Peso Cargable:',
      chargeableWeightSea: 'Peso Tasable:',
    },

    metrics: {
      volume: 'Volumen Calculado',
      grossWeight: 'Peso Bruto',
      volumetricWeight: 'Peso Volumétrico',
      chargeableAir: 'Peso Cargable',
      chargeableSea: 'Peso Tasable',
      hintAir: 'Mayor entre peso bruto y volumétrico (m³ × 167)',
      hintSea: 'Peso al que se aplicará la tarifa',
      noteAir: 'El peso cargable es el mayor entre el peso bruto y el volumétrico (m³ × 167).',
      noteSea: 'El peso tasable es el peso al que se aplicará la tarifa.',
    },

    review: {
      edit: 'Editar',
      quoteInfo: 'Información de la Cotización',
      quoteNumber: 'Número de Cotización:',
      quoteNumberPending: 'Se asignará al confirmar',
      createdAt: 'Fecha de Creación:',
      operationSetup: 'Configuración de Operación',
      route: 'Origen y Destino',
      origin: 'Origen',
      destination: 'Destino',
      country: 'País:',
      cargoInfo: 'Información de Carga',
      containerQuantity: 'Cantidad de contenedores:',
      cargoQuantity: 'Cantidad de Cargas:',
    },

    contact: {
      name: 'Nombre completo',
      namePlaceholder: 'Tu nombre',
      email: 'Correo electrónico',
      emailPlaceholder: 'tu@correo.com',
      phone: 'Teléfono celular',
      dialLabel: 'Código de país',
      phonePlaceholder: '320 123 4567',
      captchaMissing: 'Falta configurar VITE_TURNSTILE_SITE_KEY.',
      note: 'Al enviar, te enviaremos un correo con el resultado de tu cotización.',
      privacyNotice:
        'Usaremos tu nombre, correo y teléfono para enviarte el resultado de tu cotización y contactarte sobre esa solicitud.',
      consentLabel: 'Autorizo el tratamiento de mis datos personales de acuerdo con la',
      consentPolicy: 'Política de Tratamiento de Datos Personales',
    },

    success: {
      title: '¡Cotización enviada!',
      leadStart: 'Recibirás un correo en',
      leadEnd: 'con el resultado de tu cotización',
      finish: 'Volver al inicio',
    },

    nav: {
      back: 'Volver',
      continue: 'Continuar',
      submit: 'Enviar cotización',
      submitting: 'Enviando…',
      retry: 'Reintentar',
    },

    errors: {
      submit: 'No se pudo enviar la cotización',
      routes: 'No se pudieron cargar orígenes y destinos',
      noRoutesForContainer: 'No hay rutas configuradas en CRM para este tipo de contenedor.',
    },
  },
}
