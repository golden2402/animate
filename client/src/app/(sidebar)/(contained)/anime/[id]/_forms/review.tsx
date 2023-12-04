"use client";

import { FormEvent, useState } from "react";

import { useFormState, useValidationBinder } from "@/hooks/form-state";
import { useValidator } from "@/hooks/validation";

import required from "@/hooks/validation/validators/required";
import { min, max } from "@/hooks/validation/validators/range";

import Field from "@/components/forms/field-wrapper";
import FieldErrorList from "@/components/forms/field-error-list";
import FieldErrorPair from "@/components/forms/field-error-pair";

import fetchWithToken from "@/util/api/fetch-with-token";

interface ReviewFormState {
  post?: string;
}

export default function ReviewForm({ animeUrlId }: { animeUrlId: number }) {
  const { formState, setFormField } = useFormState<ReviewFormState>({});
  const [errorBuilders, errors] = useValidator({
    post: [
      required("Writer's block? We can't submit an empty review!"),
      min(24, "Say a little bit more about this anime..."),
      max(1024, "Your review is too long. Keep it to 1024 characters.")
    ]
  });

  const validate = useValidationBinder(formState, errorBuilders);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleInput(field: string, value: string) {
    setFormField(field, value);
    errorBuilders[field](value);
  }

  return (
    <>
      <div>
        <h2 className="text-lg font-medium">Your Review</h2>
      </div>

      <FieldErrorPair>
        <Field>
          <textarea
            name="post"
            className="block h-36 resize-none"
            placeholder="Let the world know what you think."
            onChange={(event) => {
              const { name: field, value } = event.currentTarget;
              handleInput(field, value);
            }}
          />
        </Field>
        <FieldErrorList errors={errors.post} />
      </FieldErrorPair>

      <button
        className="text-sm px-6 py-1 min-w-[6rem] w-fit rounded primary-box primary-shadow"
        onClick={async (event) => {
          event.preventDefault();

          if (validate()) {
            setIsSubmitting(true);

            const response = await fetchWithToken("/api/anime/review", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                anime_id: animeUrlId,
                ...formState
              })
            });

            setIsSubmitting(false);

            if (response.ok) {
              console.log("Added review.");
              // reporting?
              return;
            }
          }
        }}
        disabled={isSubmitting}
      >
        Post Review
      </button>
    </>
  );
}
