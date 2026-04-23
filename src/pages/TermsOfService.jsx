import { useSEO } from '../hooks/useSEO'
import { Link } from 'react-router-dom'
import '../styles/LegalPage.css'

export default function TermsOfService() {
  useSEO({
    title: 'Terms & Conditions – UPLYNK Tech',
    description: 'Read the Terms and Conditions governing your use of UPLYNK Tech services.',
    canonical: 'https://uplynktech.com/terms',
  })

  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <p className="legal-eyebrow">Legal</p>
          <h1>Terms &amp; Conditions</h1>
          <p className="legal-meta">Last updated: April 2025</p>
        </div>

        <div className="legal-content">

          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to UPLYNK Tech. By engaging our services or using our website, you agree to be bound by these
              Terms &amp; Conditions. Please read them carefully before proceeding.
            </p>
            <p>
              If you do not agree with any part of these terms, please do not use our website or engage our services.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Services We Offer</h2>
            <p>UPLYNK Tech provides the following professional digital services:</p>
            <ul>
              <li><strong>Web Development</strong> – Custom websites and web applications.</li>
              <li><strong>App Development</strong> – iOS and Android mobile applications.</li>
              <li><strong>Graphic Designing</strong> – Brand identities, logos, and visual design.</li>
              <li><strong>Social Media Marketing</strong> – Content strategy, campaigns, and audience growth.</li>
              <li><strong>AI Solutions</strong> – Custom artificial intelligence tools and automation systems.</li>
            </ul>
            <p>
              We do <strong>not</strong> offer any educational courses or training programs. All services are
              professionally delivered to business clients.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Project Agreements</h2>
            <p>
              Before any project begins, both parties (UPLYNK Tech and the client) will agree on the project scope,
              timeline, and deliverables through a written proposal or agreement. Work will only commence after this
              agreement is confirmed.
            </p>
            <p>
              Any changes to the agreed scope after work has begun may affect the timeline and cost. Such changes
              must be agreed upon in writing before they are implemented.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Payment Terms</h2>
            <ul>
              <li>A <strong>50% advance payment</strong> is required before any project work begins.</li>
              <li>The remaining <strong>50% is due upon project completion</strong>, before the final files or website handover.</li>
              <li>For ongoing monthly services (e.g., Social Media Marketing), payment is due at the beginning of each month.</li>
              <li>All prices are agreed upon in writing before the project starts. Prices will not change mid-project unless the scope changes.</li>
            </ul>
            <p>
              Late payments may cause project delays. UPLYNK Tech reserves the right to pause work on any project where
              payment is overdue by more than 7 days.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Revisions Policy</h2>
            <p>
              Each project includes a set number of revision rounds as outlined in your project proposal. Standard packages
              typically include <strong>2–3 rounds of revisions</strong>.
            </p>
            <p>
              Additional revision rounds beyond what is included in the package may be charged separately. Revisions must
              be requested within 7 days of delivery.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Client Responsibilities</h2>
            <p>To ensure smooth project delivery, clients are expected to:</p>
            <ul>
              <li>Provide all required materials (text, images, branding assets, etc.) in a timely manner.</li>
              <li>Give clear and constructive feedback within the agreed timeframes.</li>
              <li>Ensure that any content provided does not infringe on third-party copyrights or rights.</li>
              <li>Make payments on time as agreed.</li>
            </ul>
            <p>
              Delays caused by late client feedback or missing materials are not the responsibility of UPLYNK Tech and
              may affect the agreed delivery timeline.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Intellectual Property</h2>
            <p>
              Upon receipt of full payment, all creative work — including designs, code, and content — produced for a
              specific client project becomes the <strong>property of the client</strong>.
            </p>
            <p>
              Until full payment is received, UPLYNK Tech retains ownership of all deliverables. UPLYNK Tech also
              reserves the right to showcase completed projects in our portfolio unless the client requests otherwise
              in writing.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Confidentiality</h2>
            <p>
              We treat all client information and project details with strict confidentiality. We will not share your
              business data, project details, or any proprietary information with third parties without your explicit
              permission.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Limitation of Liability</h2>
            <p>
              UPLYNK Tech delivers services with the highest care and professionalism. However, we are not liable for:
            </p>
            <ul>
              <li>Business losses, loss of revenue, or indirect damages arising from the use of our deliverables.</li>
              <li>Issues caused by third-party services, platforms, or tools (e.g., hosting providers, app stores).</li>
              <li>Problems arising from client-provided content or data.</li>
            </ul>
            <p>
              Our total liability in any case is limited to the amount paid by the client for the specific project in question.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Termination</h2>
            <p>
              Either party may terminate a project agreement with <strong>14 days written notice</strong>. In the event of
              termination:
            </p>
            <ul>
              <li>The client will be invoiced for all work completed up to the date of termination.</li>
              <li>The advance payment is non-refundable if work has already commenced.</li>
              <li>All completed deliverables up to that point will be handed over upon receipt of payment for work done.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>11. Updates to These Terms</h2>
            <p>
              We may update these Terms &amp; Conditions from time to time to reflect changes in our services or legal
              requirements. The updated version will always be available on this page with the revised date shown at the top.
            </p>
            <p>
              Continued use of our services after changes are published constitutes your acceptance of the updated terms.
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Contact Us</h2>
            <p>If you have any questions about these Terms &amp; Conditions, please reach out:</p>
            <div className="legal-contact-box">
              <p><strong>UPLYNK Tech</strong></p>
              <p>Email: <a href="mailto:uplynktech@gmail.com">uplynktech@gmail.com</a></p>
              <p>WhatsApp: <a href="https://wa.me/923298650167">+92 329 865 0167</a></p>
              <p>Location: Islamabad, Pakistan</p>
            </div>
          </section>

          <div className="legal-footer-nav">
            <p>Also read our <Link to="/privacy-policy">Privacy Policy</Link></p>
          </div>

        </div>
      </div>
    </div>
  )
}
