import { HTMLProps, forwardRef } from 'react'
import { UseFormRegister } from 'react-hook-form'

export const FormTextInput = forwardRef<
  HTMLInputElement,
  Props
>(function FormTextInput(props, ref) {
  return (
    <input
      {...props}
      ref={ref}
      className={`border-b border-black w-full placeholder-gray-400 outline-0 ${props.className}`}
      style={{ fontFamily: 'helvetica', ...props.style || {} }}
    />
  )
})

type Props = HTMLProps<HTMLInputElement> | (HTMLProps<HTMLInputElement> & ReturnType<UseFormRegister<any>>)