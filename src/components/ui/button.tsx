import React from 'react'

type ButtonVariant = 'default' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

export function Button({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  } as const
  const variantClasses: Record<ButtonVariant, string> = {
    default: 'bg-brand text-white hover:bg-brand/90 focus:ring-brand',
    ghost: 'bg-transparent text-brand border border-brand hover:bg-brand/10',
    outline: 'bg-transparent border border-brand text-brand hover:bg-brand/10',
  }
  const cls = [
    'rounded-md font-semibold select-none',
    sizes[size],
    variantClasses[variant],
    className,
  ].join(' ')

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}
