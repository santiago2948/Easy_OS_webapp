import { CONTACT } from '../../home/content/landingNarrative'
import { DATA_POLICY_PATH } from './dataConsent'

export const COOKIES_POLICY = {
  title: 'Política de Cookies',
  updatedAt: '1 de agosto de 2026',
  intro:
    'Esta política describe el uso de cookies y tecnologías similares en el sitio web de Easy Logistics, en complemento de nuestra Política de Tratamiento de Datos Personales.',
  sections: [
    {
      title: '1. ¿Qué son las cookies?',
      paragraphs: [
        'Las cookies son pequeños archivos que un sitio puede almacenar en tu navegador para recordar preferencias, mantener sesiones o entender cómo se usa el sitio. También pueden usarse tecnologías similares como almacenamiento local o píxeles.',
      ],
    },
    {
      title: '2. ¿Qué utilizamos?',
      paragraphs: [
        'Dependiendo de la página y de tu interacción, podemos usar:',
      ],
      bullets: [
        'Cookies técnicas o necesarias: permiten el funcionamiento básico del sitio, la navegación y la seguridad de formularios.',
        'Cookies de preferencia: recuerdan configuraciones básicas de la interfaz cuando aplique.',
        'Tecnologías de seguridad de formularios: Cloudflare Turnstile puede procesar información técnica (como IP y señales del navegador) para distinguir humanos de bots.',
        'Cookies analíticas o de medición: solo si se habilitan herramientas de analítica; en ese caso se informará y, cuando corresponda, se solicitará consentimiento.',
      ],
    },
    {
      title: '3. Finalidades',
      paragraphs: [
        'Usamos estas tecnologías para operar el sitio de forma segura, mejorar la experiencia de uso, prevenir abusos automatizados y, si se activan, obtener estadísticas agregadas de navegación.',
      ],
    },
    {
      title: '4. Gestión y control',
      paragraphs: [
        'Puedes configurar tu navegador para bloquear o eliminar cookies. Ten en cuenta que deshabilitar cookies necesarias puede afectar el funcionamiento de algunas funciones del sitio, incluidos formularios protegidos.',
      ],
    },
    {
      title: '5. Más información sobre datos personales',
      paragraphs: [
        `El tratamiento de datos personales asociados a estas tecnologías se rige por nuestra Política de Tratamiento de Datos Personales disponible en ${DATA_POLICY_PATH}.`,
        `Para consultas: ${CONTACT.email.replace('mailto:', '')}.`,
      ],
    },
  ],
}
