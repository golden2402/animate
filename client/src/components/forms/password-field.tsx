"use client";

import { InputHTMLAttributes, useState } from "react";

import EyeOffIcon from "@/components/icons/EyeIcon";
import EyeIcon from "@/components/icons/EyeIcon";

export default function PasswordField(
  props: InputHTMLAttributes<HTMLInputElement>
) {
  // consume certain properties (for discard!) but preserve other props:
  const { className, type, autoComplete, ...rest } = props;

  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="flex justify-between gap-2">
      <input
        className="w-full bg-transparent"
        type={!showPassword ? "password" : "text"}
        autoComplete="current-password"
        {...rest}
      />
      <button type="button" onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? (
          <EyeOffIcon className="h-5" />
        ) : (
          <EyeIcon className="h-5" />
        )}
      </button>
    </div>
  );
}
