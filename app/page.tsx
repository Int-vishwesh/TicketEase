
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col">
      <Header />
      <HeroSection />
      <Footer />
    </main>
  )
}


