import { NextResponse } from "next/server"

// This would connect to a real database in a production app
const bookings: Record<string, any> = {}

export async function POST(req: Request) {
  try {
    const bookingData = await req.json()

    // Generate a confirmation number
    const confirmationId = `BOOK-${generateRandomString(4)}-${generateRandomString(4)}`

    // Store the booking (in a real app, this would go to a database)
    bookings[confirmationId] = {
      ...bookingData,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      confirmationId,
      booking: bookings[confirmationId],
    })
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json({ success: false, error: "Failed to process booking" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get("id")

  if (id && bookings[id]) {
    return NextResponse.json({ booking: bookings[id] })
  }

  return NextResponse.json({ error: "Booking not found" }, { status: 404 })
}

function generateRandomString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

