interface ValidationFunctions {
  [key: string]: (value: string) => string;
}

export const validateRegister: ValidationFunctions = {
  username: (value: string) => (value ? "" : "Username is required"),
  password: (value: string) =>
    value.length >= 6 ? "" : "Password must be at least 6 characters",
  email: (value: string) =>
    /\S+@\S+\.\S+/.test(value) ? "" : "Email must be a valid email address",
};

export const validateLogin: ValidationFunctions = {
  username: (value: string) =>
    value.trim().length === 0 ? "This field cannot be empty" : "",
  password: (value: string) =>
    value.trim().length === 0 ? "This field cannot be empty" : "",
};
