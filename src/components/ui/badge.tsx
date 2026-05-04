import React from 'react'

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  color?: 'default'|'primary'|'success'|'warning'|'danger'
}

export function Badge({ children, color = 'default', className = '', ...props }: BadgeProps) {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold';
  const colorClass = color === 'primary' ? 'bg-[#2F81F7]/10 text-[#2F81F7] border border-[#2F81F7]/50' :
                      color === 'success' ? 'bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/50' :
                      color === 'warning' ? 'bg-[#F1C40F]/10 text-[#F1C40F] border border-[#F1C40F]/50' :
                      color === 'danger' ? 'bg-[#E74C3C]/10 text-[#E74C3C] border border-[#E74C3C]/50' :
                      'bg-[#30363D]/10 text-[#E6EDF3] border border-[#30363D]/50';
  return (
    <span className={[base, colorClass, className].join(' ')} {...props}>
      {children}
    </span>
  )
}
