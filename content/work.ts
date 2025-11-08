import { promises as fs } from 'fs';
import path from 'path';
import type { Language } from '@/store';

export interface WorkProject {
  id: string;
  title: string;
  description: string[];
  detail: string[];
  technologies: string[];
  image?: string;
  video?: string;
  link?: string;
  isLink: boolean;
}

export interface WorkContent {
  title: string;
  subtitle: string;
  projects: WorkProject[];
}

export type LocalizedWorkContent = Record<Language, WorkContent>;

const WORK_LANGUAGES: Language[] = ['en', 'zh', 'es', 'fr'];
const DEFAULT_LANGUAGE: Language = 'en';

const WORK_MARKDOWN_PATHS: Record<Language, string> = {
  en: path.join(process.cwd(), 'content', 'work.en.md'),
  zh: path.join(process.cwd(), 'content', 'work.zh.md'),
  es: path.join(process.cwd(), 'content', 'work.es.md'),
  fr: path.join(process.cwd(), 'content', 'work.fr.md'),
};

const WORK_HEADINGS: Record<Language, { title: string; subtitle: string }> = {
  en: {
    title: 'My Work',
    subtitle: "Let's explore a few recent projects I've shipped",
  },
  zh: {
    title: '我的项目',
    subtitle: '一起看看我近期构建的项目',
  },
  es: {
    title: 'Mis Proyectos',
    subtitle: 'Descubramos algunos proyectos recientes que he entregado',
  },
  fr: {
    title: 'Mes Projets',
    subtitle: "Explorons quelques projets récents que j'ai réalisés",
  },
};

const stripQuotes = (value: string) => value.replace(/^["'`](.*)["'`]$/, '$1');

const splitParagraphs = (value: string) =>
  value
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);

type MutableProject = Partial<WorkProject> & { id: string };

const setValue = (project: MutableProject, key: string, rawValue: string) => {
  const value = rawValue.trim();

  switch (key) {
    case 'title':
      project.title = value;
      break;
    case 'description':
      project.description = splitParagraphs(value);
      break;
    case 'detail':
      project.detail = splitParagraphs(value);
      break;
    case 'technologies':
      try {
        project.technologies = JSON.parse(value);
      } catch (error) {
        throw new Error(
          `Failed to parse technologies array for project "${project.title ?? project.id}". Ensure the value is a valid JSON array.`,
        );
      }
      break;
    case 'image':
      project.image = stripQuotes(value);
      break;
    case 'video':
      project.video = stripQuotes(value);
      break;
    case 'link':
      project.link = value ? stripQuotes(value) : undefined;
      break;
    case 'islink':
      project.isLink = value.toLowerCase() === 'true';
      break;
    default:
      break;
  }
};

const finaliseProject = (project: MutableProject, index: number): WorkProject => {
  if (!project.title) {
    throw new Error(`Missing "title" for work project at position ${index + 1}`);
  }

  if (!project.description?.length) {
    project.description = [];
  }

  if (!project.detail?.length) {
    project.detail = [];
  }

  if (!project.technologies?.length) {
    project.technologies = [];
  }

  if (!('isLink' in project)) {
    project.isLink = Boolean(project.link);
  }

  return {
    id: project.id,
    title: project.title,
    description: project.description,
    detail: project.detail,
    technologies: project.technologies,
    image: project.image,
    video: project.video,
    link: project.link,
    isLink: project.isLink ?? false,
  };
};

const parseWorkMarkdown = (file: string): WorkProject[] => {
  const lines = file.split(/\r?\n/);
  const projects: WorkProject[] = [];

  let currentProject: MutableProject | null = null;
  let currentKey: string | null = null;
  let buffer: string[] = [];

  const commitValue = () => {
    if (!currentProject || !currentKey) {
      return;
    }

    const raw = buffer.join('\n').trim();
    setValue(currentProject, currentKey, raw);
    currentKey = null;
    buffer = [];
  };

  const commitProject = () => {
    if (!currentProject) {
      return;
    }

    commitValue();
    projects.push(finaliseProject(currentProject, projects.length));
    currentProject = null;
  };

  for (const line of lines) {
    const headerMatch = line.match(/^###\s*([a-zA-Z0-9_]+)(?::\s*(.*))?$/);

    if (headerMatch) {
      const [, keyRaw, inlineValue = ''] = headerMatch;
      const key = keyRaw.toLowerCase();

      if (key === 'title') {
        commitProject();
        currentProject = { id: `${projects.length + 1}` };
      }

      commitValue();

      if (inlineValue !== '') {
        if (!currentProject) {
          currentProject = { id: `${projects.length + 1}` };
        }
        setValue(currentProject, key, inlineValue);
        continue;
      }

      currentKey = key;
      buffer = [];
      continue;
    }

    if (currentKey) {
      buffer.push(line);
    }
  }

  commitProject();
  return projects;
};

const cloneProjects = (projects: WorkProject[]): WorkProject[] =>
  projects.map((project) => ({
    ...project,
    description: [...project.description],
    detail: [...project.detail],
    technologies: [...project.technologies],
  }));

const loadProjectsForLanguage = async (language: Language): Promise<WorkProject[]> => {
  const markdownPath = WORK_MARKDOWN_PATHS[language];
  const file = await fs.readFile(markdownPath, 'utf-8');
  return parseWorkMarkdown(file);
};

export async function getWorkContent(): Promise<LocalizedWorkContent> {
  const fallbackProjects = await loadProjectsForLanguage(DEFAULT_LANGUAGE);

  const entries = await Promise.all(
    WORK_LANGUAGES.map(async (language) => {
      if (language === DEFAULT_LANGUAGE) {
        const heading = WORK_HEADINGS[language];
        return [
          language,
          {
            ...heading,
            projects: cloneProjects(fallbackProjects),
          },
        ] as const;
      }

      try {
        const projects = await loadProjectsForLanguage(language);
        const heading = WORK_HEADINGS[language] ?? WORK_HEADINGS[DEFAULT_LANGUAGE];
        return [
          language,
          {
            ...heading,
            projects: cloneProjects(projects),
          },
        ] as const;
      } catch (error) {
        const heading = WORK_HEADINGS[language] ?? WORK_HEADINGS[DEFAULT_LANGUAGE];
        return [
          language,
          {
            ...heading,
            projects: cloneProjects(fallbackProjects),
          },
        ] as const;
      }
    }),
  );

  return Object.fromEntries(entries) as LocalizedWorkContent;
}

