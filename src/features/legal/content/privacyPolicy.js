import { CONTACT } from '../../home/content/landingNarrative'
import { DATA_POLICY_VERSION } from './dataConsent'

export const PRIVACY_POLICY = {
  title: 'Política de Tratamiento de Datos Personales',
  version: DATA_POLICY_VERSION,
  updatedAt: '1 de agosto de 2026',
  intro:
    'Easy Logistics, en calidad de Responsable del Tratamiento, informa a los titulares sobre la recolección, uso, almacenamiento y demás actividades de tratamiento de datos personales, de conformidad con la Ley 1581 de 2012, el Decreto 1377 de 2013 y demás normas aplicables en Colombia.',
  sections: [
    {
      title: '1. Responsable del tratamiento',
      paragraphs: [
        'Razón social / marca comercial: Easy Logistics.',
        'Domicilio de atención: Avenida calle 26 # 69 - 76 TORRE 3 OF 1501, Bogotá, Colombia.',
        `Correo de contacto para datos personales: ${CONTACT.email.replace('mailto:', '')}.`,
        `Teléfono: ${CONTACT.phoneDisplay}.`,
      ],
    },
    {
      title: '2. Datos personales que recolectamos',
      paragraphs: [
        'A través de nuestros formularios web podemos recolectar, entre otros:',
      ],
      bullets: [
        'Datos de identificación y contacto: nombre, número de teléfono celular y correo electrónico.',
        'Datos de la solicitud logística: tipo de operación, modo de transporte, origen, destino e información de carga necesaria para cotizar.',
        'Datos técnicos de seguridad: token de verificación anti-bots (Cloudflare Turnstile), dirección IP y marca de tiempo asociadas a la autorización.',
      ],
    },
    {
      title: '3. Finalidades del tratamiento',
      paragraphs: [
        'Tratamos los datos personales para las siguientes finalidades:',
      ],
      bullets: [
        'Atender solicitudes de contacto, información o asesoría comercial.',
        'Elaborar, gestionar y enviar cotizaciones y su resultado por correo electrónico o teléfono.',
        'Crear o actualizar registros en nuestros sistemas internos y CRM para el seguimiento de la solicitud.',
        'Cumplir obligaciones legales, atender requerimientos de autoridades y ejercer o defender derechos.',
        'Mejorar la seguridad de los formularios y prevenir usos fraudulentos o automatizados.',
      ],
    },
    {
      title: '4. Tratamiento y bases de la autorización',
      paragraphs: [
        'El tratamiento se realiza con base en la autorización previa, expresa e informada del titular, otorgada mediante la casilla de aceptación en nuestros formularios, o en las demás causales previstas en la ley cuando resulten aplicables.',
        'No usaremos tus datos para finalidades distintas a las aquí descritas sin una nueva autorización, salvo las excepciones legales.',
      ],
    },
    {
      title: '5. Encargados, proveedores y transferencias',
      paragraphs: [
        'Para operar el servicio podemos compartir datos con proveedores que actúan como encargados o facilitan infraestructura tecnológica, bajo obligaciones de confidencialidad y seguridad, por ejemplo:',
      ],
      bullets: [
        'Plataformas de CRM / gestión comercial (p. ej. Zoho).',
        'Servicios de verificación anti-bots (Cloudflare Turnstile).',
        'Proveedores de hosting, correo electrónico y herramientas de comunicación necesarias para atender tu solicitud.',
      ],
      closing:
        'Si en el futuro se realizan transferencias internacionales, se adelantarán con las salvaguardas exigidas por la normativa colombiana.',
    },
    {
      title: '6. Derechos del titular',
      paragraphs: [
        'Como titular de datos personales puedes ejercer, entre otros, los derechos de:',
      ],
      bullets: [
        'Conocer, actualizar y rectificar tus datos.',
        'Solicitar prueba de la autorización otorgada.',
        'Ser informado sobre el uso que se ha dado a tus datos.',
        'Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a la ley.',
        'Revocar la autorización y/o solicitar la supresión del dato cuando proceda.',
        'Acceder de forma gratuita a tus datos personales objeto de tratamiento.',
      ],
    },
    {
      title: '7. Canal para consultas y reclamos',
      paragraphs: [
        `Para ejercer tus derechos, envía una solicitud al correo ${CONTACT.email.replace('mailto:', '')} indicando: nombre completo, dato de contacto, descripción clara de la solicitud y documentos que la soporten cuando aplique.`,
        'Atenderemos las consultas y reclamos conforme a los plazos y procedimiento previstos en la Ley 1581 de 2012.',
      ],
    },
    {
      title: '8. Seguridad y conservación',
      paragraphs: [
        'Aplicamos medidas administrativas, técnicas y humanas razonables para proteger la información contra acceso no autorizado, pérdida, alteración o uso indebido.',
        'Conservaremos los datos durante el tiempo necesario para cumplir las finalidades informadas, las obligaciones contractuales o legales, y los términos de prescripción o retención aplicables. Luego serán eliminados o anonimizados cuando corresponda.',
      ],
    },
    {
      title: '9. Menores de edad',
      paragraphs: [
        'Nuestros formularios están dirigidos a personas naturales o representantes de empresas en el marco de relaciones comerciales B2B. No solicitamos de manera intencional datos de menores de edad. Si detectas un caso de este tipo, contáctanos para proceder a su eliminación.',
      ],
    },
    {
      title: '10. Vigencia y actualizaciones',
      paragraphs: [
        `La presente política entra en vigencia a partir de su publicación. Versión actual: ${DATA_POLICY_VERSION} (1 de agosto de 2026).`,
        'Podemos actualizarla para reflejar cambios legales u operativos. La versión vigente estará siempre disponible en este sitio. Cuando el cambio sea sustancial, podremos solicitar una nueva aceptación en los formularios.',
      ],
    },
  ],
}
