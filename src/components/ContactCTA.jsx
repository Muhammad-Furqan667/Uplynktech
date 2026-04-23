import { FiArrowRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import '../styles/components/ContactCTA.css'

export default function ContactCTA() {
  const navigate = useNavigate()

  const handleStartConversation = () => {
    navigate('/consultation')
  }

  return (
    <section className="contact-cta">
      <div className="cta-content">
        <h2 className="cta-massive-heading">Have a bold project<br/>in mind?</h2>
        <div className="cta-action-row">
          <p className="cta-subtext">
            Partner with our world-class engineering and creative teams to build solutions that scale.
          </p>
          <button className="cta-trigger-btn" onClick={handleStartConversation}>
            Start a Conversation
            <FiArrowRight className="button-arrow" />
          </button>
        </div>
      </div>

    </section>
  )
}
