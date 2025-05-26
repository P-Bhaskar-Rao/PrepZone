import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "file";
}

const FormField = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
}: FormFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormItem>
            <FormLabel className={`${label} ml-3`}>{label}</FormLabel>
            <FormControl>
              <Input
                className={`input ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                type={type}
                placeholder={placeholder}
                {...field}
              />
            </FormControl>
            {error && (
              <FormMessage className="text-red-500 text-sm mt-1">
                {error.message}
              </FormMessage>
            )}
          </FormItem>
        )
      }}
    />
  );
};

export default FormField;
