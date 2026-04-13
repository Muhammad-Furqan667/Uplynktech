import { useSEO } from '../hooks/useSEO'
import Hero from '../components/Hero'
import Services from '../components/Services'
import About from '../components/About'
import WhyChooseUs from '../components/WhyChooseUs'
import Testimonials from '../components/Testimonials'
import ContactCTA from '../components/ContactCTA'

export default function Home() {
  useSEO({
    title: 'UPLYNK Tech - Digital Solutions & Enterprise Engineering',
    description: 'UPLYNK Tech delivers reliable digital infrastructure, from software engineering to artificial intelligence and creative growth strategies.',
    canonical: 'https://uplynktech.com',
    keywords: 'digital solutions, web development, app development, AI engineering, digital growth'
  })

  return (
    <>
      <Hero />
      <Services />
      <About />
      <WhyChooseUs />
      <Testimonials />
      <ContactCTA />
    </>
  )
}
