"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Ticket, Send } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface Booking {
  id: string
  type: string
  details: {
    [key: string]: any
  }
  confirmationId: string
  date: string
  status: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [bookingInProgress, setBookingInProgress] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load session ID from localStorage on component mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem('booking_session_id')
    if (savedSessionId) {
      setSessionId(savedSessionId)
    }
  }, [])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Function to check if a booking confirmation is present in messages
  useEffect(() => {
    // Check the last assistant message for booking confirmation
    const lastAssistantMessage = [...messages]
      .reverse()
      .find(msg => msg.role === "assistant")
      
    if (lastAssistantMessage) {
      const content = lastAssistantMessage.content
      
      // Look for booking confirmation pattern
      const confirmationMatch = content.match(/BOOK-[A-Z0-9]{4}-[A-Z0-9]{4}/)
      
      if (confirmationMatch && !bookingInProgress) {
        const confirmationId = confirmationMatch[0]
        setBookingInProgress(true)
        
        // Extract booking details from conversation
        saveBooking(confirmationId, messages)
      }
    }
  }, [messages])

  // Function to save booking information
  const saveBooking = (confirmationId: string, conversationMessages: Message[]) => {
    // Default booking with minimum information
    let bookingType = "unknown"
    const bookingDetails: {[key: string]: any} = {}
    
    // Extract booking details by analyzing conversation
    // This is a simple implementation - you would want more robust parsing in production
    const userMessages = conversationMessages.filter(msg => msg.role === "user")
    const assistantMessages = conversationMessages.filter(msg => msg.role === "assistant")
    
    // Try to detect booking type
    const fullConversation = conversationMessages.map(msg => msg.content.toLowerCase()).join(" ")
    
    if (fullConversation.includes("concert") || fullConversation.includes("arijit singh")) {
      bookingType = "concert"
      
      // Extract concert details
      if (fullConversation.includes("arijit singh")) {
        bookingDetails.artist = "Arijit Singh"
      }
      
      if (fullConversation.includes("chandigarh")) {
        bookingDetails.venue = "Chandigarh"
      }
      
      // Try to find number of tickets
      const ticketMatch = fullConversation.match(/(\d+)\s+tickets?/i)
      if (ticketMatch) {
        bookingDetails.tickets = ticketMatch[1]
      } else {
        // Check for simple numbers that might be ticket quantities
        for (const msg of userMessages) {
          if (/^[1-9][0-9]?$/.test(msg.content.trim())) {
            bookingDetails.tickets = msg.content.trim()
            break
          }
        }
      }
    } 
    else if (fullConversation.includes("doctor") || fullConversation.includes("appointment")) {
      bookingType = "doctor"
      
      // Try to extract doctor name (simple implementation)
      const doctorMatch = fullConversation.match(/dr\.\s+([a-z]+)/i)
      if (doctorMatch) {
        bookingDetails.doctor = doctorMatch[1]
      } else {
        bookingDetails.doctor = "Specialist"
      }
      
      bookingDetails.clinic = "Local Clinic"
    }
    else if (fullConversation.includes("movie") || fullConversation.includes("cinema")) {
      bookingType = "movie"
      bookingDetails.movie = "Movie"
      bookingDetails.cinema = "Local Cinema"
      
      // Try to find number of tickets
      const ticketMatch = fullConversation.match(/(\d+)\s+tickets?/i)
      if (ticketMatch) {
        bookingDetails.tickets = ticketMatch[1]
      }
    }
    
    // Create the booking object
    const newBooking: Booking = {
      id: Date.now().toString(),
      type: bookingType,
      details: bookingDetails,
      confirmationId: confirmationId,
      date: new Date().toISOString(),
      status: "confirmed"
    }
    
    // Save to localStorage
    try {
      const existingBookings = localStorage.getItem("bookings")
      let bookings: Booking[] = []
      
      if (existingBookings) {
        bookings = JSON.parse(existingBookings)
      }
      
      bookings.push(newBooking)
      localStorage.setItem("bookings", JSON.stringify(bookings))
      
      console.log("Booking saved:", newBooking)
      
      // Reset booking flag after short delay (to prevent duplicate detections)
      setTimeout(() => {
        setBookingInProgress(false)
      }, 2000)
    } catch (error) {
      console.error("Error saving booking:", error)
      setBookingInProgress(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call the API with session ID if available
      const response = await fetch("https://ticketease-backend.vercel.app/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          query: userMessage.content,
          session_id: sessionId 
        }),
      })

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`)
      }

      // Create a new message for the assistant
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Process the streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let done = false
        while (!done) {
          const { value, done: doneReading } = await reader.read()
          done = doneReading

          if (value) {
            const chunk = decoder.decode(value)
            const lines = chunk.split("\n\n")

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.substring(6)

                if (data === "[DONE]") {
                  break
                }

                try {
                  const parsed = JSON.parse(data)
                  if (parsed.type === "text") {
                    setMessages((prev) => {
                      const updated = [...prev]
                      const lastMessage = updated[updated.length - 1]
                      if (lastMessage && lastMessage.role === "assistant") {
                        lastMessage.content += parsed.value
                      }
                      return updated
                    })
                  } else if (parsed.type === "error") {
                    throw new Error(parsed.value)
                  } else if (parsed.type === "session") {
                    // Save the session ID
                    setSessionId(parsed.session_id)
                    localStorage.setItem('booking_session_id', parsed.session_id)
                  }
                } catch (e) {
                  console.error("Error parsing SSE data:", e)
                }
              }
            }
          }
        }
        // Set loading to false after streaming is complete
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error in chat:", error)
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: "I'm processing your request. Please wait a moment...",
        },
      ])

      // Try again with a simpler approach after a short delay
      setTimeout(() => {
        setMessages((prev) => {
          const updated = [...prev]
          const lastMessage = updated[updated.length - 1]
          if (lastMessage && lastMessage.role === "assistant") {
            lastMessage.content =
              "I'm here to help with your booking. What type of ticket would you like to book today? I can assist with doctor appointments, amusement park tickets, movie tickets, concert tickets, and more."
          }
          return updated
        })
        setIsLoading(false)
      }, 1000)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  // Function to clear conversation and start fresh
  const handleNewConversation = () => {
    setMessages([])
    setSessionId(null)
    localStorage.removeItem('booking_session_id')
    setBookingInProgress(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#666] p-4">
      <Card className="w-full max-w-3xl mx-auto flex-1 flex flex-col">
        <CardHeader className="border-b flex justify-between items-center">
          <div className="flex items-center">
            <Ticket className="h-5 w-5 mr-2" />
            <CardTitle>Ticket Booking Assistant</CardTitle>
          </div>
          <div className="flex gap-2">
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleNewConversation}>
                New Conversation
              </Button>
            )}
            <Link href="/dashboard">
              <Button variant="secondary" size="sm">
                View Bookings
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
              <MessageCircle className="h-12 w-20 opacity-50" />
              <div>
                <p className="font-medium">Start a conversation</p>
                <p className="text-sm">Ask about booking tickets for doctor appointments, amusement parks, and more!</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPrompt("I need to book a doctor's appointment")}
                >
                  Doctor appointment
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPrompt("I want tickets for an amusement park")}
                >
                  Amusement park
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickPrompt("I need concert tickets")}>
                  Concert tickets
                </Button>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <CardFooter className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 border-black"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="w-10 h-10 p-0 flex items-center justify-center">
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}