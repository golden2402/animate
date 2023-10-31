"use client";

import Link from "next/link";

import { FormEvent } from "react";

import PasswordField from "@/components/forms/password-field";

export default function LoginForm() {
  return (
    <section className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-medium">Login</h2>

      <form className="flex flex-col gap-2">
        <input
          className="p-2 w-full fg fg-outline rounded text-sm"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="Username"
        />
        <PasswordField
          onUpdate={(event: FormEvent<HTMLInputElement>) =>
            console.log(event.currentTarget.value)
          }
          placeholder="Password"
        />
      </form>

      <Link className="text-blue-500 text-sm text-center" href="">
        Forgot your password?
      </Link>

      <input
        className="primary-box rounded p-2"
        type="submit"
        value="Sign in"
      />

      <div className="text-sm text-center">
        Don&apos;t have an account?&nbsp;
        <Link className="text-blue-500" href="">
          <span>Sign up.</span>
        </Link>
      </div>
    </section>
  );
}
