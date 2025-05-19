import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
type Props = {
    children: React.ReactNode
}
const Layout = ({ children }: Props) => {
    return (
        <div className=' min-h-screen flex flex-col '>
            <Header />
            <div className='flex-1 w-full h-full'>
                <div className='px-6 md:px-16 lg:px-24 xl:px-32 py-4 ]'>
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Layout