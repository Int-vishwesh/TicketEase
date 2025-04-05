import { NextResponse } from "next/server"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// System prompt for fallback client-side processing
const SYSTEM_PROMPT = `
You are a helpful ticket booking assistant that helps users book tickets for various events and appointments.
You can handle bookings for:
1. Doctor appointments
2. Amusement park tickets
3. Movie tickets
4. Concert tickets
5. Sports events
6. And other similar bookings

For each booking request:
1. Collect all necessary information (date, time, number of tickets, preferences, etc.)
2. Confirm the details with the user
3. Process the booking and provide a confirmation number

If the user doesn't specify what type of booking they want, ask them politely.
Always be helpful, friendly, and concise in your responses.

When a booking is confirmed, generate a fake confirmation number in the format: BOOK-XXXX-XXXX where X is an alphanumeric character.
`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Try to forward the request to our FastAPI backend
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Check if the response is ok
      if (response.ok) {
        // Return the response from FastAPI as a stream
        return new Response(response.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        })
      }
    } catch (error) {
      console.warn("FastAPI backend not available, using fallback:", error)
      // Continue to fallback
    }

    // Fallback: Process the request client-side
    // This simulates a streaming response when the backend is unavailable
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        // Add system message if not present
        if (messages[0]?.role !== "system") {
          messages.unshift({ role: "system", content: SYSTEM_PROMPT })
        }

        // Generate a simple response based on the last user message
        const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || ""

        // Simple response generation logic
        let response = ""
        if (lastUserMessage.toLowerCase().includes("doctor") || lastUserMessage.toLowerCase().includes("appointment")) {
          response =
            "I'd be happy to help you book a doctor's appointment. Could you please provide the following details:\n\n1. What type of doctor do you need to see?\n2. What's your preferred date for the appointment?\n3. Do you have a preferred time of day?\n4. Do you have any specific doctor in mind?"
        } else if (
          lastUserMessage.toLowerCase().includes("amusement") ||
          lastUserMessage.toLowerCase().includes("park")
        ) {
          response =
            "I'd be happy to help you book amusement park tickets. Could you please provide the following details:\n\n1. Which amusement park would you like to visit?\n2. What date are you planning to go?\n3. How many tickets do you need?\n4. Are you interested in any special passes or packages?"
        } else if (
          lastUserMessage.toLowerCase().includes("movie") ||
          lastUserMessage.toLowerCase().includes("cinema")
        ) {
          response =
            "I'd be happy to help you book movie tickets. Could you please provide the following details:\n\n1. Which movie would you like to see?\n2. What date would you like to go?\n3. Do you have a preferred time?\n4. How many tickets do you need?\n5. Do you have a preferred cinema location?"
        } else if (lastUserMessage.toLowerCase().includes("concert")) {
          response =
            "I'd be happy to help you book concert tickets. Could you please provide the following details:\n\n1. Which artist or concert are you interested in?\n2. Do you know the date of the concert?\n3. How many tickets would you like to purchase?\n4. Do you have any seating preferences?"
        } else if (lastUserMessage.toLowerCase().includes("book")) {
          response =
            "I'd be happy to help you with your booking. Could you please specify what type of booking you're interested in? I can help with doctor appointments, amusement park tickets, movie tickets, concert tickets, and more."
        } else {
          response =
            "Hello! I'm your ticket booking assistant. I can help you book tickets for various events and services including:\n\n- Doctor appointments\n- Amusement park tickets\n- Movie tickets\n- Concert tickets\n- Sports events\n\nWhat type of booking would you like to make today?"
        }

        // Stream the response character by character to simulate streaming
        for (let i = 0; i < response.length; i++) {
          const char = response[i]
          const data = {
            type: "text",
            value: char,
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
          // Add a small delay between characters
          await new Promise((resolve) => setTimeout(resolve, 10))
        }

        // End of stream marker
        controller.enqueue(encoder.encode("data: [DONE]\n\n"))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Error processing chat request:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}

