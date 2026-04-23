import { useState, useEffect } from 'react';
import { useSEO } from '../hooks/useSEO';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiTarget, FiHeart, FiShield, FiTrendingUp, FiMonitor, FiSmartphone, FiPenTool, FiCpu } from 'react-icons/fi';
import { supabase } from '../lib/supabase';
import { resolveImageUrl } from '../lib/utils';
import WhyChooseUs from '../components/WhyChooseUs';
import '../styles/AboutUsPage.css';

export default function AboutUsPage() {
  const navigate = useNavigate();

  // Team State
  const [ceo, setCeo] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useSEO({
    title: 'About Us - Meet the UPLYNK Team',
    description: 'We are UPLYNK Tech, a dedicated agency building custom websites, mobile apps, and AI solutions that help businesses scale.',
    canonical: 'https://uplynktech.com/about',
    keywords: 'about uplynk, digital agency team, b2b web development team, ai agency about us'
  });

  // Fetch Team Data
  useEffect(() => {
    async function fetchTeam() {
      try {
        const { data, error } = await supabase
          .from('display_team')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;

        const ceoMatch = data.find(m => m.is_ceo);

        const teamOverrides = {
          'Hummam Abbasi': {
            role: 'Chief Marketing Officer',
            bio: 'Hummam leads our marketing strategy with a focus on brand growth, digital presence, and customer engagement. He ensures that our services reach the right audience with clarity and impact.'
          },
          'Muhammad Furqan': {
            role: 'Chief Technology Officer',
            bio: 'Furqan oversees the technical direction of UPLYNK Tech, leading the development of scalable and high-performance systems. He specializes in full-stack development and ensures the delivery of reliable and efficient solutions.'
          },
          'Omamah Hayah Khan': {
            role: 'Chief Product Officer',
            bio: 'Omamah manages product strategy and development, ensuring that every solution is user-focused and aligned with business goals. She plays a key role in turning ideas into practical and impactful products.'
          },
          'Sarmad Durrani': {
            role: 'Chief Operational Officer',
            bio: 'Sarmad is responsible for managing operations and ensuring smooth project execution. He focuses on efficiency, coordination, and delivering consistent results across all services.'
          }
        };

        const others = data
          .filter(m => !m.is_ceo && !m.name.toLowerCase().includes('atif'))
          .map(m => teamOverrides[m.name] ? { ...m, ...teamOverrides[m.name] } : m);


        setCeo(ceoMatch || null);
        setTeamMembers(others);
      } catch (err) {
        console.error('Error fetching team:', err);
      } finally {
        setLoadingTeam(false);
      }
    }

    fetchTeam();
  }, []);

  const getMemberImage = (img) => {
    return img ? resolveImageUrl(img) : '/img/default.webp';
  };

  const values = [
    { icon: FiTarget, title: 'Client Success First', desc: 'Your growth is our only priority. We build solutions designed specifically to solve your problems.' },
    { icon: FiHeart, title: 'Human Connection', desc: 'We believe technology should simplify lives, not complicate them. We communicate clearly and honestly.' },
    { icon: FiShield, title: 'Reliability & Trust', desc: 'No missed deadlines and no broken promises. We deliver what we say we will, every single time.' },
    { icon: FiTrendingUp, title: 'Scalable Growth', desc: 'We do not just build for today. We engineer digital assets that can handle your growth tomorrow.' }
  ];

  const servicesOverview = [
    { icon: FiMonitor, title: 'Web Development', desc: 'Fast, secure business websites.' },
    { icon: FiSmartphone, title: 'App Development', desc: 'Beautiful iOS & Android apps.' },
    { icon: FiPenTool, title: 'Graphic Design', desc: 'Memorable brand identities.' },
    { icon: FiTrendingUp, title: 'Social Media', desc: 'Audience and revenue growth.' },
    { icon: FiCpu, title: 'AI Services', desc: 'Smart workflow automation.' }
  ];

  return (
    <div className="aboutus-page">

      {/* 1. Hero Section */}
      <section className="about-hero">
        <div className="container">
          <p className="about-eyebrow">Who We Are</p>
          <h1 className="about-hero-title">
            We Build Digital Solutions<br />That <span className="highlight">Scale Businesses.</span>
          </h1>
          <p className="about-hero-subtitle">
            UPLYNK is a dedicated team of engineers, designers, and strategists. We partner with ambitious brands to build websites, mobile apps, and digital campaigns that drive real results.
          </p>
          <div className="about-hero-actions">
            <button className="btn-primary" onClick={() => navigate('/consultation')}>
              Let's Talk About Your Project
            </button>
          </div>
        </div>
      </section>

      {/* 2. Our Story */}
      <section id="our-story" className="about-story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-content">
              <h2>Our Story</h2>
              <h3>Why we started, and what we do.</h3>
              <p>
                We started UPLYNK because we noticed a massive gap in the industry: many agencies either build beautiful things that do not work well, or highly functional systems that look terrible.
              </p>
              <p>
                We believed businesses deserved both. Today, we bridge the gap between complex engineering, beautiful UI design, and strategic marketing. Our goal is simple: to be the reliable technical partner you can trust to handle your digital growth, so you can focus on running your business.
              </p>
            </div>
            <div className="story-image-placeholder">
              <div className="story-img-box">
                <img 
                  src="/img/group_image.jpeg" 
                  alt="UPLYNK Tech Team" 
                  className="story-group-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

    {/* 3. Mission & Values */ }
      <section id="our-values" className="about-values-section">
      <div className="container">
        <div className="section-header-center">
          <h2>Our Mission & Values</h2>
          <p>The core principles that guide how we work and treat our clients.</p>
        </div>

        <div className="values-grid">
          {values.map((v, i) => (
            <div key={i} className="value-card">
              <div className="value-icon-box">
                <v.icon />
              </div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
      </section>

    {/* 4. Services Overview */ }
    <section className="about-services-overview">
      <div className="container">
        <div className="services-overview-header">
          <h2>What We Do</h2>
          <p>A unified approach to standardizing your digital presence.</p>
        </div>
        <div className="overview-cards">
          {servicesOverview.map((srv, idx) => (
            <div key={idx} className="overview-card" onClick={() => navigate('/services')}>
              <srv.icon className="overview-card-icon" />
              <h4>{srv.title}</h4>
              <p>{srv.desc}</p>
            </div>
          ))}
        </div>
      </div>
      </section>

    {/* 5. Meet Our Team */ }
    <section id="meet-the-team" className="about-team-section">
      <div className="container">
        <div className="section-header-center">
          <h2>Meet Our Team</h2>
          <p>The talented humans building your digital future.</p>
        </div>

        {loadingTeam ? (
          <div className="team-loading">Loading team members...</div>
        ) : (
          <div className="team-showcase">
            {/* CEO Focus */}
            {ceo && (
              <div className="ceo-spotlight-editorial">
                <div className="ceo-editorial-img">
                  <img
                    src={getMemberImage(ceo.image)}
                    alt={ceo.name}
                    loading="lazy"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/img/default.webp'; }}
                  />
                </div>
                <div className="ceo-editorial-content">
                  <span className="editorial-quotes">"</span>
                  <p className="editorial-quote-text">
                    At UPLYNK Tech, we specialize in designing and developing advanced digital and AI-driven solutions that enhance and transform business operations. Our focus is on delivering scalable, high-performance systems that enable organizations to grow, adapt, and innovate in an increasingly digital landscape.
                  </p>

                  <div className="editorial-bottom">
                    <span className="editorial-badge">FOUNDER</span>
                    <h3 className="editorial-name">{ceo.name}</h3>
                    <p className="editorial-title">CHIEF EXECUTIVE OFFICER</p>
                  </div>
                </div>
              </div>
            )}

            {/* Team Grid */}
            <div className="team-grid">
              {teamMembers.map(member => (
                <div key={member.id} className="team-member-card">
                  <div className="member-image-wrapper">
                    <img
                      src={getMemberImage(member.image)}
                      alt={member.name}
                      loading="lazy"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/img/default.webp'; }}
                    />
                  </div>
                  <div className="member-info">
                    <h4>{member.name}</h4>
                    <p className="member-role">{member.role}</p>
                    <p className="member-short-bio">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      </section>

    {/* 6. Why Choose Us */ }
    <div id="why-choose-us">
      <WhyChooseUs />
    </div>

    {/* 7. Final CTA */ }
    <section className="about-final-cta">
      <div className="container center-content">
        <h2>Ready to accelerate your growth?</h2>
        <p>Stop losing clients to outdated digital strategies. Let's build something great together.</p>
        <button className="btn-primary large-cta" onClick={() => navigate('/consultation')}>
          Let's Work Together <FiArrowRight />
        </button>
      </div>
    </section>

    </div >
  );
}
