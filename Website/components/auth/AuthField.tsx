import { ChangeEventHandler, ReactNode } from "react";

type AuthFieldProps = {
  label: string;
  type?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  icon?: ReactNode;
  rightAction?: ReactNode;
  required?: boolean;
};

export default function AuthField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  rightAction,
  required = true
}: AuthFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      <div className="relative">
        {icon ? <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span> : null}
        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          style={{ paddingLeft: icon ? "2.5rem" : undefined, paddingRight: rightAction ? "2.75rem" : undefined }}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        {rightAction ? <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightAction}</span> : null}
      </div>
    </label>
  );
}
