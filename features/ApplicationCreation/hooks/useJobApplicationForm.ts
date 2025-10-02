import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  jobApplicationSchema,
  type JobApplicationFormData,
} from "@/lib/validations";

export function useJobApplicationForm() {
  const form = useForm<JobApplicationFormData>({
    resolver: zodResolver(jobApplicationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      jobTitle: "",
      company: "",
      skills: "",
      additionalDetails: "",
    },
  });

  return form;
}
