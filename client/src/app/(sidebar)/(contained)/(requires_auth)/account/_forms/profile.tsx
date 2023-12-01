"use client";

import { useState } from "react";

import { useFormState, useValidationBinder } from "@/hooks/form-state";
import { useValidator } from "@/hooks/validation";

import { max } from "@/hooks/validation/validators/range";

import Field from "@/components/forms/field-wrapper";
import FieldErrorList from "@/components/forms/field-error-list";
import FieldErrorPair from "@/components/forms/field-error-pair";

import fetchWithToken from "@/util/api/fetch-with-token";

interface ProfileFormState {
  displayName?: string;
  blurb?: string;
}

export default function ProfileForm() {
  const { formState, setFormField } = useFormState<ProfileFormState>({});
  const [errorBuilders, errors] = useValidator({
    // personalization:
    displayName: [max(80, "Display name can't be longer than 80 characters.")],
    blurb: [max(255, "Blurb can't be longer than 255 characters.")]
  });

  const validate = useValidationBinder(formState, errorBuilders);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // have to use a different signature here because the textarea isn't compliant
  function handleInput(field: string, value: string) {
    setFormField(field, value);
    errorBuilders[field](value);
  }

  return (
    <>
      <div>
        <h2 className="text-xl font-bold">Profile</h2>
        <p className="text-sm text-neutral-500">
          How do you want to appear on AniMate?
        </p>
      </div>

      <div className="w-full h-[1px] bg-neutral-300" />

      <div className="flex flex-col gap-2">
        <div className="max-w-xl">
          <h3 className="text-sm font-medium">Display Name</h3>
          <FieldErrorPair>
            <Field>
              <input
                name="displayName"
                placeholder="What do you want to be called?"
                onChange={(event) => {
                  const { name: field, value } = event.currentTarget;
                  handleInput(field, value);
                }}
              />
            </Field>
            <FieldErrorList errors={errors.displayName} />
          </FieldErrorPair>
        </div>

        <div>
          <h3 className="text-sm font-medium">Blurb</h3>
          <FieldErrorPair>
            <Field>
              <textarea
                name="blurb"
                className="block h-36 resize-none"
                placeholder="Say something about yourself..."
                onChange={(event) => {
                  const { name: field, value } = event.currentTarget;
                  handleInput(field, value);
                }}
              />
            </Field>
            <FieldErrorList errors={errors.blurb} />
          </FieldErrorPair>
        </div>
      </div>

      <button
        className="text-sm px-6 py-1 min-w-[6rem] w-fit rounded primary-box primary-shadow"
        onClick={async (event) => {
          event.preventDefault();

          if (validate()) {
            const { displayName, ...rest } = formState;

            setIsSubmitting(true);

            const response = await fetchWithToken("/api/account/edit", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                ...rest,
                display_name: displayName
              })
            });
            const responseBody = await response.json();

            setIsSubmitting(false);

            if (response.ok) {
              console.log("Success!");
              // reporting? since we're on the account page, we probably don't
              // want to move off of it
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
        Save
      </button>
    </>
  );
}
