import { useSEO } from '../hooks/useSEO'
import Hero from '../components/Hero'
import Services from '../components/Services'
import ContactCTA from '../components/ContactCTA'

export default function Home() {
  useSEO({
    title: 'UPLYNK Tech - Custom Web, App & AI Solutions for Business',
    description: 'Grow your business with UPLYNK. We provide premium Web Development, App Development, Graphic Design, Social Media Marketing, and AI Services.',
    canonical: 'https://uplynktech.com',
    keywords: 'b2b digital agency, web development, app development, social media marketing, graphic design, ai services'
  })

  return (
    <>
      <Hero />
      <Services />
      <ContactCTA />
    </>
  )
}
