import { type ButtonHTMLAttributes, type ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 
    'switch-button font-bold rounded-full transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95'
  
  const variantClasses = {
    primary: 'bg-switch-red hover:bg-red-700 text-white focus:ring-red-300 shadow-switch hover:shadow-switch-hover',
    secondary: 'bg-white hover:bg-switch-gray-100 text-switch-dark focus:ring-switch-gray-300 border-2 border-switch-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300',
  }

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  }

  const widthClass = fullWidth ? 'w-full' : ''

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClass}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <button
      className={combinedClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}