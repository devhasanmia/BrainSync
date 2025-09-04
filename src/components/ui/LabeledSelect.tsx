import React from "react";
import { Controller, type Control } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface LabeledSelectProps {
  label: string;
  name: string;
  control: Control<any>;
  options: Option[];
  required?: boolean;
  error?: string;
}

const LabeledSelect: React.FC<LabeledSelectProps> = ({
  label,
  name,
  control,
  options,
  required = false,
  error,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300 transition-colors duration-300">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field }) => (
          <select
            {...field}
            className={`w-full px-4 py-3 rounded-xl border
              ${error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"}
              dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
              placeholder-gray-400
              transition-colors outline-none shadow-sm`}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="dark:bg-gray-700 dark:text-white"
              >
                {opt.label}
              </option>
            ))}
          </select>
        )}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default LabeledSelect;
