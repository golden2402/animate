"use client";

import { useRouter } from "next/navigation";

import { FormEvent, useState } from "react";

import { useFormState, useValidationBinder } from "@/hooks/form-state";
import { useValidator } from "@/hooks/validation";

import Field from "@/components/forms/field-wrapper";
import FieldErrorList from "@/components/forms/field-error-list";
import FieldErrorPair from "@/components/forms/field-error-pair";
import HiddenField from "@/components/forms/fields/hidden-field";

import fetchWithToken from "@/util/api/fetch-with-token";
import { setToken } from "@/util/storage/token";

const affirmationMessage = "Yes, I want to delete my account.";

interface DeletionFormState {
  deletionSignature?: string;
  deletionOldPassword?: string;
}

export default function DeletionForm() {
  const router = useRouter();

  const { formState, setFormField } = useFormState<DeletionFormState>({});
  const [errorBuilders, errors] = useValidator({
    deletionSignature: [
      (value: string) =>
        value.length > 0 &&
        value.trim() !== affirmationMessage &&
        `You must affirm: "${affirmationMessage}"`
    ],
    deletionOldPassword: []
  });

  const validate = useValidationBinder(formState, errorBuilders);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleInput(event: FormEvent<HTMLInputElement>) {
    const { name: field, value } = event.currentTarget;

    setFormField(field, value);
    errorBuilders[field](value);
  }

  return (
    <>
      <div>
        <h2 className="text-xl text-red-900 font-bold">Danger Zone</h2>
        <p className="text-sm text-neutral-500">Tread with caution.</p>
      </div>

      <div className="w-full h-[1px] bg-neutral-300" />

      <div className="text-sm">
        <h3 className="font-medium">Delete Account</h3>
        <p className="text-neutral-500">
          Please affirm by typing &quot;Yes, I want to delete my account.&quot;
          in the field below.
        </p>
      </div>
      <FieldErrorPair>
        <Field>
          <input
            name="deletionSignature"
            autoComplete="off"
            placeholder="Yes, I want to delete my account."
            onChange={handleInput}
          />
        </Field>
        <FieldErrorList errors={errors.deletionSignature} />
      </FieldErrorPair>

      <h3 className="text-sm font-medium">Current Password</h3>
      <FieldErrorPair>
        <Field>
          <HiddenField
            name="deletionOldPassword"
            placeholder="Current Password"
            onChange={handleInput}
          />
        </Field>
        <FieldErrorList errors={errors.deletionOldPassword} />
      </FieldErrorPair>

      <p className="text-sm text-red-500">
        Account deletion cannot be undone&mdash;be sure you want to do this.
      </p>

      <button
        className="text-sm px-6 py-1 min-w-[6rem] w-fit rounded danger-box danger-shadow"
        onClick={async (event) => {
          event.preventDefault();

          if (validate()) {
            const { deletionSignature, deletionOldPassword } = formState;

            setIsSubmitting(true);

            const response = await fetchWithToken("/api/account/edit", {
              method: "DELETE"
              // headers: { "content-type": "application/json" },
              // TODO: add password confirmation in here?:
              // body: JSON.stringify({})
            });
            const responseBody = await response.json();

            setIsSubmitting(false);

            if (response.ok) {
              setToken(null);
              router.push("/register");
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
        Delete Account
      </button>
    </>
  );
}
