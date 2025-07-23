"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Mountain, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isPrintPage = pathname.includes("/print")

  if (isPrintPage) {
    return (
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    )
  }

  return (
    <html lang="en">
      <head>
        <title>Altura - Travel Booking</title>
        <meta name="description" content="Discover amazing destinations with Altura Travel" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                      <Mountain className="h-8 w-8 text-blue-600" />
                      <span className="ml-2 text-xl font-bold text-gray-900">Altura</span>
                    </Link>
                  </div>
                  <nav className="hidden md:flex space-x-8">
                    <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Home
                    </Link>
                    <Link href="/destinations" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Destinations
                    </Link>
                    <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                      About Us
                    </Link>
                    <Link href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Contact
                    </Link>
                  </nav>
                </div>
              </div>
            </header>

            <main className="flex-grow">{children}</main>

            <footer id="contact" className="bg-gray-900 text-white py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <div className="flex items-center mb-4">
                      <Mountain className="h-8 w-8 text-blue-400" />
                      <span className="ml-2 text-xl font-bold">Altura</span>
                    </div>
                    <p className="text-gray-400 mb-4">
                    Temukan destinasi menakjubkan dan ciptakan kenangan tak terlupakan dengan pengalaman perjalanan pilihan kami.
                    </p>
                    <div className="flex space-x-4">
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        <Facebook size={20} />
                      </a>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        <Instagram size={20} />
                      </a>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        <Twitter size={20} />
                      </a>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link href="/destinations" className="text-gray-400 hover:text-white transition-colors">
                          Destinations
                        </Link>
                      </li>
                      <li>
                        <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                          About Us
                        </Link>
                      </li>
                      
                      <li>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                          Privacy Policy
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Popular Destinations</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link href="/detail/1" className="text-gray-400 hover:text-white transition-colors">
                          Harau, Payakumbuh
                        </Link>
                      </li>
                      
                      <li>
                        <Link href="/detail/6" className="text-gray-400 hover:text-white transition-colors">
                          Kelok Sembilan, Sumbar
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <MapPin className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                        <span className="text-gray-400">Sawah Padang , Payakumbuh,Sumatra Barat ,Indonesia</span>
                      </li>
                      <li className="flex items-center">
                        <Phone className="h-5 w-5 text-blue-400 mr-2" />
                        <span className="text-gray-400">+62 082287338654</span>
                      </li>
                      <li className="flex items-center">
                        <Mail className="h-5 w-5 text-blue-400 mr-2" />
                        <span className="text-gray-400">info@altura-travel.com</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                  <p>&copy; {new Date().getFullYear()} Altura Travel. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
