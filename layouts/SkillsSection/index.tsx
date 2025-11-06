"use client";

import { Card } from '@/components';
import { CubeTag } from '@/components';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './SkillsSection.module.css';

const skills = [
  'Next.js',
  'Vue',
  'TypeScript',
  'Three.js',
  'GLSL',
  'Agent-Based Interaction Design',
];

export default function SkillsSection() {
  const { t } = useTranslation();

  return (
    <Card 
      title={t('featuredSkills')} 
      className="hover-lift transition-all"
    >
      <p className={`text-text-muted ${styles.paragraph}`}>
        {t('skillsDescription')}
      </p>
      <div className={styles.skillsGrid}>
        {skills.map((skill) => (
          <CubeTag key={skill} className="hover-scale transition-transform">
            {skill}
          </CubeTag>
        ))}
      </div>
    </Card>
  );
}

