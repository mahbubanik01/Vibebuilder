import React from 'react'

type SheetProps = React.HTMLAttributes<HTMLDivElement> & {
  open?: boolean
  onClose?: () => void
  className?: string
}

export function Sheet({ children, className = '', ...props }: SheetProps) {
  // Minimal sheet: a fixed bottom panel (for Phase 1 baseline)
  return (
    <div className={`fixed left-0 right-0 bottom-0 bg-[#161B22] border-t border-[#30363D] ${className}`} {...props}>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}
