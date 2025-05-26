import { isAuthenticated } from '@/lib/actions/auth.actions'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import  { ReactNode } from 'react'

const Layout = async({children}:{children:ReactNode}) => {
  const isUserAuthenticated=await isAuthenticated()
  if(!isUserAuthenticated) redirect('/signin')
  return (
    <div className='root-layout'>
      <nav>
        <Link href='/' className='flex items-center gap-2'>
          <Image src='/logo.svg' alt='logo' width={38} height={32}/>
          <h2>PrepZone</h2>
        </Link>
        {children}
      </nav>
    </div>
  )
}

export default Layout