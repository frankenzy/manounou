import React from "react";

interface ComponentProps {
  Placeholder?: string;
  disabled?: boolean;
  className?: string;
  type?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  pattern?: string;
  required?: boolean;
  checked?: boolean;
  name?:string
}

export default function Input({
  Placeholder,
  disabled,
  className,
  type = "text",
  value,
  onChange,
  onClick,
  onBlur,
  onFocus,
  onInput,
  onKeyDown,
  onKeyUp,
  pattern,
  required,
  checked,
  name,
}: ComponentProps) {
  return (
    <input
      className={`bg-white dark:bg-black/[.06] border border-solid border-black/[.08] dark:border-white/[.145] rounded-lg p-4 sm:p-6 ${className}`}
      type={type}
      name={name}
      disabled={disabled}
      placeholder={Placeholder}
      value={value}
      onChange={onChange}
      onClick={onClick}
      onBlur={onBlur}
      onFocus={onFocus}
      onInput={onInput}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      pattern={pattern}
      required={required}
      checked={checked}
    />
  );
}
