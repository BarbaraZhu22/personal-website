import { ReactNode, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'default' | 'primary' | 'secondary'
}

export default function Button({
  children,
  variant = 'default',
  className = '',
  ...props
}: ButtonProps) {
  const variantClasses = {
    default: 'btn',
    primary: 'btn btn-primary',
    secondary: 'btn',
  }

  return (
    <button
      className={`${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
