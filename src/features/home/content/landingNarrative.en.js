/**
 * Landing narrative · English.
 * Same shape as the Spanish deck (landingNarrative.es.js). Keep both in sync:
 * one idea per line, nothing repeated, a concrete fact over an adjective.
 */
export const EN = {
  code: 'en',
  label: 'English',

  hero: {
    kicker: 'B2B international trade',
    title: 'One planet.',
    titleAccent: 'One logistics network.',
    lead: 'Ocean, air and ground imports into Colombia, with one person accountable from start to finish.',
    ctaQuote: 'Get a quote',
    ctaSecondary: 'Talk to an expert',
    hint: 'Scroll',
  },

  brandAssembly: {
    line: 'International trade with someone who answers.',
  },

  flow: {
    kicker: 'How we work',
    title: 'From first call to final invoice, in five steps.',
    subtitle: 'The same person accountable throughout.',
    steps: [
      {
        n: '01',
        t: 'Brief',
        d: 'Origin, destination, incoterm and deadline. That is enough to start.',
      },
      {
        n: '02',
        t: 'Quote',
        d: 'One reviewed, comparable proposal — not a list of loose rates.',
      },
      {
        n: '03',
        t: 'Coordination',
        d: 'Booking, documents and carriers aligned before departure.',
      },
      {
        n: '04',
        t: 'Tracking',
        d: 'An update at every milestone: departure, transit, arrival, customs release.',
      },
      {
        n: '05',
        t: 'Closing',
        d: 'A final invoice with no surprise charges, and documents delivered.',
      },
    ],
    ctaSoft: 'Tell us about your shipment',
    contact: {
      whatsapp: 'WhatsApp',
      email: 'Email',
      phone: 'Call',
    },
  },

  method: {
    kicker: 'Why Easy',
    empathy: 'We know what is at stake when a shipment cannot go wrong.',
    intro:
      'We do not sell software. We run your import, backed by a system we built ourselves.',
    reelLabel: 'Why Easy',
    slides: [
      {
        id: 'oficio',
        label: 'Craft',
        title: 'A broker who knows the trade',
        body: 'Someone who knows your lane, your cargo and your customs office. Judgement cannot be automated.',
      },
      {
        id: 'sistema',
        label: 'System',
        title: 'Easy OS',
        body: 'Our in-house system keeps documents, milestones and deadlines in order. Less friction, fewer errors.',
      },
      {
        id: 'resultado',
        label: 'Outcome',
        title: 'One thread',
        body: 'One person accountable from origin to delivery, even when five operators are involved.',
      },
      {
        id: 'criterio',
        label: 'Insight',
        title: 'Clarity to decide',
        body: 'What drives an import cost up, how to read a quote, which document cannot wait.',
      },
    ],
  },

  stories: {
    kicker: 'Clients',
    title: 'Who moves cargo with Easy',
    subtitle: 'Importers and brands already running their international trade with us.',
  },

  trust: {
    kicker: 'Why trust us',
    title: 'The specifics behind every shipment.',
    subtitle: 'Coverage, documents and costs. No fine print.',
    blocks: [
      {
        t: 'Real coverage',
        d: 'FCL, LCL and air freight from Asia, Europe and the Americas into Colombian ports and airports.',
      },
      {
        t: 'Documents in order',
        d: 'Bill of lading, commercial invoice, packing list and certificates reviewed before the cargo lands.',
      },
      {
        t: 'No cost surprises',
        d: 'Freight, local charges and customs quoted upfront. Anything that changes, you hear it from us.',
      },
    ],
    coverage: {
      t: 'Coverage',
      modes: [
        { key: 'sea', mode: 'Ocean', d: 'FCL and LCL, routed on judgement and not on rate alone.' },
        { key: 'air', mode: 'Air', d: 'When time is worth more than freight.' },
        { key: 'road', mode: 'Ground', d: 'From the port or airport to your warehouse.' },
      ],
    },
  },

  contactCta: {
    title: 'Let us talk about your shipment',
    lead: 'Special cargo, a tight deadline or an unusual incoterm: leave your number and we will call you.',
    points: [
      'A reply in business hours, not business days.',
      'You speak with someone who knows your lane.',
      'Already have the details? Go straight to a quote.',
    ],
    form: {
      dialLabel: 'Country code',
      phoneLabel: 'Phone',
      phonePlaceholder: '320 123 4567',
      next: 'Next',
      nameLabel: 'Name',
      namePlaceholder: 'Your name',
      submit: 'Send',
      submitting: 'Sending…',
      success: 'Thank you. A specialist will contact you shortly.',
      genericError: 'We could not send the form.',
      captchaMissing: 'VITE_TURNSTILE_SITE_KEY is not configured.',
      privacyNotice:
        'We will use your name and phone number to contact you about your shipment.',
      consentLabel: 'I authorise the processing of my personal data in accordance with the',
      consentPolicy: 'Personal Data Processing Policy',
    },
  },

  /**
   * Service map by leg. Copy is ready, but the section is not mounted
   * on the landing today (see ServicesMap / VideoBand).
   */
  services: {
    kicker: 'What we cover',
    title: 'Services on every leg of your import.',
    lead: 'We quote and coordinate the full journey, leg by leg.',
    note: 'Not every service applies to every shipment. The proposal is built around origin, incoterm and destination.',
    phases: [
      {
        id: 'origen',
        label: 'Origin',
        tag: 'Abroad',
        items: [
          { t: 'Inland transport', d: 'Pickup at plant or warehouse to the port or airport.' },
          { t: 'Export customs', d: 'Clearance at origin when the incoterm requires it.' },
        ],
      },
      {
        id: 'transito',
        label: 'Transit',
        tag: 'Ocean · Air',
        items: [
          { t: 'International freight', d: 'FCL, LCL or air cargo into Colombia.' },
          { t: 'Cargo insurance', d: 'Coverage for the goods across the whole journey.' },
        ],
      },
      {
        id: 'destino',
        label: 'Destination',
        tag: 'In Colombia',
        items: [
          { t: 'Import customs', d: 'Customs broker, declaration and release.' },
          { t: 'Inland transport', d: 'From the port or airport to your warehouse.' },
          { t: 'Warehousing', d: 'Storage and handling while the cargo waits.' },
          { t: 'Final delivery', d: 'Last mile with confirmation of receipt.' },
        ],
      },
      {
        id: 'express',
        label: 'Express',
        tag: 'When time rules',
        items: [
          { t: 'Courier', d: 'Urgent low-volume shipments with dedicated tracking.' },
        ],
      },
    ],
  },

  /**
   * FAQ. Rendered visibly and also feeding the FAQPage schema: Google
   * requires the markup to match content visible on the page. Every answer
   * must be verifiable.
   */
  faq: {
    kicker: 'Frequently asked questions',
    title: 'What people ask before importing.',
    subtitle: 'Straight answers on how a shipment works with us.',
    items: [
      {
        q: 'What does a freight broker do, and how is it different from a carrier?',
        a: 'The carrier moves the vessel; the freight broker runs the whole import: quoting the freight, booking the space, coordinating documents and customs, and answering for the entire journey. At Easy Logistics we work with ocean, air and ground operators, and you always deal with the same person.',
      },
      {
        q: 'How long does a quote take?',
        a: 'You can quote online in a few minutes by entering origin, destination, incoterm, cargo details and declared value. If your shipment has complications, a specialist reviews the case and replies within business hours, not business days.',
      },
      {
        q: 'What does the quoted freight include?',
        a: 'The proposal is built leg by leg: pickup at origin, export clearance where the incoterm requires it, international freight, cargo insurance, import customs in Colombia, inland transport to your warehouse, warehousing and final delivery. Not all of them apply to every shipment. Local charges and customs are quoted upfront.',
      },
      {
        q: 'What is the difference between FCL and LCL?',
        a: 'FCL (Full Container Load) is a whole container for your cargo alone. LCL (Less than Container Load) shares a container with other cargo and is charged on chargeable weight: the greater of actual weight and volume. Air freight works the same way, taking the greater of gross and volumetric weight (m³ × 167).',
      },
      {
        q: 'Which countries do you ship from into Colombia?',
        a: 'We coordinate imports from Asia, Europe and the Americas into Colombian ports and airports, by ocean FCL and LCL and by air freight. Available origins and destinations appear in the quoting tool according to transport mode and container type.',
      },
      {
        q: 'Do you handle customs?',
        a: 'Yes. We coordinate the declaration and release at destination with the customs broker, and export clearance at origin when the incoterm requires it.',
      },
      {
        q: 'Which documents do I need to import?',
        a: 'Typically the bill of lading or air waybill, the commercial invoice, the packing list and any certificates the product requires. We review them before the cargo lands, so an incomplete document does not turn into demurrage and storage costs.',
      },
      {
        q: 'What do you need in order to quote?',
        a: 'Origin, destination, incoterm and deadline, plus the cargo details: quantity, dimensions, weight and declared value in US dollars. With that we build one reviewed, comparable proposal rather than a list of loose rates.',
      },
    ],
  },

  /** Per-route metadata. Title ≤ 60 characters, description ≤ 155. */
  seo: {
    home: {
      title: 'Easy Logistics | B2B freight broker in Colombia',
      description:
        'Ocean, air and ground imports into Colombia. FCL, LCL and air freight with clear costs, coordinated customs and one person accountable.',
    },
    quote: {
      title: 'Quote international freight | Easy Logistics',
      description:
        'Quote your import in minutes: origin, destination, incoterm and cargo details. Ocean FCL and LCL or air freight into Colombia.',
    },
  },

  routeTags: ['Ocean', 'Air', 'Ground', 'Tracking'],

  nav: [
    { key: 'inicio', label: 'Home' },
    { key: 'como', label: 'How' },
    { key: 'easy', label: 'Easy' },
    { key: 'preguntas', label: 'FAQ' },
    { key: 'contacto', label: 'Contact' },
  ],

  footer: {
    blurb:
      'B2B freight broker for importers in Colombia. Judgement, coverage and someone who answers.',
    linksTitle: 'Links',
    links: [
      { key: 'inicio', label: 'Home' },
      { key: 'como', label: 'How we work' },
      { key: 'easy', label: 'Easy' },
      { key: 'preguntas', label: 'FAQ' },
      { key: 'contacto', label: 'Contact' },
    ],
    servicesTitle: 'Services',
    services: ['Ocean freight FCL / LCL', 'Air freight', 'Ground transport'],
    contactTitle: 'Contact in Colombia',
    dataPolicy: 'Personal data policy',
    cookiesPolicy: 'Cookie policy',
    rights: 'All rights reserved.',
  },

  ui: {
    quote: 'Get a quote',
    quoteShort: 'Quote',
    homeAria: 'Easy Logistics home',
    navAria: 'Main',
    langAria: 'Language',
  },

  geo: {
    what: 'Easy Logistics is a B2B freight broker in Colombia connecting importers with ocean and air carriers, with a single point of contact and end-to-end operation.',
    whoServes:
      'Importing companies in Colombia that need to bring goods in from abroad without splitting the operation across intermediaries.',
    services: 'Ocean freight FCL/LCL, air cargo, ground transport and customs coordination.',
    howQuote:
      'Shipment brief, reviewed quote, booking, document tracking and a transparent closing.',
    differentiator:
      'It combines human judgement with Easy OS, its in-house operating system, to speed up the repeatable work and spend more time with the client.',
  },
}
