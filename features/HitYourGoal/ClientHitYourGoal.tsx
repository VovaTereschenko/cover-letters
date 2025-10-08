"use client";

import { useRouter } from "next/navigation";
import { HitYourGoal } from "@/features/HitYourGoal";
import { useApplicationsCount, useHasHydrated } from "@/store/applications";

const ClientHitYourGoal = () => {
  const router = useRouter();
  const applicationsCount = useApplicationsCount();
  const hasHydrated = useHasHydrated();

  const handleCreateNew = () => {
    router.push("/new-application");
  };

  if (!hasHydrated) {
    return <HitYourGoal onCreateNew={handleCreateNew} applicationsCount={0} />;
  }

  return (
    <HitYourGoal
      onCreateNew={handleCreateNew}
      applicationsCount={applicationsCount}
    />
  );
};

export { ClientHitYourGoal };
