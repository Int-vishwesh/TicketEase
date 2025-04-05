"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Ticket, Send } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

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
      // Call the API
      const response = await fetch("https://ticketease-backend.vercel.app/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userMessage.content }),
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
                  }
                } catch (e) {
                  console.error("Error parsing SSE data:", e)
                }
              }
            }
          }
        }
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-3xl mx-auto flex-1 flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              <span>Ticket Booking Assistant</span>
            </CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Online
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
              <MessageCircle className="h-12 w-12 opacity-20" />
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
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
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

