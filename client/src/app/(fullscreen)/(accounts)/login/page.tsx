"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { FormEvent, useEffect, useState } from "react";

import { useFormState, useValidationBinder } from "@/hooks/form-state";
import { useValidator } from "@/hooks/validation";

import required from "@/hooks/validation/validators/required";
import { min } from "@/hooks/validation/validators/range";

import Field from "@/components/forms/field-wrapper";
import FieldErrorList from "@/components/forms/field-error-list";
import FieldErrorPair from "@/components/forms/field-error-pair";

import HiddenField from "@/components/forms/fields/hidden-field";

import fetchWithToken from "@/util/api/fetch-with-token";
import { setToken } from "@/util/storage/token";

interface LoginFormState {
  username?: string;
  password?: string;
}

interface LoginResponseModel {
  access_token: string;
  bearer: string;
}

export default function LoginForm() {
  const router = useRouter();

  const { formState, setFormField } = useFormState<LoginFormState>({});
  const [errorBuilders, errors] = useValidator({
    username: [required("Username is required!")],
    password: [
      required("Password is required!"),
      min(6, "Password must be at least 6 characters.")
    ]
  });

  const validate = useValidationBinder(formState, errorBuilders);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleInput(event: FormEvent<HTMLInputElement>) {
    const { name: field, value } = event.currentTarget;

    setFormField(field, value);
    errorBuilders[field](value);
  }

  // if we have an existing access token, just go back to the home page:
  (async () => {
    const { ok: isAuthenticated } = await fetchWithToken("/api/account/login");

    if (isAuthenticated) {
      router.push("/");
    }
  })();

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
          onClick={async (event) => {
            event.preventDefault();

            if (validate()) {
              const { password, ...rest } = formState;

              setIsSubmitting(true);

              const response = await fetch("/api/account/login", {
                method: "POST",
                body: JSON.stringify({
                  ...rest,
                  user_password: password
                })
              });
              const responseBody = await response.json();

              setIsSubmitting(false);

              if (response.ok) {
                const { access_token: accessToken }: LoginResponseModel =
                  responseBody;

                if (accessToken) {
                  setToken(accessToken);
                  return router.push("/");
                }

                // didn't get an access token? what do we do?
              }

              // not OK, so something (probably) abides by the response modeL:
              if ((responseBody as ErrorResponseModel).detail) {
                console.error(`Something went wrong: ${responseBody.detail}`);
                // TODO: display this on the form itself
              }
            }
          }}
          disabled={isSubmitting}
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
