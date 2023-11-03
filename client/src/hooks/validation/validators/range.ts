import type { Validator } from "@/hooks/validation";

export function min(min: number, message: string): Validator {
  return function (value: string) {
    return value.trim().length < min && message;
  };
}

export function max(max: number, message: string): Validator {
  return function (value: string) {
    return value.trim().length > max && message;
  };
}
