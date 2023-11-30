"use client";

import Link from "next/link";

import { FormEvent } from "react";

import { useValidator } from "@/hooks/validation";

import required from "@/hooks/validation/validators/required";
import { min } from "@/hooks/validation/validators/range";

import Field from "@/components/forms/field-wrapper";
import FieldErrorList from "@/components/forms/field-error-list";
import FieldErrorPair from "@/components/forms/field-error-pair";

import HiddenField from "@/components/forms/fields/hidden-field";

export default function LoginForm() {
  const [errorBuilders, errors] = useValidator({
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
    <section className="flex flex-col gap-4 p-12">
      <h2 className="text-xl font-medium">Login</h2>

      <form className="flex flex-col gap-4">
        <FieldErrorPair>
          <Field>
            <input
              name="username"
              autoComplete="username"
              placeholder="Username"
              onChange={handleInput}
            />
          </Field>
          <FieldErrorList errors={errors.username} />
        </FieldErrorPair>

        <FieldErrorPair>
          <Field>
            <HiddenField
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              onChange={handleInput}
            />
          </Field>
          <FieldErrorList errors={errors.password} />
        </FieldErrorPair>

        <button
          className="primary-box rounded p-2"
          onClick={(event) => {
            event.preventDefault();
            // TODO: submit here!
          }}
        >
          Sign in
        </button>
      </form>

      <div className="text-sm text-center">
        Don&apos;t have an account?&nbsp;
        <Link className="text-blue-500" href="">
          <span>Sign up.</span>
        </Link>
      </div>
    </section>
  );
}
