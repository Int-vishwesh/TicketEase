"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const teamMembers = [
    {
      name: "Anikesh Sharma",
      role: "Btech CSE ",
      image: "person-placeholder.jpg",
      email: "rahul@ticketease.com",
      github: "https://github.com/rahulsharma",
      linkedin: "https://linkedin.com/in/rahulsharma"
    },
    {
      name: "Vishwesh Aryan",
      role: "Btech CSE ",
      image: "person-placeholder.jpg",
      email: "jerryaryan123@gmail.com.com",
      github: "https://github.com/int-vishwesh",
      linkedin: "https://linkedin.com/in/vishwesh-aryan-"
    },
    {
      name: "Vishesh",
      role: "Btech CSE ",
      image: "person-placeholder.jpg",
      email: "arjun@gmail.com",
      github: "https://github.com/arjunsingh",
      linkedin: "https://linkedin.com/in/arjunsingh"
    },
    {
      name: "Vivek Bhat",
      role: "Btech CSE ",
      image: "person-placeholder.jpg",
      email: "neha@ticketease.com",
      github: "https://github.com/nehagupta",
      linkedin: "https://linkedin.com/in/nehagupta"
    }
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto p-8 pt-24">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Our Team</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet the people behind TicketEase. Feel free to reach out to us directly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {teamMembers.map((member, index) => (
            <Card key={index} className="bg-white border border-gray-200 overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center gap-3 pt-0 pb-4">
                <Link href={member.github} target="_blank">
                  <Button variant="ghost" size="icon" aria-label="GitHub">
                    <Github className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href={member.linkedin} target="_blank">
                  <Button variant="ghost" size="icon" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href={`mailto:${member.email}`}>
                  <Button variant="ghost" size="icon" aria-label="Email">
                    <Mail className="h-5 w-5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="max-w-lg mx-auto text-center mb-16 p-6 bg-white rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <p className="mb-2">
            <span className="font-medium">Email:</span> support@ticketease.com
          </p>
          <p className="mb-2">
            <span className="font-medium">Address:</span> Tech Park, Sector 62, Chandigarh, India 160062
          </p>
          <p>
            <span className="font-medium">Hours:</span> Monday - Friday: 9:00 AM - 6:00 PM IST
          </p>
          <p>
            our 3rd year 6th sem project demonstration
          </p>
        </div>

        <div className="text-center py-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} TicketEase. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  )
}