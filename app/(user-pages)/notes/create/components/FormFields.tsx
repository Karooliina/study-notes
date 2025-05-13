import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CharCounter } from "@/app/(user-pages)/components/CharCounter";

interface FormInputProps {
  name: string;
  label: string;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

export function FormInput({
  name,
  label,
  placeholder,
  maxLength,
  disabled,
}: FormInputProps) {
  const form = useFormContext();
  const value = form.watch(name) as string;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex flex-col gap-2">
            <FormLabel>{label}</FormLabel>
            <div className="flex items-end justify-between gap-4 flex-col">
              <FormControl>
                <Input
                  placeholder={placeholder}
                  {...field}
                  maxLength={maxLength}
                  disabled={disabled}
                />
              </FormControl>
              {maxLength && (
                <CharCounter current={value.length} max={maxLength} />
              )}
            </div>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}

export function FormTextArea({
  name,
  label,
  placeholder,
  maxLength,
  disabled,
}: FormInputProps) {
  const form = useFormContext();
  const value = form.watch(name) as string;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex flex-col gap-2">
            <FormLabel>{label}</FormLabel>
            <div className="flex items-end justify-between gap-4 flex-col">
              <FormControl>
                <Textarea
                  placeholder={placeholder}
                  className="min-h-[200px]"
                  {...field}
                  maxLength={maxLength}
                  disabled={disabled}
                />
              </FormControl>
              {maxLength && (
                <CharCounter current={value.length} max={maxLength} />
              )}
            </div>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
