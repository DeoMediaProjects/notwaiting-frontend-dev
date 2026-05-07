import { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm uppercase tracking-wide font-mono">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-3 bg-[#F5F5F5] border border-[#0C0C0A] focus:outline-none focus:ring-2 focus:ring-[#dd3935] cursor-pointer ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
