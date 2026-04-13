import { useEffect } from 'react'

export const useStructuredData = (data) => {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [data])
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'UPLYNK Tech',
  url: 'https://uplynktech.com',
  logo: 'https://uplynktech.com/logo.png',
  description: 'Empowering students with valuable skills and delivering reliable digital solutions',
  sameAs: [
    'https://www.facebook.com/uplynktech',
    'https://www.twitter.com/uplynktech',
    'https://www.linkedin.com/company/uplynktech'
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN'
  }
}

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'UPLYNK Tech',
  image: 'https://uplynktech.com/logo.png',
  description: 'Digital Solutions & Tech Training',
  url: 'https://uplynktech.com'
}
