import type { Validator } from "@/hooks/validation";

export default function required(message: string): Validator {
  return function (value: string) {
    if (value === "") {
      return message;
    }

    return null;
  };
}
