"use client";

import { useRouter } from "next/navigation";

import { FormEvent, useState } from "react";

import { useFormState, useValidationBinder } from "@/hooks/form-state";
import { useValidator } from "@/hooks/validation";

import required from "@/hooks/validation/validators/required";
import regex from "@/hooks/validation/validators/regex";
import { min } from "@/hooks/validation/validators/range";

import Field from "@/components/forms/field-wrapper";
import FieldErrorList from "@/components/forms/field-error-list";
import FieldErrorPair from "@/components/forms/field-error-pair";
import HiddenField from "@/components/forms/fields/hidden-field";

import fetchWithToken from "@/util/api/fetch-with-token";
import { setToken } from "@/util/storage/token";

interface CredentialsFormState {
  // TODO:
  newUsername?: string;
  newPassword?: string;
  oldPassword?: string;
}

export default function CredentialsForm() {
  const router = useRouter();

  const { formState, setFormField } = useFormState<CredentialsFormState>({});
  const [errorBuilders, errors] = useValidator({
    newUsername: [
      min(4, "Username must be at least 4 characters."),
      regex(
        /[a-zA-Z0-9._]+/,
        "Please use numbers, letters, underscores, or dots."
      ),
      regex(/^(?!.*[.]{2})/, "Username cannot contain repeating dots.")
    ],
    newPassword: [min(6, "Password must be at least 6 characters.")],
    oldPassword: [
      required("Password is required!"),
      min(6, "Password must be at least 6 characters.")
    ]
  });

  const validate = useValidationBinder(formState, errorBuilders);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // have to use a different signature here because the textarea isn't compliant
  //
  function handleInput(event: FormEvent<HTMLInputElement>) {
    const { name: field, value } = event.currentTarget;

    setFormField(field, value);
    errorBuilders[field](value);
  }

  return (
    <>
      <div>
        <h2 className="text-xl font-bold">Credentials</h2>
        <p className="text-sm text-neutral-500">
          Let&apos;s make sure we got everything correct.
        </p>
      </div>

      <div className="w-full h-[1px] bg-neutral-300" />

      <div className="text-sm">
        <h3 className="font-medium">Username</h3>
        <p className="text-xs text-neutral-500">
          This is how others discover you on AniMate.
        </p>
      </div>
      <FieldErrorPair>
        <Field>
          <input
            name="newUsername"
            placeholder="New Username"
            onChange={handleInput}
          />
        </Field>
        <FieldErrorList errors={errors.newUsername} />
      </FieldErrorPair>

      <h3 className="text-sm font-medium">Change Password</h3>
      <FieldErrorPair>
        <Field>
          <HiddenField
            name="newPassword"
            autoComplete="password"
            placeholder="New Password"
            onChange={handleInput}
          />
        </Field>
        <FieldErrorList errors={errors.newPassword} />
      </FieldErrorPair>

      <div className="text-sm">
        <h3 className="font-semibold">Verify</h3>
        <p className="text-xs text-neutral-500">
          Before we make these changes, we need to make sure it&apos;s you.
        </p>
      </div>

      <h3 className="text-sm font-medium">Current Password</h3>
      <FieldErrorPair>
        <Field>
          <HiddenField
            name="oldPassword"
            placeholder="Current Password"
            onChange={handleInput}
          />
        </Field>
        <FieldErrorList errors={errors.oldPassword} />
      </FieldErrorPair>

      <button
        className="text-sm px-6 py-1 min-w-[6rem] w-fit rounded primary-box primary-shadow"
        onClick={async (event) => {
          event.preventDefault();

          if (validate()) {
            // TODO: use oldPassword?:
            const { newUsername, newPassword, oldPassword } = formState;

            setIsSubmitting(true);

            const response = await fetchWithToken("/api/account/edit", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                username: newUsername,
                user_password: newPassword
              })
            });
            const responseBody = await response.json();

            setIsSubmitting(false);

            if (response.ok) {
              setToken(null);
              router.push("/login");
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
        Update
      </button>
      <p className="text-xs text-neutral-500">
        You&apos;ll be asked to sign in again.
      </p>
    </>
  );
}
