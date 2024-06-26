import { Indie_Flower } from 'next/font/google'
import Image from 'next/image'
import { SignupDataProvider } from './SignupData.contex'

const indieFlower = Indie_Flower({ subsets: ['latin'], weight: '400' })

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='relative w-screen h-full min-h-screen flex flex-col'>
      <Image
        src='/auth_bg.png'
        alt='desk with a computer and a plant'
        className='absolute w-full h-full'
        width={1265}
        height={949}
      />
      <div className='bg-black opacity-25 absolute w-full h-full' />
      <div className='backdrop-blur-sm absolute w-full h-full' />
      <main className='relative flex flex-col items-center pt-12 px-7 2xl:justify-center flex-grow'>
        <div className='w-24 h-24 rounded-full flex justify-center items-center text-6xl bg-tek-yellow'>
          🦧
        </div>
        <h1 className={`${indieFlower.className} text-white text-center pt-3 pb-3 text-6xl`}>
          Tekoa
        </h1>
        <SignupDataProvider>
          { children }
        </SignupDataProvider>
      </main>
      <footer className='text-white relative text-center mt-5 pb-4 text-xs'>
        <p>Version 0.0.1</p>
        <div>
          <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ' className='underline leading-6'>
            terms of use
          </a>
          <span className='px-2'>|</span>
          <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ' className='underline leading-6'>
            privacy policy
          </a>
        </div>
      </footer>
    </div>
  )
}