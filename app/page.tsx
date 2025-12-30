import Header from './components/Header'
import ImageCarousel from './components/ImageCarousel'
import Hero from './components/Hero'
import Courses from './components/Courses'
import PerformanceOpportunities from './components/PerformanceOpportunities'
import GuestOfHonour from './components/GuestOfHonour'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <ImageCarousel />
      <Hero />
      <Courses />
      <PerformanceOpportunities />
      <GuestOfHonour />
      <Testimonials />
      <Footer />
    </main>
  )
}

