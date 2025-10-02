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
  const serverApplicationCount = await getApplicationCountFromCookies();

  const initialApplications = createPlaceholderApplications(
    serverApplicationCount
  );

  const initialCount = serverApplicationCount;

  return (
    <ApplicationsCountProvider initialCount={initialCount}>
      <ApplicationsList initialApplications={initialApplications} />
    </ApplicationsCountProvider>
  );
}
