import type { Language } from '@/store';

export interface ContactMethod {
  id: string;
  title: string;
  description: string;
  value: string;
  details?: string[];
  external?: boolean;
}

export interface ContactContent {
  title: string;
  subtitle: string;
  methods: ContactMethod[];
  note?: string;
}

const contactContentByLanguage: Record<Language, ContactContent> = {
  en: {
    title: 'Get In Touch',
    subtitle: "Let's work together on the next project",
    methods: [
      {
        id: 'email',
        title: 'Email',
        description:
          'Prefer written communication? Send me an email with project details and I will respond within three business days.',
        value: 'zytbarbara@outlook.com',
        details: [
          'Best for detailed briefs and proposals',
          'I reply as soon as I see it',
        ],
      },
      {
        id: 'whatsapp',
        title: 'WhatsApp',
        description:
          'Need a quick check-in or have a short question? Message me on WhatsApp for faster responses.',
        value: '+86 182 2168 3136',
        external: true,
        details: [
          'Available 9 AM - 6 PM GMT+8',
          "Let's work together and make progress",
        ],
      },
    ],
    note: 'Share as much context as you can so I can prepare helpful answers before we chat.',
  },
  zh: {
    title: '保持联系',
    subtitle: '让我们一起开始下一个项目',
    methods: [
      {
        id: 'email',
        title: '邮箱',
        description: '更习惯书面沟通？欢迎把项目背景发邮件给我，我会在三个工作日内回复。',
        value: 'zytbarbara@outlook.com',
        details: ['适合详细的项目说明和合作提案', '看到后会第一时间回复'],
      },
      {
        id: 'whatsapp',
        title: 'WhatsApp',
        description: '想快速沟通或有简短问题？发送 WhatsApp 消息，我会尽快回复。',
        value: '+86 182 2168 3136',
        external: true,
        details: ['服务时间 9:00 - 18:00（GMT+8）', '让我们保持节奏，一起推进进度'],
      },
    ],
    note: '欢迎提供越多背景越好，这样我能提前准备更有针对性的建议。',
  },
  es: {
    title: 'Ponte en Contacto',
    subtitle: 'Construyamos juntas el próximo proyecto',
    methods: [
      {
        id: 'email',
        title: 'Correo',
        description:
          '¿Prefieres comunicarte por escrito? Envíame un correo con los detalles del proyecto y responderé en un máximo de tres días hábiles.',
        value: 'zytbarbara@outlook.com',
        details: [
          'Ideal para briefings detallados y propuestas formales',
          'Respondo tan pronto como lo leo',
        ],
      },
      {
        id: 'whatsapp',
        title: 'WhatsApp',
        description:
          '¿Necesitas una confirmación rápida o tienes una pregunta corta? Escríbeme por WhatsApp para obtener una respuesta ágil.',
        value: '+86 182 2168 3136',
        external: true,
        details: [
          'Disponible de 9:00 a 18:00 (GMT+8)',
          'Avancemos juntas paso a paso',
        ],
      },
    ],
    note: 'Cuanta más información compartas, mejor podré preparar respuestas útiles antes de nuestra charla.',
  },
  fr: {
    title: 'Entrons en Contact',
    subtitle: 'Construisons ensemble votre prochain projet',
    methods: [
      {
        id: 'email',
        title: 'Email',
        description:
          "Vous préférez l'écrit ? Envoyez-moi les détails du projet par email et je vous répondrai sous trois jours ouvrés.",
        value: 'zytbarbara@outlook.com',
        details: [
          'Idéal pour les briefs détaillés et les propositions',
          'Je réponds dès que je vois votre message',
        ],
      },
      {
        id: 'whatsapp',
        title: 'WhatsApp',
        description:
          "Besoin d'un point rapide ou d'une petite question ? Contactez-moi sur WhatsApp pour une réponse plus immédiate.",
        value: '+86 182 2168 3136',
        external: true,
        details: [
          'Disponible de 9h à 18h (GMT+8)',
          'Avançons ensemble, étape par étape',
        ],
      },
    ],
    note: 'Partagez un maximum de contexte afin que je puisse préparer des réponses adaptées avant notre échange.',
  },
};

export const getContactContent = (language: Language): ContactContent => {
  return contactContentByLanguage[language] ?? contactContentByLanguage.en;
};


