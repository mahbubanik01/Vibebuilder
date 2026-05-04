import React from 'react'

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={[
        'rounded-xl border border-[#30363D] bg-[#161B22] p-6',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}
