import { ReactNode } from 'react';

interface AdminButtonProps {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  icon?: string;
}

export default function AdminButton({ 
  variant = 'primary', 
  children, 
  onClick, 
  disabled = false,
  type = 'button',
  icon
}: AdminButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-xl px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}