import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const base =
    'px-4 py-2 rounded-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2';
  let color = '';
  if (variant === 'primary') color = 'bg-blue-600 text-white hover:bg-blue-700';
  if (variant === 'danger') color = 'bg-red-100 text-red-600 hover:bg-red-200';
  if (variant === 'outline') color = 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50';
  return (
    <button className={`${base} ${color} ${className}`} {...props}>
      {children}
    </button>
  );
}; 