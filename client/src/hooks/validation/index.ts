"use client";

import { useState } from "react";

export type Validator = (value: string) => any;

export type ValidatorSchema = Record<string, Validator[]>;
export type ValidatorErrors = Record<string, any>;

type ErrorBuilder = (value: string) => boolean;

export function useValidator(schema: ValidatorSchema) {
  const schemaKeys = Object.keys(schema);
  const emptyErrorFields = schemaKeys.reduce((result, key) => {
    result[key] = [];
    return result;
  }, {} as ValidatorErrors);

  const [errors, setErrors] = useState<ValidatorErrors>(emptyErrorFields);

  function buildValidator(field: string) {
    const validators = schema[field];

    return (value: string) => {
      const validationErrors = validators
        .map((fn) => fn(value))
        // is it safe to filter all falsy values?:
        .filter(Boolean);

      setErrors({
        ...errors,
        [field]: validationErrors
      });

      return validationErrors.length === 0;
    };
  }

  const errorBuilders = schemaKeys.reduce(
    (result, key) => {
      result[key] = buildValidator(key);
      return result;
    },
    {} as Record<string, ErrorBuilder>
  );

  return [errorBuilders, errors];
}
