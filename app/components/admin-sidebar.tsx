"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Calendar,
  MapPin,
  Star,
  Percent,
  Building2,
  LogOut,
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: Calendar,
  },
  {
    title: "Destinations",
    href: "/admin/destinations",
    icon: MapPin,
  },
  {
    title: "Testimonials",
    href: "/admin/testimonials",
    icon: Star,
  },
  {
    title: "Promos",
    href: "/admin/promos",
    icon: Percent,
  },
  {
    title: "Facilities",
    href: "/admin/facilities",
    icon: Building2,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // Hapus semua data dari localStorage
    localStorage.clear()
    // Redirect ke halaman login
    router.push('/login')
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-4">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )
} 