// All website content in one place - simple dictionary structure

export const homeContent = {
  welcome: {
    title: 'Welcome',
    description: 'This is a Next.js template with TypeScript, Zustand state management, theme switching, and internationalization support.',
  },
  features: [
    'Next.js 14 with App Router',
    'TypeScript support',
    'Zustand for state management',
    'Multiple color themes (Blue, Green, Purple, Orange, Pink, Indigo)',
    'Theme switching (Light/Dark)',
    'Multi-language support (i18n)',
    'Tailwind CSS for styling',
    'ISR rendering strategy',
    'Vercel deployment ready',
  ],
}

export const aboutContent = {
  title: 'About Me',
  subtitle: 'Frontend Developer passionate about creating beautiful user experiences',
  bio: 'I am a frontend developer with a passion for creating intuitive and beautiful user interfaces. I specialize in modern web technologies and love turning complex problems into simple, elegant solutions.',
  skills: {
    languages: [
      { name: 'JavaScript', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'HTML/CSS', level: 98 },
    ],
    frameworks: [
      { name: 'React', level: 95 },
      { name: 'Next.js', level: 90 },
      { name: 'Vue.js', level: 85 },
    ],
    tools: [
      { name: 'Git', level: 90 },
      { name: 'Webpack', level: 85 },
      { name: 'Tailwind CSS', level: 95 },
      { name: 'Figma', level: 80 },
    ],
  },
  experience: [
    {
      title: 'Senior Frontend Developer',
      company: 'Tech Company',
      period: '2022 - Present',
      description: 'Leading frontend development for multiple projects, mentoring junior developers, and implementing best practices.',
    },
    {
      title: 'Frontend Developer',
      company: 'Startup Inc',
      period: '2020 - 2022',
      description: 'Built responsive web applications using React and Next.js, collaborating with design and backend teams.',
    },
  ],
}

export const workContent = {
  title: 'My Work',
  subtitle: 'Projects and portfolio showcasing my frontend development skills',
  projects: [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-featured e-commerce platform built with Next.js, featuring product catalog, shopping cart, and payment integration.',
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      image: '/placeholder-project-1.jpg',
      link: 'https://example.com',
      featured: true,
    },
    {
      id: 2,
      title: 'Dashboard Analytics',
      description: 'Real-time analytics dashboard with interactive charts and data visualization using modern web technologies.',
      technologies: ['React', 'Chart.js', 'TypeScript'],
      image: '/placeholder-project-2.jpg',
      link: 'https://example.com',
      featured: true,
    },
    {
      id: 3,
      title: 'Social Media App',
      description: 'A responsive social media application with real-time updates, user authentication, and content management.',
      technologies: ['React', 'Firebase', 'Material-UI'],
      image: '/placeholder-project-3.jpg',
      link: 'https://example.com',
      featured: false,
    },
    {
      id: 4,
      title: 'Task Management Tool',
      description: 'Collaborative task management tool with drag-and-drop functionality and team collaboration features.',
      technologies: ['Vue.js', 'Node.js', 'MongoDB'],
      image: '/placeholder-project-4.jpg',
      link: 'https://example.com',
      featured: false,
    },
  ],
}

export const contactContent = {
  title: 'Get In Touch',
  subtitle: 'Let\'s work together on your next project',
  email: 'hello@example.com',
  social: [
    {
      name: 'GitHub',
      url: 'https://github.com',
      icon: 'github',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: 'linkedin',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com',
      icon: 'twitter',
    },
  ],
}

