import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm uppercase tracking-wide font-mono">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 bg-[#F5F5F5] border border-[#0C0C0A] focus:outline-none focus:ring-2 focus:ring-[#dd3935] ${className}`}
        {...props}
      />
    </div>
  );
}
