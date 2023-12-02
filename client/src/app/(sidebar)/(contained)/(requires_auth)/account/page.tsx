"use client";

import { FormEvent } from "react";

import { useValidator } from "@/hooks/validation";

import CredentialsForm from "./_forms/credentials";
import DeletionForm from "./_forms/deletion";
import ProfileForm from "./_forms/profile";

export default function Account() {
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
        <DeletionForm />
      </form>
    </div>
  );
}
