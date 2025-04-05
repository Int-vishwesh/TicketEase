"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { type BookingDetails, type BookingType, createBooking } from "@/lib/booking-service"

interface BookingFormProps {
  bookingType: BookingType
  onComplete: (confirmationId: string) => void
  onCancel: () => void
}

export function BookingForm({ bookingType, onComplete, onCancel }: BookingFormProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    time: "",
    quantity: 1,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) return

    setIsSubmitting(true)

    try {
      const bookingDetails: BookingDetails = {
        type: bookingType,
        date: format(date, "yyyy-MM-dd"),
        time: formData.time,
        quantity: Number.parseInt(formData.quantity.toString()),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      }

      const { confirmationId } = await createBooking(bookingDetails)
      onComplete(confirmationId)
    } catch (error) {
      console.error("Error submitting booking:", error)
      // Handle error
    } finally {
      setIsSubmitting(false)
    }
  }

  const getBookingTypeTitle = () => {
    switch (bookingType) {
      case "doctor":
        return "Doctor Appointment"
      case "amusement":
        return "Amusement Park Tickets"
      case "movie":
        return "Movie Tickets"
      case "concert":
        return "Concert Tickets"
      case "sports":
        return "Sports Event Tickets"
      default:
        return "Booking"
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{getBookingTypeTitle()}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {bookingType !== "doctor" && (
            <div className="space-y-2">
              <Label htmlFor="quantity">Number of Tickets</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {(bookingType === "doctor" || bookingType === "movie" || bookingType === "concert") && (
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !date}>
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

