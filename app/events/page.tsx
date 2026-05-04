"use client"

import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, Star, ArrowRight, Ticket, Music, Trophy, Film, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Footer } from "@/components/footer"

const featuredEvents = [
  {
    id: 1,
    title: "Arijit Singh Live in Concert",
    category: "Concert",
    date: "May 24, 2026",
    time: "7:00 PM",
    venue: "Mumbai Arena",
    city: "Mumbai",
    price: "₹2,499",
    image: "/concert-event.png",
    rating: 4.9,
    attendees: "12K+",
    badge: "Selling Fast",
    badgeColor: "bg-red-500/90",
    gradient: "from-purple-600/80 to-pink-600/80",
  },
  {
    id: 2,
    title: "IPL 2026 Final",
    category: "Sports",
    date: "May 31, 2026",
    time: "7:30 PM",
    venue: "Narendra Modi Stadium",
    city: "Ahmedabad",
    price: "₹3,999",
    image: "/sports-event.png",
    rating: 4.8,
    attendees: "50K+",
    badge: "Trending",
    badgeColor: "bg-amber-500/90",
    gradient: "from-blue-600/80 to-cyan-600/80",
  },
  {
    id: 3,
    title: "Sunburn Music Festival 2026",
    category: "Festival",
    date: "Jun 14–16, 2026",
    time: "4:00 PM",
    venue: "Vagator Beach Grounds",
    city: "Goa",
    price: "₹4,999",
    image: "/festival-event.png",
    rating: 4.7,
    attendees: "30K+",
    badge: "Featured",
    badgeColor: "bg-emerald-500/90",
    gradient: "from-orange-600/80 to-rose-600/80",
  },
]

const upcomingEvents = [
  {
    id: 4,
    title: "Coldplay: Music of the Spheres Tour",
    category: "Concert",
    date: "Jun 7, 2026",
    time: "6:30 PM",
    venue: "DY Patil Stadium",
    city: "Mumbai",
    price: "₹5,499",
    attendees: "45K+",
  },
  {
    id: 5,
    title: "Stand-up Comedy Night: Zakir Khan",
    category: "Comedy",
    date: "May 28, 2026",
    time: "8:00 PM",
    venue: "Phoenix Marketcity",
    city: "Bangalore",
    price: "₹999",
    attendees: "2K+",
  },
  {
    id: 6,
    title: "Indian Super League Final 2026",
    category: "Sports",
    date: "Jun 21, 2026",
    time: "7:00 PM",
    venue: "JLN Stadium",
    city: "Kochi",
    price: "₹1,499",
    attendees: "25K+",
  },
  {
    id: 7,
    title: "Dune: Part Three — Premiere",
    category: "Movie",
    date: "Jul 4, 2026",
    time: "9:00 PM",
    venue: "INOX IMAX",
    city: "Delhi",
    price: "₹799",
    attendees: "500+",
  },
  {
    id: 8,
    title: "Ed Sheeran: +-÷x India Tour",
    category: "Concert",
    date: "Jul 19, 2026",
    time: "7:00 PM",
    venue: "MMRDA Grounds",
    city: "Mumbai",
    price: "₹3,999",
    attendees: "35K+",
  },
  {
    id: 9,
    title: "Comic Con India 2026",
    category: "Festival",
    date: "Aug 2–4, 2026",
    time: "10:00 AM",
    venue: "NESCO Centre",
    city: "Mumbai",
    price: "₹1,299",
    attendees: "40K+",
  },
]

const categories = [
  { name: "All Events", icon: Sparkles, count: 24 },
  { name: "Concerts", icon: Music, count: 8 },
  { name: "Sports", icon: Trophy, count: 6 },
  { name: "Movies", icon: Film, count: 5 },
  { name: "Festivals", icon: Star, count: 5 },
]

function getCategoryIcon(category: string) {
  switch (category.toLowerCase()) {
    case "concert": return <Music className="h-3.5 w-3.5" />
    case "sports": return <Trophy className="h-3.5 w-3.5" />
    case "movie": return <Film className="h-3.5 w-3.5" />
    case "festival": return <Star className="h-3.5 w-3.5" />
    case "comedy": return <Sparkles className="h-3.5 w-3.5" />
    default: return <Ticket className="h-3.5 w-3.5" />
  }
}

function getCategoryColor(category: string) {
  switch (category.toLowerCase()) {
    case "concert": return "border-purple-500/30 text-purple-400 bg-purple-500/10"
    case "sports": return "border-blue-500/30 text-blue-400 bg-blue-500/10"
    case "movie": return "border-red-500/30 text-red-400 bg-red-500/10"
    case "festival": return "border-orange-500/30 text-orange-400 bg-orange-500/10"
    case "comedy": return "border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
    default: return "border-gray-500/30 text-gray-400 bg-gray-500/10"
  }
}

export default function EventsPage() {
  const [loading, setLoading] = useState(false)

  const handleBook = async (e: React.MouseEvent, event: any) => {
    e.preventDefault()
    e.stopPropagation()
    
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id || localStorage.getItem("user_id")

      if (!userId) {
        alert("Please login first to book a ticket.")
        window.location.href = "/login"
        return
      }

      const response = await fetch("http://localhost:8000/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: userId,
          booking_type: event.category.toLowerCase(),
          details: {
            event: event.title,
            venue: event.venue,
            city: event.city,
            date: event.date,
            time: event.time,
            price: event.price,
            tickets: 1
          },
          confirmation_id: "BOOK-" + Math.random().toString(36).substring(2, 10).toUpperCase()
        })
      })

      if (response.ok) {
        alert(`Successfully booked ticket for ${event.title}!`)
      } else {
        alert("Failed to book ticket. Please try again.")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred while booking. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-6 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-1.5 text-sm">
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            Discover Amazing Events
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Upcoming <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Events</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            From electrifying concerts to nail-biting sports finals — find and book tickets to the hottest events happening near you.
          </p>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat, i) => (
              <button
                key={cat.name}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  i === 0
                    ? "bg-white text-black border-white shadow-lg shadow-white/20"
                    : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <cat.icon className="h-4 w-4" />
                {cat.name}
                <span className={`text-xs px-2 py-0.5 rounded-full ${i === 0 ? 'bg-black/10' : 'bg-white/10'}`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Featured Events</h2>
              <p className="text-gray-500 mt-1">Hand-picked events you don't want to miss</p>
            </div>
            <Link href="/chat">
              <Button variant="outline" className="text-white border-white/10 bg-white/5 hover:bg-white/10 gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <div key={event.id} onClick={(e) => handleBook(e, event)} className="group cursor-pointer">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${event.gradient} opacity-60`} />
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`${event.badgeColor} text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm`}>
                        {event.badge}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-xs font-medium">{event.rating}</span>
                    </div>

                    {/* Price overlay */}
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-black/60 backdrop-blur-sm text-white font-bold text-lg px-4 py-1.5 rounded-xl border border-white/10">
                        {event.price}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={`${getCategoryColor(event.category)} border text-xs font-medium`}>
                        {getCategoryIcon(event.category)}
                        <span className="ml-1">{event.category}</span>
                      </Badge>
                    </div>

                    <h3 className="text-white text-lg font-semibold mb-3 group-hover:text-purple-300 transition-colors">
                      {event.title}
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{event.date}</span>
                        <span className="text-gray-600">•</span>
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{event.venue}, {event.city}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <Users className="h-4 w-4" />
                        <span>{event.attendees} attending</span>
                      </div>
                      <span className="text-purple-400 text-sm font-medium group-hover:text-purple-300 flex items-center gap-1">
                        Book Now <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events List */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">All Upcoming Events</h2>
              <p className="text-gray-500 mt-1">Browse through all scheduled events</p>
            </div>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={event.id} onClick={(e) => handleBook(e, event)} className="cursor-pointer">
                <div className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-5 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/5 mb-4">
                  {/* Date block */}
                  <div className="flex-shrink-0 flex md:flex-col items-center gap-2 md:gap-0 md:w-20 md:text-center">
                    <div className="text-purple-400 text-sm font-medium">{event.date.split(" ")[0]}</div>
                    <div className="text-white text-2xl font-bold">{event.date.split(" ")[1]?.replace(",", "")}</div>
                    <div className="text-gray-500 text-xs hidden md:block">{event.date.split(" ")[2]}</div>
                  </div>

                  {/* Divider */}
                  <div className="hidden md:block w-px h-12 bg-white/10" />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`${getCategoryColor(event.category)} border text-xs font-medium`}>
                        {getCategoryIcon(event.category)}
                        <span className="ml-1">{event.category}</span>
                      </Badge>
                    </div>
                    <h3 className="text-white font-semibold text-lg truncate group-hover:text-purple-300 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-gray-500 text-sm">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> {event.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" /> {event.venue}, {event.city}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" /> {event.attendees}
                      </span>
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-white font-bold text-lg">{event.price}</span>
                    <Button
                      size="sm"
                      className="bg-white text-black hover:bg-gray-100 hover:shadow-lg hover:shadow-white/20 gap-1.5 transition-all"
                    >
                      <Ticket className="h-4 w-4" />
                      Book
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 text-center py-16 px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Can't Find Your Event?
              </h2>
              <p className="text-gray-400 text-lg max-w-lg mx-auto mb-8">
                Use our AI-powered chat to search and book tickets for any event, concert, movie, or appointment instantly.
              </p>
              <Link href="/chat">
                <Button className="bg-white text-black hover:bg-gray-100 hover:shadow-2xl hover:shadow-white/20 px-8 py-6 text-lg font-semibold gap-2">
                  <Sparkles className="h-5 w-5" />
                  Book with AI Chat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
