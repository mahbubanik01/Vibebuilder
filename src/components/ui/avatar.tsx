import React from 'react'

type AvatarProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  size?: 'sm'|'md'|'lg'
  className?: string
}

export function Avatar({ size = 'md', className = '', ...props }: AvatarProps) {
  const sizePx = size === 'sm' ? 24 : size === 'lg' ? 48 : 32
  return (
    <img
      {...props}
      className={[`rounded-full`, className].join(' ')}
      style={{ width: sizePx, height: sizePx }}
    />
  )
}
