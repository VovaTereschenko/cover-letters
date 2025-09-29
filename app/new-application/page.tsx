import { ApplicationCreation } from "@/features";
import { getApplicationCountFromCookies } from "@/lib/cookies";

export default async function NewApplicationPage() {
  const initialApplicationsCount = await getApplicationCountFromCookies();

  return (
    <ApplicationCreation initialApplicationsCount={initialApplicationsCount} />
  );
}
