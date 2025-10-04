"use client";

import { useRouter } from "next/navigation";
import { SubHeader } from "@/components/headers/SubHeader";

export const ClientSubHeader = () => {
  const router = useRouter();

  const handleCreateNew = () => {
    router.push("/new-application");
  };

  return <SubHeader onCreateNew={handleCreateNew} />;
};
