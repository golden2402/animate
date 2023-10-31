"use client";

import { FormEvent, InputHTMLAttributes, useState } from "react";

import EyeOffIcon from "@/components/icons/EyeIcon";
import EyeIcon from "@/components/icons/EyeIcon";

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  onUpdate: (event: FormEvent<HTMLInputElement>) => void;
}

export default function PasswordField({
  onUpdate,
  ...rest
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
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
        onInput={onUpdate}
        onBlur={onUpdate}
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
