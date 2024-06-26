import { ButtonHTMLAttributes } from 'react'

export function SubmitButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`${props.className || ''} bg-black text-white text-center h-12 w-full flex items-center justify-center`}
    />
  )
}