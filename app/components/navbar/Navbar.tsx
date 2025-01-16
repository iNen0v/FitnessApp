'use client'

import Link from 'next/link'

export default function Navbar() {
    return(
        <nav className= "fixed top-0 w-full bg-white shadow-md">
            <div className='container mx-auto px-4'>
                <div className='flex justify-between items-center h-16'>
                    <div className='flex items-center'>
                        <Link href='/'>
                            <a className='text-xl font-bold'>Fitness App</a>
                        </Link>
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <Link href='/'>
                            <a className='mr-4'>Home</a>
                        </Link>
                        <Link href='/workouts'>
                            <a className='mr-4'>Workouts</a>
                        </Link>
                        <Link href='/exercises'>
                            <a>Exercises</a>
                        </Link>
                    </div>
            </div>

        </nav>
    )
}