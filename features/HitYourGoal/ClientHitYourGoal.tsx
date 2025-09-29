"use client";

import { useRouter } from "next/navigation";
import { HitYourGoal } from "@/features/HitYourGoal";
import { useApplicationsCount } from "@/contexts/ApplicationsCountContext";

const ClientHitYourGoal = () => {
  const router = useRouter();
  const { applicationsCount } = useApplicationsCount();

  const handleCreateNew = () => {
    router.push("/new-application");
  };

  return (
    <HitYourGoal
      onCreateNew={handleCreateNew}
      applicationsCount={applicationsCount}
    />
  );
};

export { ClientHitYourGoal };
