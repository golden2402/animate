"use client";

import { FormEvent, useState } from "react";

import { useFormState, useValidationBinder } from "@/hooks/form-state";
import { useValidator } from "@/hooks/validation";

import Field from "@/components/forms/field-wrapper";
import FieldErrorList from "@/components/forms/field-error-list";
import FieldErrorPair from "@/components/forms/field-error-pair";

import fetchWithToken from "@/util/api/fetch-with-token";

interface RatingFormState {
  score?: string;
}

export default function RatingForm({ animeUrlId }: { animeUrlId: number }) {
  const { formState, setFormField } = useFormState<RatingFormState>({});
  const [errorBuilders, errors] = useValidator({
    score: [
      (value: string) =>
        value !== "" && isNaN(Number(value)) && "Your score must be a number!",
      (value: string) =>
        value !== "" &&
        Number(value) < 1 &&
        "Your rating must be greater than 0. It wasn't that bad, was it?",
      (value: string) =>
        value !== "" &&
        Number(value) > 10 &&
        "Your rating must be 10 or less. Was it really that good?"
    ]
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
        <h2 className="text-lg font-medium">Your Rating</h2>
        <p className="text-sm text-neutral-500">
          Add your numeric score from 1-10:
        </p>
      </div>

      <FieldErrorPair>
        <Field className="max-w-xs">
          <input
            name="score"
            placeholder="How good was this show?"
            onChange={handleInput}
          />
        </Field>
        <FieldErrorList errors={errors.score} />
      </FieldErrorPair>

      <button
        className="text-sm px-6 py-1 min-w-[6rem] w-fit rounded primary-box primary-shadow"
        onClick={async (event) => {
          event.preventDefault();

          if (validate()) {
            // TODO: use oldPassword?:
            const { score } = formState;

            setIsSubmitting(true);

            const response = await fetchWithToken("/api/anime/rate", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                anime_id: animeUrlId,
                rate_date: new Date(),
                rate_score: score
              })
            });

            setIsSubmitting(false);

            if (response.ok) {
              console.log("Added rating.");
              // reporting?
              return;
            }
          }
        }}
        disabled={isSubmitting}
      >
        Rate
      </button>
    </>
  );
}
