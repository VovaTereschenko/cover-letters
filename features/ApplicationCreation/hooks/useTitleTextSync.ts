import { useEffect } from "react";
import { useSetTitleText } from "@/store/jobApplication";
import { UI_MESSAGES } from "@/constants/ai";

interface FormValues {
  jobTitle: string;
  company: string;
}

export const useTitleTextSync = (formValues: FormValues) => {
  const setTitleText = useSetTitleText();

  useEffect(() => {
    if (!formValues.jobTitle && !formValues.company) {
      setTitleText(UI_MESSAGES.newApplication);
      return;
    }

    const parts = [];
    if (formValues.jobTitle?.trim()) {
      parts.push(formValues.jobTitle.trim());
    }
    if (formValues.company?.trim()) {
      parts.push(formValues.company.trim());
    }

    setTitleText(parts.join(", "));
  }, [formValues.jobTitle, formValues.company, setTitleText]);
};
