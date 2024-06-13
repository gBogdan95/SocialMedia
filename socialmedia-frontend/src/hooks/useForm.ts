import { useState, ChangeEvent, FormEvent } from "react";

interface FormProps<T> {
  initialValues: T;
  validate: (name: keyof T, value: any) => string;
}

const useForm = <T extends Record<string, any>>({
  initialValues,
  validate,
}: FormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string>>(
    {} as Record<keyof T, string>
  );
  const reset = () => {
    setValues(initialValues);
    setErrors({} as Record<keyof T, string>);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target as { name: keyof T; value: string };
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: validate(name, value) });
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    callback: () => Promise<void>
  ) => {
    event.preventDefault();
    let valid = true;
    const newErrors: Record<keyof T, string> = {} as Record<keyof T, string>;

    Object.keys(values).forEach((key) => {
      const error = validate(key as keyof T, values[key]);
      newErrors[key as keyof T] = error;
      if (error) valid = false;
    });

    setErrors(newErrors);

    if (!valid) return;
    if (callback) await callback();
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues,
    setErrors,
    reset,
  };
};

export default useForm;
