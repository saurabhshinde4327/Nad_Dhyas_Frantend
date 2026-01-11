import Header from './components/Header'
import HeroVideo from './components/HeroVideo'
import Hero from './components/Hero'
import Courses from './components/Courses'
import PerformanceOpportunities from './components/PerformanceOpportunities'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header transparent={true} />
      <HeroVideo />
      <Hero />
      <Courses />
      <PerformanceOpportunities />
      <Footer />
    </main>
  )
}

