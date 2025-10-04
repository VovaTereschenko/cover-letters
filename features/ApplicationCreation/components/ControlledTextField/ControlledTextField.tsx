import { Controller, Control, FieldErrors } from "react-hook-form";
import { TextField } from "@/components/shared/TextField";
import type { JobApplicationFormData } from "@/lib/validations";

type ControlledTextFieldProps = {
  name: keyof JobApplicationFormData;
  control: Control<JobApplicationFormData>;
  errors: FieldErrors<JobApplicationFormData>;
  label: string;
  placeholder: string;
  variant?: "input" | "textarea";
  maxSymbols?: number;
  rows?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";
  expandable?: boolean;
};

export function ControlledTextField({
  name,
  control,
  errors,
  label,
  placeholder,
  variant = "input",
  maxSymbols,
  rows,
  resize,
  expandable,
}: ControlledTextFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          variant={variant}
          label={label}
          placeholder={placeholder}
          value={field.value}
          onChange={(value) => field.onChange(value)}
          onBlur={field.onBlur}
          error={!!errors[name]}
          helperText={errors[name]?.message}
          name={field.name}
          maxSymbols={maxSymbols}
          rows={rows}
          resize={resize}
          expandable={expandable}
        />
      )}
    />
  );
}
