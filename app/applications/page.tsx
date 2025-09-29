import { getApplications } from "@/lib/applications";
import { getApplicationCountFromCookies } from "@/lib/cookies";
import { ApplicationsList } from "@/features/ApplicationsList";
import { ApplicationsCountProvider } from "@/contexts/ApplicationsCountContext";

function createPlaceholderApplications(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `placeholder-${index}`,
    title: `Loading Application ${index + 1}...`,
    company: "Loading...",
    jobTitle: "Loading...",
    content: "",
    createdAt: new Date().toISOString(),
  }));
}

export default async function ApplicationsPage() {
  const applications = await getApplications();
  const serverApplicationCount = await getApplicationCountFromCookies();

  const initialApplications =
    serverApplicationCount > 0
      ? createPlaceholderApplications(serverApplicationCount)
      : applications;

  const initialCount =
    serverApplicationCount > 0 ? serverApplicationCount : applications.length;

  return (
    <ApplicationsCountProvider initialCount={initialCount}>
      <ApplicationsList initialApplications={initialApplications} />
    </ApplicationsCountProvider>
  );
}
