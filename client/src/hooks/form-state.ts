"use client";

import { useState } from "react";
import { ErrorBuilderMapping } from "./validation";

export type FormState = Record<string, any>;

export function useFormState<T>(baseFormState: T) {
  const [formState, setFormState] = useState<T>(baseFormState);

  function setFormField(field: string, value: any) {
    setFormState((currentFormState) => ({
      ...currentFormState,
      [field]: value
    }));
  }

  return { formState, setFormField };
}

// bind a validator to a form state:
export function useValidationBinder(
  formState: FormState,
  errorBuilders: ErrorBuilderMapping
) {
  return function () {
    return Object.keys(errorBuilders).reduce((result, key) => {
      const errorResult = errorBuilders[key](formState[key]);
      return result && errorResult;
    }, true);
  };
}
