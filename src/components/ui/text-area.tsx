'use client'

import { useState } from 'react'
import { cx, fieldClass } from './index'

/*
  A multi-line field. Taller than a single-line Input because it holds prose,
  and with a count under it when the caller passes maxLength, so the editor
  sees how much room is left instead of finding out from the server.
*/
export function TextArea({
  maxLength,
  onChange,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const initial = String(props.value ?? props.defaultValue ?? '')
  const [length, setLength] = useState(initial.length)
  const nearLimit = maxLength != null && length >= maxLength * 0.9

  const field = (
    <textarea
      rows={6}
      {...props}
      maxLength={maxLength}
      onChange={(e) => {
        setLength(e.target.value.length)
        onChange?.(e)
      }}
      className={cx(fieldClass, 'py-3 leading-relaxed', className)}
    />
  )

  if (maxLength == null) return field

  return (
    <div className="grid gap-1">
      {field}
      <p
        className={cx('text-meta m-0 text-right tabular-nums', nearLimit ? 'text-warn' : 'text-text-faint')}
        aria-live="polite"
      >
        {length.toLocaleString()} / {maxLength.toLocaleString()}
      </p>
    </div>
  )
}
