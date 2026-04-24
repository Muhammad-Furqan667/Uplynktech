import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import '../styles/components/Testimonials.css'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      author: 'Muhammad Bilal',
      quote: 'Brother, UPLYNK did magic. My work was very slow, but they put AI and now it\'s super fast. MashAllah!',
      title: 'Owner',
      company: 'Bilal Textile'
    },
    {
      id: 2,
      author: 'Syed Ahmed Shah',
      quote: 'Best team ever! They fixed my cloud and now no tension of website down. Heart is very happy!',
      title: 'CEO',
      company: 'Shah Tech Solutions'
    },
    {
      id: 3,
      author: 'Muneeb Kala',
      quote: 'Yaar, their engineering is next level. They build it like it\'s their own work. Strongly recommend!',
      title: 'Manager',
      company: 'Kala & Co.'
    }
  ])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Database fetching is disabled to use local Pakistani-style testimonials as requested.
    /*
    async function fetchTestimonials() {
      try {
        const { data, error } = await supabase
          .from('display_reviews')
          .select('*')
          .eq('is_featured', true)
          .order('created_at', { ascending: false })

        if (error) throw error
        setTestimonials(data || [])
      } catch (err) {
        console.error('Error fetching testimonials:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
    */

    // Realtime subscription
    /*
    const channel = supabase
      .channel('public:display_reviews')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'display_reviews' }, (payload) => {
        fetchTestimonials()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    */
  }, [])

  // Animation logic
  useEffect(() => {
    if (loading) return

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active')
        }
      })
    }, observerOptions)

    const cards = document.querySelectorAll('.testimonial-card')
    cards.forEach(card => observer.observe(card))

    return () => observer.disconnect()
  }, [loading, testimonials])

  if (loading && testimonials.length === 0) {
    return null // or a skeleton loader
  }

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section className="testimonials">
      <div className="testimonials-container">
        
        <div className="testimonials-header">
          <p className="testimonials-eyebrow">Logon Ki Baat</p>
          <h2 className="testimonials-heading">Barey Brands Ka Bharosa</h2>
          <p className="testimonials-subtitle">
            Don't just believe us, see what our local brothers and big companies say about our work. 
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((item, index) => (
            <div 
              key={item.id} 
              className="testimonial-card reveal-item"
            >
              <div className="quote-mark">"</div>
              <p className="testimonial-quote">
                {item.quote}
              </p>
              <div className="testimonial-author-block">
                <div className="testimonial-avatar">
                  {item.author.charAt(0)}
                </div>
                <div className="testimonial-meta">
                  <h4 className="testimonial-name">{item.author}</h4>
                  <p className="testimonial-title">{item.title}{item.company ? `, ${item.company}` : ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
