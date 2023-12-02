import type { Validator } from "@/hooks/validation";

export default function required(message: string): Validator {
  return function (value: any) {
    return !value && message;
  };
}
