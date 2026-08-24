import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { errorClass, hintClass, inputClass, labelClass } from "./ui";

type FieldWrapProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

function FieldWrap({ id, label, hint, error, children }: FieldWrapProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {hint && !error ? <p className={hintClass}>{hint}</p> : null}
      {error ? (
        <p id={`${id}-error`} className={errorClass} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type NumberFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  hint?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: string;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "value" | "onChange" | "prefix"
>;

export function NumberField({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  hint,
  error,
  min = 0,
  step = "0.01",
  ...rest
}: NumberFieldProps) {
  return (
    <FieldWrap id={id} label={label} hint={hint} error={error}>
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} ${prefix ? "pl-7" : ""} ${suffix ? "pr-12" : ""}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />
        {suffix ? (
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted">
            {suffix}
          </span>
        ) : null}
      </div>
    </FieldWrap>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "value" | "onChange">;

export function TextField({
  id,
  label,
  value,
  onChange,
  hint,
  error,
  ...rest
}: TextFieldProps) {
  return (
    <FieldWrap id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
    </FieldWrap>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  hint?: string;
  error?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "value" | "onChange">;

export function SelectField({
  id,
  label,
  value,
  onChange,
  children,
  hint,
  error,
  ...rest
}: SelectFieldProps) {
  return (
    <FieldWrap id={id} label={label} hint={hint} error={error}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        {...rest}
      >
        {children}
      </select>
    </FieldWrap>
  );
}
