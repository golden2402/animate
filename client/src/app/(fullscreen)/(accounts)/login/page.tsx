"use client";

import Link from "next/link";

import { useState } from "react";

import EyeIcon from "@/components/icons/EyeIcon";
import EyeOffIcon from "@/components/icons/EyeOffIcon";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

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
        <div
          className="
          flex justify-between gap-2
          p-2
          rounded
          fg fg-outline
          text-sm"
        >
          <input
            className="p w-full bg-transparent"
            name="password"
            type={!showPassword ? "password" : "text"}
            autoComplete="current-password"
            placeholder="Password"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOffIcon className="h-5" />
            ) : (
              <EyeIcon className="h-5" />
            )}
          </button>
        </div>
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
