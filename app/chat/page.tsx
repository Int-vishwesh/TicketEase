import ChatInterface from "@/components/chat-interface"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Header/>
      <br />
      <ChatInterface />
    </main>
  )
}
