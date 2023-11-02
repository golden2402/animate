"use client";

import { InputHTMLAttributes, useState } from "react";

import joinClasses from "@/util/join-classes";

import EyeOffIcon from "@/components/icons/EyeOffIcon";
import EyeIcon from "@/components/icons/EyeIcon";

export default function HiddenField(
  props: InputHTMLAttributes<HTMLInputElement>
) {
  // consume certain properties (for discard!) but preserve other props:
  const { className, type, ...rest } = props;

  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className={joinClasses("flex justify-between gap-2", className)}>
      <input type={!showPassword ? "password" : "text"} {...rest} />
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
