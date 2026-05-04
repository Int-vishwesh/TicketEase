"use client"

import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, ArrowRight, Users, Phone, Globe, Clock, Calendar, Ticket, Building2, Music, Trophy, Sparkles, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Footer } from "@/components/footer"

const featuredVenues = [
  {
    id: 1,
    name: "Mumbai Arena",
    type: "Concert Hall",
    location: "Lower Parel, Mumbai",
    capacity: "15,000",
    rating: 4.9,
    reviews: 2340,
    image: "/concert-event.png",
    description: "Mumbai's premier indoor arena for world-class concerts and live performances. State-of-the-art acoustics and a vibrant atmosphere.",
    amenities: ["Premium Sound", "VIP Lounges", "F&B Courts", "Parking"],
    upcomingEvents: 8,
    gradient: "from-purple-600/70 to-indigo-600/70",
  },
  {
    id: 2,
    name: "Narendra Modi Stadium",
    type: "Sports Complex",
    location: "Motera, Ahmedabad",
    capacity: "132,000",
    rating: 4.8,
    reviews: 5620,
    image: "/sports-event.png",
    description: "The world's largest cricket stadium with cutting-edge facilities. Home to iconic sporting events and unforgettable moments.",
    amenities: ["Floodlights", "Corporate Boxes", "Multi-Sport", "Metro Access"],
    upcomingEvents: 5,
    gradient: "from-blue-600/70 to-cyan-600/70",
  },
  {
    id: 3,
    name: "Royal Opera House",
    type: "Heritage Theater",
    location: "Charni Road, Mumbai",
    capacity: "1,000",
    rating: 4.9,
    reviews: 1890,
    image: "/theater-venue.png",
    description: "India's only surviving opera house, restored to its baroque grandeur. Perfect for theatrical performances, music recitals, and cultural showcases.",
    amenities: ["Heritage Interior", "Acoustic Excellence", "Bar & Lounge", "Valet"],
    upcomingEvents: 12,
    gradient: "from-amber-600/70 to-red-600/70",
  },
]

const allVenues = [
  {
    id: 4,
    name: "DY Patil Stadium",
    type: "Multi-purpose",
    location: "Navi Mumbai, Maharashtra",
    capacity: "55,000",
    rating: 4.7,
    reviews: 3200,
    upcomingEvents: 6,
    phone: "+91 22 6789 0000",
    website: "dypatilstadium.com",
  },
  {
    id: 5,
    name: "NESCO Centre",
    type: "Exhibition Hall",
    location: "Goregaon, Mumbai",
    capacity: "25,000",
    rating: 4.5,
    reviews: 1560,
    upcomingEvents: 14,
    phone: "+91 22 6645 0000",
    website: "nescocentre.com",
  },
  {
    id: 6,
    name: "Jawaharlal Nehru Stadium",
    type: "Sports Arena",
    location: "Kaloor, Kochi",
    capacity: "42,000",
    rating: 4.6,
    reviews: 2100,
    upcomingEvents: 4,
    phone: "+91 484 235 0000",
    website: "jlnstadium.in",
  },
  {
    id: 7,
    name: "Phoenix Marketcity",
    type: "Event Space",
    location: "Whitefield, Bangalore",
    capacity: "3,000",
    rating: 4.4,
    reviews: 980,
    upcomingEvents: 9,
    phone: "+91 80 4646 0000",
    website: "phoenixmarketcity.com",
  },
  {
    id: 8,
    name: "INOX IMAX - Connaught Place",
    type: "Cinema",
    location: "CP, New Delhi",
    capacity: "600",
    rating: 4.8,
    reviews: 4500,
    upcomingEvents: 3,
    phone: "+91 11 4357 0000",
    website: "inoxmovies.com",
  },
  {
    id: 9,
    name: "MMRDA Grounds",
    type: "Open-Air",
    location: "BKC, Mumbai",
    capacity: "50,000+",
    rating: 4.6,
    reviews: 3800,
    upcomingEvents: 7,
    phone: "+91 22 2659 0000",
    website: "mmrdagrounds.com",
  },
]

const venueTypes = [
  { name: "All Venues", icon: Building2, count: 15 },
  { name: "Concert Halls", icon: Music, count: 4 },
  { name: "Sports Arenas", icon: Trophy, count: 5 },
  { name: "Theaters", icon: Sparkles, count: 3 },
  { name: "Open-Air", icon: Globe, count: 3 },
]

function getTypeColor(type: string) {
  const t = type.toLowerCase()
  if (t.includes("concert") || t.includes("hall")) return "border-purple-500/30 text-purple-400 bg-purple-500/10"
  if (t.includes("sport") || t.includes("stadium") || t.includes("multi")) return "border-blue-500/30 text-blue-400 bg-blue-500/10"
  if (t.includes("theater") || t.includes("heritage") || t.includes("opera")) return "border-amber-500/30 text-amber-400 bg-amber-500/10"
  if (t.includes("cinema")) return "border-red-500/30 text-red-400 bg-red-500/10"
  if (t.includes("open") || t.includes("ground")) return "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
  if (t.includes("exhibition") || t.includes("event")) return "border-cyan-500/30 text-cyan-400 bg-cyan-500/10"
  return "border-gray-500/30 text-gray-400 bg-gray-500/10"
}

export default function VenuesPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-1.5 text-sm">
            <Building2 className="h-3.5 w-3.5 mr-2" />
            Explore Top Venues
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Iconic <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Venues</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Discover the finest arenas, theaters, and event spaces. Every venue is handpicked for unforgettable experiences.
          </p>

          {/* Venue type pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {venueTypes.map((vt, i) => (
              <button
                key={vt.name}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  i === 0
                    ? "bg-white text-black border-white shadow-lg shadow-white/20"
                    : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <vt.icon className="h-4 w-4" />
                {vt.name}
                <span className={`text-xs px-2 py-0.5 rounded-full ${i === 0 ? 'bg-black/10' : 'bg-white/10'}`}>
                  {vt.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Venues", value: "50+", icon: Building2 },
              { label: "Cities", value: "12", icon: MapPin },
              { label: "Events Hosted", value: "1,200+", icon: Calendar },
              { label: "Happy Visitors", value: "5M+", icon: Users },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-5 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
                <stat.icon className="h-5 w-5 text-gray-500 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Featured Venues</h2>
              <p className="text-gray-500 mt-1">Premium spaces with world-class facilities</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredVenues.map((venue) => (
              <div key={venue.id} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${venue.gradient}`} />

                  {/* Rating */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-xs font-medium">{venue.rating}</span>
                    <span className="text-gray-300 text-xs">({venue.reviews.toLocaleString()})</span>
                  </div>

                  {/* Capacity */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Users className="h-3.5 w-3.5 text-white" />
                    <span className="text-white text-xs font-medium">{venue.capacity} capacity</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <Badge className={`${getTypeColor(venue.type)} border text-xs font-medium mb-3`}>
                    {venue.type}
                  </Badge>

                  <h3 className="text-white text-lg font-semibold mb-1.5 group-hover:text-blue-300 transition-colors">
                    {venue.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{venue.location}</span>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {venue.description}
                  </p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {venue.amenities.map((amenity) => (
                      <span key={amenity} className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5">
                        {amenity}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{venue.upcomingEvents} upcoming events</span>
                    </div>
                    <Link href="/events" className="text-blue-400 text-sm font-medium group-hover:text-blue-300 flex items-center gap-1">
                      Explore <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Venues Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">All Venues</h2>
              <p className="text-gray-500 mt-1">Complete directory of partner venues</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allVenues.map((venue) => (
              <div key={venue.id} className="group p-5 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:shadow-lg hover:shadow-blue-500/5">
                <div className="flex items-start justify-between mb-3">
                  <Badge className={`${getTypeColor(venue.type)} border text-xs font-medium`}>
                    {venue.type}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-xs font-medium">{venue.rating}</span>
                    <span className="text-gray-500 text-xs">({venue.reviews.toLocaleString()})</span>
                  </div>
                </div>

                <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-blue-300 transition-colors">
                  {venue.name}
                </h3>

                <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{venue.location}</span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Users className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                    <span>Capacity: {venue.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Phone className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                    <span>{venue.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Globe className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                    <span>{venue.website}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <Ticket className="h-3.5 w-3.5" />
                    {venue.upcomingEvents} events
                  </span>
                  <Link href="/events" className="text-blue-400 text-sm font-medium hover:text-blue-300 flex items-center gap-1 transition-colors">
                    View Events <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between py-12 px-8 md:px-12 gap-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  Ready to Experience Live?
                </h2>
                <p className="text-gray-400 text-lg max-w-lg">
                  Browse upcoming events at any of our partner venues and secure your tickets with our AI-powered booking assistant.
                </p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <Link href="/events">
                  <Button variant="outline" className="text-white border-white/20 bg-white/5 hover:bg-white/10 px-6 py-5 text-base gap-2">
                    <Calendar className="h-4 w-4" />
                    Browse Events
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button className="bg-white text-black hover:bg-gray-100 hover:shadow-2xl hover:shadow-white/20 px-6 py-5 text-base font-semibold gap-2">
                    <Sparkles className="h-4 w-4" />
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
