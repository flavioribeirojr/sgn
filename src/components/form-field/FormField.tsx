export function FormField(props: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div className={props.className}>
      <label className='block font-bold' style={{ fontFamily: 'helvetica' }}>
        { props.label }
      </label>
      { props.children }
    </div>
  )
}