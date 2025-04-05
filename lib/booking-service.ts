// This service would handle the actual booking logic in a real application
// For now, it's a simple implementation that calls our API

export type BookingType = "doctor" | "amusement" | "movie" | "concert" | "sports" | "other"

export interface BookingDetails {
  type: BookingType
  date: string
  time?: string
  quantity?: number
  name: string
  email: string
  phone?: string
  additionalInfo?: Record<string, any>
}

export async function createBooking(details: BookingDetails): Promise<{ confirmationId: string }> {
  try {
    const response = await fetch("/api/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    })

    if (!response.ok) {
      throw new Error("Failed to create booking")
    }

    const data = await response.json()
    return { confirmationId: data.confirmationId }
  } catch (error) {
    console.error("Error creating booking:", error)
    throw error
  }
}

export async function getBooking(confirmationId: string): Promise<BookingDetails | null> {
  try {
    const response = await fetch(`/api/book?id=${confirmationId}`)

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.booking
  } catch (error) {
    console.error("Error fetching booking:", error)
    return null
  }
}

