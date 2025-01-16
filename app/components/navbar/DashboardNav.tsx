'use client'

import Link from "next/link"

export default function DashboardNav() {
    return(
        <nav className="fixed left-0 h-fll w-64 bg-gray-800 text-white p4"> 
        <div className="flex flex-col gap-4">
            <Link href="/dashboard">
                <a className="hover:bg-gray-700 p-2 rounded">Dashboard</a>
            </Link>
            <Link href="/dashboard/workouts">
                <a className="hover:bg-gray-700 p-2 rounded">Workouts</a>
            </Link>
            <Link href="/dashboard/progress">
                <a className="hover:bg-gray-700 p-2 rounded">Progress</a>
            </Link>
            <Link href="/dashboard/settings">
                <a className="hover:bg-gray-700 p-2 rounded">Settings</a>
            </Link>
        </div>
        </nav>
    )
}