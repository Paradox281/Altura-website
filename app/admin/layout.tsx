"use client"

import { usePathname } from "next/navigation"
import { AdminSidebar } from "@/app/components/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isPrintPage = pathname.includes("/print")

  if (isPrintPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 