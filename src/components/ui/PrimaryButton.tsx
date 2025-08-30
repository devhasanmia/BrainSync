import React from "react";

interface PrimaryButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  type = "button",
  onClick,
  children,
  icon,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg transition flex items-center justify-center gap-2 ${className}`}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {children}
    </button>
  );
};

export default PrimaryButton;
