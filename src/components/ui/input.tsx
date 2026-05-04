import React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string
}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={[
        'h-10 rounded-md px-3 bg-surface text-on-surface border border-surface-border',
        className,
      ].join(' ')}
      {...props}
    />
  )
}
