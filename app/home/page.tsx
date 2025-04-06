import ChatInterface from "@/components/chat-interface"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Header/>
      <br />
      <ChatInterface />
    </main>
  )
}
