"use client";

import { FormEvent } from "react";

import { useValidator } from "@/hooks/validation";

import required from "@/hooks/validation/validators/required";
import naiveEmail from "@/hooks/validation/validators/naive-email";
import { min } from "@/hooks/validation/validators/range";

import Field from "@/components/forms/field-wrapper";
import FieldError from "@/components/forms/field-error";

import HiddenField from "@/components/forms/fields/hidden-field";

export default function RegisterForm() {
  const [errorBuilders, errors] = useValidator({
    email: [
      required("Email is required!"),
      naiveEmail("Email is of invalid format!")
    ],
    username: [required("Username is required!")],
    password: [
      required("Password is required!"),
      min(6, "Password must be at least 6 characters.")
    ]
  });

  function handleInput(event: FormEvent<HTMLInputElement>) {
    const { name: field, value } = event.currentTarget;
    errorBuilders[field](value);
  }

  return (
    <section className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-medium">Sign Up</h2>

      <form className="flex flex-col gap-2">
        <Field>
          <input
            name="email"
            autoComplete="email"
            placeholder="Email"
            onChange={handleInput}
          />
        </Field>
        <FieldError errors={errors.email} />

        <Field>
          <input
            name="username"
            autoComplete="username"
            placeholder="Username"
            onChange={handleInput}
          />
        </Field>
        <FieldError errors={errors.username} />

        <Field>
          <HiddenField
            name="password"
            autoComplete="password"
            placeholder="Password"
            onChange={handleInput}
          />
        </Field>
        <FieldError errors={errors.password} />
      </form>
    </section>
  );
}
