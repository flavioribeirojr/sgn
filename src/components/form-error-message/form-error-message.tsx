import { HTMLProps } from 'react'

export function FormErrorMessage(props: HTMLProps<HTMLParagraphElement>) {
  return (
    <p
      className={`${props.className} text-red-500 font-medium text-sm`}
      style={{ fontFamily: 'helvetica' }}
    >
      { props.children }
    </p>
  )
}