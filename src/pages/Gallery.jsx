import { useSEO } from '../hooks/useSEO'
import { FiCalendar, FiClock, FiMapPin, FiExternalLink, FiArchive } from 'react-icons/fi'
import '../styles/Gallery.css'

export default function Gallery() {
  useSEO({
    title: 'Events & Strategic Insights - UPLYNK Tech',
    description: 'Join the UPLYNK ecosystem for high-rigor engineering workshops, AI summits, and technical community keynotes.',
    canonical: 'https://uplynktech.com/gallery',
    keywords: 'tech conferences, ai workshops, react bootcamp, engineering webinars'
  })

  // Get today's date (April 4, 2026)
  const today = new Date(2026, 3, 4)

  const events = [
    {
      id: 1,
      title: 'Global AI & Data Modernization Summit',
      date: 'May 18, 2026',
      dateObj: new Date(2026, 4, 18),
      time: '09:00 - 17:00',
      location: 'Innovation Center / Hybrid',
      category: 'Strategic Keynote',
      description: 'A deep-dive into LLM infrastructure and the future of enterprise-ready AI architecture.',
      image: 'https://via.placeholder.com/600x400?text=AI+Summit'
    },
    {
      id: 2,
      title: 'Full-Stack Resilience Bootcamp',
      date: 'April 20, 2026',
      dateObj: new Date(2026, 3, 20),
      time: '10:00 - 16:00',
      location: 'UPLYNK Engineering Lab',
      category: 'Engineering Lab',
      description: 'Intensive 5-day session on building high-availability systems with modern cloud-native tools.',
      image: 'https://via.placeholder.com/600x400?text=Eng+Bootcamp'
    },
    {
      id: 3,
      title: 'Post-Quantum Security Seminar',
      date: 'March 15, 2026',
      dateObj: new Date(2026, 2, 15),
      time: '14:00 - 17:00',
      location: 'Webinar / Global Access',
      category: 'Archived Insight',
      description: 'Detailed analysis of cybersecurity shifts in a post-quantum world. (Session Recording Available)',
      image: 'https://via.placeholder.com/600x400?text=Cyber+Archive'
    },
    {
      id: 4,
      title: 'React Fundamentals Executive Workshop',
      date: 'February 28, 2026',
      dateObj: new Date(2026, 1, 28),
      time: '10:00 - 14:00',
      location: 'Tech Hub, Downtown',
      category: 'Archived Insight',
      description: 'Introduction to React ecosystems for technical managers and lead engineers.',
      image: 'https://via.placeholder.com/600x400?text=React+Archive'
    }
  ]

  const pastEvents = events.filter(e => e.dateObj < today)
  const upcomingEvents = events.filter(e => e.dateObj >= today)

  return (
    <section className="gallery-page">
      <div className="gallery-hero">
        <div className="hero-inner">
          <p className="gallery-eyebrow">Community & Knowledge</p>
          <h1 className="gallery-title">Events & Strategic Insights.</h1>
          <p className="gallery-subtitle">
            We forge connections between high-caliber engineers and the future of digital architecture. Join our next session.
          </p>
        </div>
      </div>

      <div className="gallery-container">
        
        {/* Upcoming Section */}
        {upcomingEvents.length > 0 && (
          <div className="timeline-section">
            <h2 className="timeline-headline">Upcoming Strategic Sessions</h2>
            <div className="elite-event-grid">
              {upcomingEvents.map((event, idx) => (
                <div key={event.id} className="elite-event-card active" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="event-visual">
                    <img src={event.image} alt={event.title} />
                    <span className="event-type-badge">{event.category}</span>
                  </div>
                  <div className="event-body">
                    <h3 className="event-name">{event.title}</h3>
                    <p className="event-excerpt">{event.description}</p>
                    
                    <div className="event-metas">
                      <div className="meta-row">
                        <FiCalendar className="meta-icon" /> <span>{event.date}</span>
                      </div>
                      <div className="meta-row">
                        <FiClock className="meta-icon" /> <span>{event.time}</span>
                      </div>
                      <div className="meta-row">
                        <FiMapPin className="meta-icon" /> <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <button className="event-btn">
                      Secure Seat <FiExternalLink />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Archived Section */}
        {pastEvents.length > 0 && (
          <div className="timeline-section archive">
            <div className="archive-header">
              <h2 className="timeline-headline">The Insights Archive</h2>
              <p className="archive-note">Past sessions available for on-demand review.</p>
            </div>
            <div className="elite-event-grid mini">
              {pastEvents.map((event) => (
                <div key={event.id} className="elite-event-card archived">
                  <div className="archived-body">
                    <div className="archived-top">
                      <span className="archived-date">{event.date}</span>
                      <FiArchive className="archived-icon" />
                    </div>
                    <h3 className="archived-name">{event.title}</h3>
                    <p className="archived-excerpt">{event.description}</p>
                    <button className="view-archive-btn">View Recording</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
