"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Ticket, Clock, Users, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface Booking {
  id: string
  type: string
  details: {
    [key: string]: any
  }
  confirmationId?: string
  confirmation_id?: string
  date?: string
  created_at?: string
  status: string
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load bookings from API
    const loadBookings = async () => {
      try {
        // Get user ID from Supabase
        const { supabase } = await import("@/lib/supabase")
        const { data: { session } } = await supabase.auth.getSession()

        const userId = session?.user?.id || localStorage.getItem("user_id")

        if (!userId) {
          console.log("No user ID found")
          setLoading(false)
          return
        }

        const response = await fetch(`http://localhost:8000/bookings/${userId}`)
        if (response.ok) {
          const data = await response.json()
          setBookings(data)
        } else {
          console.error("Failed to fetch bookings")
        }
        setLoading(false)
      } catch (error) {
        console.error("Error loading bookings:", error)
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date unavailable"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  // Helper function to get icon based on booking type
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'concert':
        return <Ticket className="h-5 w-5" />
      case 'doctor':
        return <AlertCircle className="h-5 w-5" />
      case 'movie':
        return <Users className="h-5 w-5" />
      case 'sports':
        return <Users className="h-5 w-5" />
      default:
        return <Calendar className="h-5 w-5" />
    }
  }

  // Helper function to get color based on booking type
  const getTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'concert':
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case 'doctor':
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case 'movie':
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case 'sports':
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  // Get booking details as formatted text
  const getBookingDetails = (booking: Booking) => {
    const { type, details } = booking

    switch (type.toLowerCase()) {
      case 'concert':
        return `${details.artist || 'Artist'} at ${details.venue || 'Venue'} - ${details.tickets || '0'} ticket(s)`
      case 'doctor':
        return `${details.doctor || 'Doctor'} (${details.speciality || 'Specialist'}) at ${details.clinic || 'Clinic'}`
      case 'movie':
        return `${details.movie || 'Movie'} at ${details.cinema || 'Cinema'} - ${details.tickets || '0'} ticket(s)`
      case 'sports':
        return `${details.event || 'Event'} at ${details.venue || 'Venue'} - ${details.tickets || '0'} ticket(s)`
      default:
        return Object.entries(details || {})
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ')
    }
  }

  return (
    <main className="min-h-screen p-8 pt-24 bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Booking Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all your ticket bookings in one place
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Bookings</h2>
          <Link href="/chat">
            <Button variant="outline">New Booking</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : bookings.length === 0 ? (
          <Card className="bg-white border border-gray-200">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No bookings found</h3>
              <p className="text-muted-foreground text-center mb-6">
                You haven't made any bookings yet. Start by booking a ticket for an event or appointment.
              </p>
              <Link href="/chat">
                <Button>Book a Ticket</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="bg-white border border-gray-200">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(booking.type)}
                      <CardTitle className="text-lg capitalize">{booking.type} Booking</CardTitle>
                    </div>
                    <Badge className={getTypeBadgeColor(booking.type)}>
                      {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(booking.date || booking.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-2">
                    {getBookingDetails(booking)}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                    <span className="font-medium">Confirmation:</span>
                    <span className="bg-gray-100 px-2 py-1 rounded font-mono">
                      {booking.confirmationId || booking.confirmation_id}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-end gap-2">
                  <Button variant="ghost" size="sm">Download</Button>
                  <Button variant="outline" size="sm">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}