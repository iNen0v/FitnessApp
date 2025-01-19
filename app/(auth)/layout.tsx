'use client'

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import { signOut } from "next-auth/react"

export default function DashboardLayout({
 children,
}: {
 children: React.ReactNode
}) {
 const { status, data: session } = useSession()

 useEffect(() => {
   if (status === "unauthenticated") {
     redirect("/login")
   }
 }, [status])

 if (status === "loading") {
   return <div>Loading...</div>
 }

 return (
   <div className="min-h-screen bg-gray-50">
     <nav className="bg-white shadow-sm">
       <div className="container mx-auto px-4">
         <div className="flex items-center justify-between h-16">
           <span className="font-bold">FitnessAI</span>
           <div className="flex items-center gap-4">
             <span className="text-gray-600">
               {session?.user?.name}
             </span>
             <button
               onClick={() => signOut()}
               className="text-gray-600 hover:text-gray-900"
             >
               Logout
             </button>
           </div>
         </div>
       </div>
     </nav>

     <div className="container mx-auto px-4 py-8">
       {children}
     </div>
   </div>
 )
}