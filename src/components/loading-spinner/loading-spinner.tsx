export function LoadingSpinner() {
  return (
    <span
      className='w-6 h-6 rounded-full relative animate-spin inline-block border-4 border-white border-solid'
    >
      <span
        className='absolute rounded-full top-1/2 left-1/2 border-4 border-b-blue-400 border-transparent'
        style={{ width: '34px', height: '34px', transform: 'translate(-50%, -50%)' }}
      />
    </span>
  )
}