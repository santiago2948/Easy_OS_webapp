/**
 * Quotation module copy · English.
 *
 * WARNING: the `id` values here (import/export, fcl/lcl/air, 20STD…) are sent
 * to the backend in the payload and in the routes query. They are keys, not
 * text: translate only `title`, `description`, `tags` and `name`.
 */
export const EN = {
  locale: 'en-US',

  landing: {
    kicker: 'B2B quoting',
    titleLead: 'Quote your shipment in',
    titleAccent: 'minutes',
    lead: 'Ocean, air or ground. One reviewed proposal, ready to decide on.',
    benefits: ['A quote in 7 minutes', '20+ countries', 'No commitment'],
    cta: 'Start a quote',
    services: [
      {
        id: 'sea',
        title: 'Ocean',
        description: 'FCL, LCL and project cargo.',
        tags: ['FCL', 'LCL'],
      },
      {
        id: 'air',
        title: 'Air',
        description: 'Express and consolidated for urgent cargo.',
        tags: ['Express', 'Urgent'],
      },
      {
        id: 'road',
        title: 'Ground',
        description: 'Domestic and cross-border distribution.',
        tags: ['Domestic', 'Last mile'],
      },
    ],
  },

  form: {
    operations: [
      {
        id: 'import',
        title: 'Import',
        summaryLabel: 'IMPORT',
        description:
          'Bring your goods in from abroad. We handle the whole import operation for you.',
        tags: ['Customs', 'Transport', 'Warehousing'],
      },
      {
        id: 'export',
        title: 'Export',
        summaryLabel: 'EXPORT',
        description: 'Take your goods to the world. We run the whole export operation.',
        tags: ['Documentation', 'Shipping', 'Delivery'],
      },
    ],

    transports: [
      {
        id: 'fcl',
        title: 'FCL',
        summaryLabel: 'FCL',
        description: 'Full Container Load. A whole container for your cargo alone.',
        tags: ['Full Container', 'Exclusive Cargo'],
      },
      {
        id: 'lcl',
        title: 'LCL',
        summaryLabel: 'LCL',
        description: 'Less than Container Load. Share a container with other cargo.',
        tags: ['Partial Load', 'Cost-effective'],
      },
      {
        id: 'air',
        title: 'Air',
        summaryLabel: 'AIR',
        description: 'Air freight. Best for urgent, high-value cargo.',
        tags: ['Fast', 'Urgent'],
      },
    ],

    containerTypes: [
      { id: '20STD', name: '20STD — 20ft standard container' },
      { id: '40STD', name: '40STD — 40ft standard container' },
      { id: '40HC', name: '40HC — 40ft high cube container' },
      { id: '40HC-REEFER', name: '40HC-REEFER — 40ft reefer container' },
    ],

    /** Loading / discharge point by mode. */
    point: { air: 'Airport', sea: 'Port' },

    progress: {
      stepOf: (step, total) => `Step ${step} of ${total}`,
      completed: (percent) => `${percent}% complete`,
      aria: (percent) => `Quote progress: ${percent}%`,
    },

    steps: {
      s1: {
        title: 'Set up your shipment',
        subtitle: 'Choose the operation type and the transport mode',
      },
      s2: {
        title: 'Origin and Destination',
        titleFcl: 'Container, origin and destination',
        subtitle: 'Choose the country and port of origin and destination',
        subtitleAir: 'Choose the country and airport of origin and destination',
        subtitleFcl: 'Choose the container type, then the available origin and destination',
      },
      s3: {
        title: 'Cargo Details',
        subtitle: 'Enter your cargo details',
        subtitleFcl: 'Enter the number of containers and the declared value',
      },
      s4: {
        title: 'Your quote summary',
        subtitle: 'Check the details before continuing',
        subtitleLoading: 'We are preparing your summary',
      },
      s5: {
        title: 'Contact details',
        titleSent: 'Quote sent',
        subtitle: 'Enter your details so we can send you the quote',
        subtitleSent: 'Check your inbox for the result',
      },
      fallbackTitle: (step) => `Step ${step}`,
      fallbackSubtitle: 'Carry on completing your quote',
    },

    sections: {
      operation: 'Operation Type',
      transport: 'Transport Mode',
      containerType: 'Container type',
      originCountry: 'Country of Origin',
      destinationCountry: 'Country of Destination',
      /** The transport mode is appended when one is selected. */
      cargo: 'Cargo Details',
      contact: 'Contact details',
    },

    fields: {
      country: 'Country',
      containerType: 'Container type',
      containerQuantity: 'Number of containers',
      cargoQuantity: 'Number of Units',
      length: 'Length (metres)',
      width: 'Width (metres)',
      height: 'Height (metres)',
      weight: 'Weight (kg)',
      declaredValue: 'Declared cargo value (USD)',
    },

    placeholders: {
      containerType: 'Select a container type',
      country: 'Select a country',
      /** pointLower = "port" or "airport" */
      point: (pointLower) => `Select a ${pointLower}`,
      pointLocked: 'Choose the country first',
      decimal: '0.00',
    },

    hints: {
      containerFirst:
        'Pick the container to see only the origins and destinations available in CRM.',
      declaredValueFcl: 'Required to calculate insurance and other percentage-based charges.',
      declaredValue:
        'Amount in US dollars. Required for insurance and percentage-based charges.',
      lockedCountry: 'Country selected',
    },

    loading: {
      routes: 'Loading origins and destinations…',
      summary: 'Loading your quote summary…',
    },

    summary: {
      selection: 'Your selection',
      route: 'Origin and Destination Summary',
      cargo: 'Cargo Details Summary',
      operationType: 'Operation Type:',
      transportMode: 'Transport Mode:',
      origin: 'Origin:',
      destination: 'Destination:',
      containerType: 'Container type:',
      quantity: 'Quantity:',
      dimensions: 'Dimensions:',
      weight: 'Weight:',
      volume: 'Volume:',
      declaredValue: 'Declared value:',
      grossWeight: 'Gross Weight:',
      volumetricWeight: 'Volumetric Weight:',
      chargeableWeightAir: 'Chargeable Weight:',
      chargeableWeightSea: 'Chargeable Weight:',
    },

    metrics: {
      volume: 'Calculated Volume',
      grossWeight: 'Gross Weight',
      volumetricWeight: 'Volumetric Weight',
      chargeableAir: 'Chargeable Weight',
      chargeableSea: 'Chargeable Weight',
      hintAir: 'The greater of gross and volumetric weight (m³ × 167)',
      hintSea: 'The weight the rate will be applied to',
      noteAir: 'The chargeable weight is the greater of the gross and volumetric weight (m³ × 167).',
      noteSea: 'The chargeable weight is the weight the rate will be applied to.',
    },

    review: {
      edit: 'Edit',
      quoteInfo: 'Quote Information',
      quoteNumber: 'Quote Number:',
      quoteNumberPending: 'Assigned on confirmation',
      createdAt: 'Created On:',
      operationSetup: 'Operation Setup',
      route: 'Origin and Destination',
      origin: 'Origin',
      destination: 'Destination',
      country: 'Country:',
      cargoInfo: 'Cargo Information',
      containerQuantity: 'Number of containers:',
      cargoQuantity: 'Number of Units:',
    },

    contact: {
      name: 'Full name',
      namePlaceholder: 'Your name',
      email: 'Email address',
      emailPlaceholder: 'you@email.com',
      phone: 'Mobile phone',
      dialLabel: 'Country code',
      phonePlaceholder: '320 123 4567',
      captchaMissing: 'VITE_TURNSTILE_SITE_KEY is not configured.',
      note: 'Once you send this, we will email you the result of your quote.',
      privacyNotice:
        'We will use your name, email and phone number to send you the result of this quote and to contact you about the request.',
      consentLabel: 'I authorise the processing of my personal data in accordance with the',
      consentPolicy: 'Personal Data Processing Policy',
    },

    success: {
      title: 'Quote sent',
      leadStart: 'You will receive an email at',
      leadEnd: 'with the result of your quote',
      finish: 'Back to start',
    },

    nav: {
      back: 'Back',
      continue: 'Continue',
      submit: 'Send quote',
      submitting: 'Sending…',
      retry: 'Try again',
    },

    errors: {
      submit: 'We could not send the quote',
      routes: 'We could not load origins and destinations',
      noRoutesForContainer: 'No routes are configured in CRM for this container type.',
    },
  },
}
