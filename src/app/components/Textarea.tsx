import { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm uppercase tracking-wide font-mono">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 bg-[#F5F5F5] border border-[#0C0C0A] focus:outline-none focus:ring-2 focus:ring-[#dd3935] resize-none ${className}`}
        {...props}
      />
    </div>
  );
}
