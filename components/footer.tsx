import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full bg-black text-gray-400 py-12 border-t border-white/10 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-white text-xl font-bold">Ticket Ease</h3>
            <p className="text-sm">
              Your AI-powered booking ally. Skip the lines and secure your spots in seconds with just one click.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Events</Link></li>
              <li><Link href="/venues" className="hover:text-white transition-colors">Venues</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Chandigarh, India</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@ticketease.com</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm flex flex-col items-center">
          <p>&copy; {new Date().getFullYear()} TicketEase. All rights reserved.</p>
          <p className="mt-2 text-xs text-gray-500">6th Semester Project Demonstration</p>
        </div>
      </div>
    </footer>
  )
}
