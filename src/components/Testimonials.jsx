import './Testimonials.css'

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      quote: "UPLYNK didn't just build our internal platform; they overhauled our entire cloud architecture. Their unified engineering team acts like a true extension of our own.",
      author: "Marcus Vance",
      title: "Chief Technology Officer",
      company: "Aether Dynamics"
    },
    {
      id: 2,
      quote: "We were burning cash on inefficient operational workflows. UPLYNK integrated a custom LLM solution that instantly automated 40% of our tier-1 support.",
      author: "Elena Rostova",
      title: "VP of Operations",
      company: "Nexus Medical Systems"
    },
    {
      id: 3,
      quote: "The rigor and pure technical talent UPLYNK brings is unmatched. Their academy pipeline ensures they always have the sharpest minds executing our mission-critical sprints.",
      author: "Julian Wright",
      title: "Director of Engineering",
      company: "FinTech Global"
    }
  ]

  return (
    <section className="testimonials">
      <div className="testimonials-container">
        
        <div className="testimonials-header">
          <p className="testimonials-eyebrow">Social Proof</p>
          <h2 className="testimonials-heading">Trusted by Industry Leaders</h2>
          <p className="testimonials-subtitle">
            Don't just take our word for it. Hear from the enterprise partners who trust us with their digital infrastructure.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((item, index) => (
            <div 
              key={item.id} 
              className="testimonial-card"
              style={{ animationDelay: `${index * 0.2}s` }}
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
                  <p className="testimonial-title">{item.title}, {item.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
