"use client";

import { FormEvent } from "react";

import { useValidator } from "@/hooks/validation";

import Field from "@/components/forms/field-wrapper";
import FieldErrorList from "@/components/forms/field-error-list";
import FieldErrorPair from "@/components/forms/field-error-pair";
import HiddenField from "@/components/forms/fields/hidden-field";

import CredentialsForm from "./_forms/credentials";
import ProfileForm from "./_forms/profile";

export default function Account() {
  const [errorBuilders, errors] = useValidator({
    // credentials:
    // TODO:
    newUsername: [],
    newPassword: [],
    oldPassword: [],

    // danger zone:
    deletionSignature: [
      (value: string) =>
        value.length > 0 &&
        value.trim() !== "Yes, I want to delete my account." &&
        'You must affirm: "Yes, I want to delete my account."'
    ],
    // TODO:
    deletionOldPassword: []
  });

  function handleInput(
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name: field, value } = event.currentTarget;
    errorBuilders[field](value);
  }

  return (
    <div
      className="
      flex flex-col gap-4
      mx-auto max-w-3xl"
    >
      <div>
        <h1 className="text-3xl font-bold">Account</h1>
        <p className="text-neutral-500">
          Keep your information correct & up to date.
        </p>
      </div>

      <form
        className="
        flex flex-col gap-2
        p-6
        rounded
        fg fg-outline"
      >
        <ProfileForm />
      </form>

      <form
        className="
        flex flex-col gap-2
        p-6
        rounded
        fg fg-outline"
      >
        <CredentialsForm />
      </form>

      <form
        className="
        flex flex-col gap-2
        p-6
        rounded
        fg fg-outline"
      >
        <div>
          <h2 className="text-xl text-red-900 font-bold">Danger Zone</h2>
          <p className="text-sm text-neutral-500">Tread with caution.</p>
        </div>

        <div className="w-full h-[1px] bg-neutral-300" />

        <div className="text-sm">
          <h3 className="font-medium">Delete Account</h3>
          <p className="text-neutral-500">
            Please affirm by typing &quot;Yes, I want to delete my
            account.&quot; in the field below.
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
          onClick={(event) => {
            event.preventDefault();
            // TODO: submit!
          }}
        >
          Delete Account
        </button>
      </form>
    </div>
  );
}
