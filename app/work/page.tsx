import { getWorkContent } from '@/content/work'
import WorkPageClient from './WorkPageClient'

// ISR: Revalidate every 3600 seconds
export const revalidate = 3600

export default async function Work() {
  const workContentByLanguage = await getWorkContent()

  return <WorkPageClient workContentByLanguage={workContentByLanguage} />
}

