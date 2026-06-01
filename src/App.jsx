import { QuoteProvider } from './components/quote/QuoteContext.jsx'
import ScrollPath from './components/ScrollPath.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import SavingsTicker from './components/SavingsTicker.jsx'
import Coverage from './components/Coverage.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Stats from './components/Stats.jsx'
import Carriers from './components/Carriers.jsx'
import Testimonials from './components/Testimonials.jsx'
import FinalCTA from './components/FinalCTA.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <QuoteProvider>
      <Navbar />
      <div className="relative">
        <ScrollPath />
        <main>
          <Hero />
          <SavingsTicker />
          <Coverage />
          <HowItWorks />
          <Stats />
          <Carriers />
          <Testimonials />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </QuoteProvider>
  )
}
