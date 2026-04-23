import { useSEO } from '../hooks/useSEO'
import { Link } from 'react-router-dom'
import '../styles/LegalPage.css'

export default function PrivacyPolicy() {
  useSEO({
    title: 'Privacy Policy – UPLYNK Tech',
    description: 'Read how UPLYNK Tech collects, uses, and protects your personal information.',
    canonical: 'https://uplynktech.com/privacy-policy',
  })

  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <p className="legal-eyebrow">Legal</p>
          <h1>Privacy Policy</h1>
          <p className="legal-meta">Last updated: April 2025</p>
        </div>

        <div className="legal-content">

          <section className="legal-section">
            <h2>1. Who We Are</h2>
            <p>
              UPLYNK Tech is a digital services company based in Islamabad, Pakistan. We provide Web Development, App Development,
              Graphic Designing, Social Media Marketing, and AI Solutions to businesses worldwide.
            </p>
            <p>
              If you have any questions about this policy, you can contact us at{' '}
              <a href="mailto:uplynktech@gmail.com">uplynktech@gmail.com</a>.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Information We Collect</h2>
            <p>We only collect information that is necessary to provide our services. This includes:</p>
            <ul>
              <li><strong>Contact Information</strong> – your name, email address, and phone number when you fill out our contact or consultation form.</li>
              <li><strong>Project Information</strong> – details you share about your business or project so we can provide accurate quotes and deliver our services.</li>
              <li><strong>Usage Data</strong> – basic information about how you interact with our website (e.g., pages visited, time spent), collected through cookies.</li>
              <li><strong>Communication Records</strong> – emails or messages you send us, so we can respond effectively.</li>
            </ul>
            <p>We do <strong>not</strong> collect sensitive personal data such as financial account details, national identity numbers, or health information.</p>
          </section>

          <section className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use the information you provide to:</p>
            <ul>
              <li>Respond to your enquiries and project requests.</li>
              <li>Deliver the digital services you have hired us for.</li>
              <li>Send you project updates and relevant communications.</li>
              <li>Improve our website and service quality based on usage patterns.</li>
              <li>Send occasional updates about our services (you can opt out at any time).</li>
            </ul>
            <p>We will never use your information for unrelated marketing, spam, or sell it to third parties.</p>
          </section>

          <section className="legal-section">
            <h2>4. Cookies</h2>
            <p>
              Our website uses cookies — small text files stored on your browser — to help the site work properly and understand
              how visitors use it. We use:
            </p>
            <ul>
              <li><strong>Essential Cookies</strong> – required for the website to function correctly.</li>
              <li><strong>Analytics Cookies</strong> – help us understand which pages are popular so we can improve them.</li>
            </ul>
            <p>
              You can disable cookies in your browser settings at any time. Doing so may affect some parts of our website.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Sharing Your Information</h2>
            <p>We do not sell, rent, or trade your personal information. We may only share your data with:</p>
            <ul>
              <li><strong>Trusted service providers</strong> – such as cloud hosting platforms (e.g., Supabase) that help us run our systems, under strict confidentiality agreements.</li>
              <li><strong>Legal authorities</strong> – if required by law or to protect the rights and safety of our company or others.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Data Protection & Security</h2>
            <p>
              We take reasonable technical and organisational steps to protect your data from unauthorised access, loss, or misuse.
              All data transmission on our website is encrypted using HTTPS.
            </p>
            <p>
              While we do our best to protect your information, no method of internet transmission is 100% secure. Please contact
              us immediately at <a href="mailto:uplynktech@gmail.com">uplynktech@gmail.com</a> if you believe your data has been
              compromised.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. How Long We Keep Your Data</h2>
            <p>
              We keep your personal information only for as long as it is needed for the purpose it was collected — usually for
              the duration of a project plus one year for record-keeping. After that, it is securely deleted.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Request access to the personal data we hold about you.</li>
              <li>Ask us to correct any inaccurate information.</li>
              <li>Request that we delete your personal data.</li>
              <li>Opt out of any marketing communications from us.</li>
            </ul>
            <p>
              To exercise any of these rights, please email us at{' '}
              <a href="mailto:uplynktech@gmail.com">uplynktech@gmail.com</a>.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top
              of this page. We encourage you to review this page periodically.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please reach out:</p>
            <div className="legal-contact-box">
              <p><strong>UPLYNK Tech</strong></p>
              <p>Email: <a href="mailto:uplynktech@gmail.com">uplynktech@gmail.com</a></p>
              <p>WhatsApp: <a href="https://wa.me/923298650167">+92 329 865 0167</a></p>
              <p>Location: Islamabad, Pakistan</p>
            </div>
          </section>

          <div className="legal-footer-nav">
            <p>Also read our <Link to="/terms">Terms &amp; Conditions</Link></p>
          </div>

        </div>
      </div>
    </div>
  )
}
