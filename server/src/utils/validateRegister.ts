import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";
import { FieldError } from "src/resolvers/FieldError";

export const validateRegister = (input: UsernamePasswordInput): FieldError[] | null => {
  if (!input.email.includes("@")) {
    return [
      {
        field: "email",
        message: "Must include @ symbol",
      },
    ];
  }

  if (input.username.length <= 2) {
    return [
      {
        field: "username",
        message: "must be greater than 2",
      },
    ];
  }

  if (input.username.includes("@")) {
    return [
      {
        field: "username",
        message: "cannot include an @",
      },
    ];
  }

  if (input.password.length <= 8) {
    return [
      {
        field: "password",
        message: "must be greater than 8",
      },
    ];
  }

  return null;
};
