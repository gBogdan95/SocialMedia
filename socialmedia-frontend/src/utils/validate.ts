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

export const validatePost: ValidationFunctions = {
  title: (value: string) =>
    value.trim().length === 0 ? "Title is required!" : "",
  content: (value: string) =>
    value.trim().length === 0 ? "Content is required!" : "",
};

export const validateComment: ValidationFunctions = {
  content: (value: string) =>
    value.trim().length === 0 ? "Content is required!" : "",
};

export const validateUpdateProfile: ValidationFunctions = {
  phoneNumber: (value: string) =>
    /^\d{1,10}$/.test(value) ? "" : "Invalid phone number",
  name: (value: string) =>
    value.length <= 16 ? "" : "Name must not exceed 16 characters",
};

export const validateChangeEmail: ValidationFunctions = {
  email: (value: string) =>
    /\S+@\S+\.\S+/.test(value) ? "" : "Email must be a valid email address",
  password: (value: string) =>
    value.trim().length === 0 ? "Password cannot be empty" : "",
};
