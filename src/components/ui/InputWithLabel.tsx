// LabeledInput.tsx
import React from "react";
import type { UseFormRegister } from "react-hook-form";

interface LabeledInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  register: UseFormRegister<any>;
  error?: string; // <-- এখানে FieldError না দিয়ে শুধু string রাখো
}

const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  register,
  error,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5">
            {icon}
          </div>
        )}
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          className={`w-full ${
            icon ? "pl-10" : "pl-4"
          } pr-4 py-3 rounded-xl border 
            ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"} 
            dark:bg-gray-700 dark:text-white placeholder-gray-400 
            transition outline-none shadow-sm`}
          {...register(name)}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default LabeledInput;
