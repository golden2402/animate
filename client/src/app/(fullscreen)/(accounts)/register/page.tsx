"use client";

import Link from "next/link";

import { FormEvent } from "react";

import { useValidator } from "@/hooks/validation";

import required from "@/hooks/validation/validators/required";
import naiveEmail from "@/hooks/validation/validators/naive-email";
import { min } from "@/hooks/validation/validators/range";

import Field from "@/components/forms/field-wrapper";
import FieldErrorList from "@/components/forms/field-error-list";
import FieldErrorPair from "@/components/forms/field-error-pair";

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

      <form className="flex flex-col gap-4">
        <FieldErrorPair>
          <Field>
            <input
              name="email"
              autoComplete="email"
              placeholder="Email"
              onChange={handleInput}
            />
          </Field>
          <FieldErrorList errors={errors.email} />
        </FieldErrorPair>

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
              autoComplete="password"
              placeholder="Password"
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
          Sign up
        </button>
      </form>

      <div className="text-sm text-center">
        Already have an account?&nbsp;
        <Link className="text-blue-500" href="/login">
          <span>Sign in.</span>
        </Link>
      </div>
    </section>
  );
}
