"use client";

import { InputHTMLAttributes, useState } from "react";

import EyeOffIcon from "@/components/icons/EyeOffIcon";
import EyeIcon from "@/components/icons/EyeIcon";

export default function HiddenField(
  props: InputHTMLAttributes<HTMLInputElement>
) {
  // consume certain properties (for discard!) but preserve other props:
  const { className, type, autoComplete, ...rest } = props;

  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="flex justify-between gap-2">
      <input
        type={!showPassword ? "password" : "text"}
        autoComplete="current-password"
        {...rest}
      />
      <button type="button" onClick={() => setShowPassword((value) => !value)}>
        {showPassword ? (
          <EyeOffIcon className="h-5" />
        ) : (
          <EyeIcon className="h-5" />
        )}
      </button>
    </div>
  );
}
