"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function PasswordField({
  id,
  value,
  onChange,
  autoComplete,
  minLength,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: "current-password" | "new-password";
  minLength?: number;
  describedBy?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="auth-pass">
      <input
        id={id}
        name={id}
        type={show ? "text" : "password"}
        className="auth-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        minLength={minLength}
        aria-describedby={describedBy}
        required
      />
      <button
        type="button"
        className="auth-pass-toggle"
        onClick={() => setShow(!show)}
        aria-label={show ? "Şifreyi gizle" : "Şifreyi göster"}
        aria-pressed={show}
      >
        {show ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}
