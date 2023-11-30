import type { Validator } from "@/hooks/validation";

export function min(min: number, message: string): Validator {
  return function (value: any) {
    return value && String(value).trim().length < min && message;
  };
}

export function max(max: number, message: string): Validator {
  return function (value: any) {
    return value && String(value).trim().length > max && message;
  };
}
