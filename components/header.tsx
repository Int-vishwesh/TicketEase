"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation" 

export function Header() {
  const pathname = usePathname();  //current route path

  const isHome = pathname === "/home";  //if we're on /home

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-black/50">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="icon.png"
              alt="Crop Studio"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-medium text-white text-2xl">Ticket Ease</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
            tickets
          </Link>
          <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
            events
          </Link>
          <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
            venues
          </Link>
          <Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">
            Contact us 
          </Link>
        </nav>

        {/* Conditionally render the button */}
        <Button variant="secondary" className="bg-white text-black hover:bg-gray-100 hover:shadow-2xl hover:shadow-white">
          <Link href={isHome ? "/dashboard" : "/login"}>
            {isHome ? "Dashboard" : "Get Started"}
          </Link>
        </Button>
      </div>
    </header>
  );
}
