import { ChangeEvent } from "react";

export default function CommentBox({
  value,
  onChange,
  disabled,
  placeholder
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <textarea
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      placeholder={placeholder}
      value={value}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      disabled={disabled}
      rows={3}
    />
  );
}
