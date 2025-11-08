import { Profile, SkillsSection } from "@/layouts";
import styles from "./page.module.css";

// ISR: Revalidate every 3600 seconds
export const revalidate = 3600;

export default async function Home() {
  return (
    <div className={`container ${styles.container} page-enter`}>
      <Profile />
      <div className={styles.content}>
        <SkillsSection />
      </div>
    </div>
  );
}
