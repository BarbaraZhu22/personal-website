import { getWorkContent } from '@/content/work'
import WorkPageClient from './WorkPageClient'

// ISR: Revalidate every 300 seconds
export const revalidate = 300

export default async function Work() {
  const workContentByLanguage = await getWorkContent()

  return <WorkPageClient workContentByLanguage={workContentByLanguage} />
}

