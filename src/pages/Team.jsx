import { useState, useEffect } from 'react'
import { useSEO } from '../hooks/useSEO'
import { FiLinkedin, FiMail, FiLayers, FiCpu, FiUser, FiX } from 'react-icons/fi'
import '../styles/Team.css'
import { supabase } from '../lib/supabase'
import { resolveImageUrl } from '../lib/utils'

export default function Team() {
  const [ceo, setCeo] = useState(null)
  const [leadershipMembers, setLeadershipMembers] = useState([])
  const [extendedMembers, setExtendedMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState(null)

  useSEO({
    title: 'Meet Our Leadership & Engineering - UPLYNK Tech',
    description: 'Explore the experts behind UPLYNK Tech. A unified core of visionaries and high-performance engineers.',
    canonical: 'https://uplynktech.com/team',
    keywords: 'leadership, tech team, engineering lead, ai expert, uplynk team'
  })

  useEffect(() => {
    async function fetchTeam() {
      try {
        const { data, error } = await supabase
          .from('display_team')
          .select('*')
          .order('name', { ascending: true })

        if (error) throw error
        processTeamData(data)
      } catch (err) {
        console.error('Error fetching team:', err)
      } finally {
        setLoading(false)
      }
    }

    const processTeamData = (data) => {
      if (!data) return
      const ceoMatch = data.find(m => m.is_ceo)
      const leadership = data.filter(m => !m.is_ceo && m.is_leadership)
      const extended = data.filter(m => !m.is_ceo && !m.is_leadership)
      
      setCeo(ceoMatch || { name: 'Hanif Ullah Khan', role: 'Chief Executive Officer', bio: 'Visionary Strategist.', message: 'Leading digital transformation.' })
      setLeadershipMembers(leadership)
      setExtendedMembers(extended)
    }

    fetchTeam()

    // Realtime Subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'display_team'
        },
        async (payload) => {
          console.log('Realtime Team Update:', payload)
          // Refetch to ensure all logic (grouping) is applied correctly
          const { data } = await supabase.from('display_team').select('*').order('name', { ascending: true })
          processTeamData(data)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <section className="team-page">
      {loading ? (
        <div className="team-loading">
          <div className="loader"></div>
          <p>Assembling Technical Core...</p>
        </div>
      ) : (
        <>
          {/* CEO Vision Section */}
          <div className="visionary-ceo-block">
            <div className="ceo-card">
              <div className="ceo-image-area">
                {ceo.image ? (
                  <img 
                    src={resolveImageUrl(ceo.image)} 
                    alt={ceo.name} 
                    className="ceo-primary-img"
                    onError={(e) => {
                      console.error('CEO Image Load Failed:', ceo.image);
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="no-img-placeholder"><FiUser /></div>
                )}
              </div>
              <div className="ceo-message-area">
                <span className="quote-serif">"</span>
                <p className="ceo-vision-text">{ceo.message}</p>
                <div className="ceo-signature">
                  <div className="founder-badge-inline">Founder</div>
                  <h2 className="ceo-full-name">{ceo.name}</h2>
                  <p className="ceo-full-role">{ceo.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 1. Leadership & Engineering (Elite Circular Grid) */}
          {leadershipMembers.length > 0 && (
            <section className="leadership-section">
              <div className="container">
                <div className="section-header-centered">
                  <h2 className="leads-title">Leadership and Engineering</h2>
                  <div className="title-aesthetic-bar"></div>
                </div>
                
                <div className="leadership-grid">
                  {leadershipMembers.map(member => (
                    <div key={member.id} className="leader-circle-card" onClick={() => setSelectedMember(member)}>
                      <div className="circle-visual-wrap">
                        <div className="circle-border-accents"></div>
                        <div className="circle-img-container">
                          {member.image ? (
                            <img src={resolveImageUrl(member.image)} alt={member.name} className="leader-circle-img" />
                          ) : (
                            <div className="leader-no-img">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="leader-info">
                        <h3 className="leader-name">{member.name}</h3>
                        <p className="leader-role">{member.role}</p>
                        <p className="leader-mini-bio">{member.bio?.substring(0, 80)}...</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 2. Extended Members (Tile Grid) */}
          <section className="unified-team-section">
            <div className="container">
              <div className="section-header-centered">
                <h2 className="leads-title">Extended Members</h2>
                <div className="title-aesthetic-bar"></div>
              </div>

              <div className="unified-grid">
                {extendedMembers.map(member => (
                  <div key={member.id} className="member-elite-card" onClick={() => setSelectedMember(member)}>
                    <div className="member-visual-area">
                      {member.image ? (
                        <img src={resolveImageUrl(member.image)} alt={member.name} className="member-img" />
                      ) : (
                        <div className="member-no-img">
                          <span className="member-initials">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                          <FiLayers className="member-bg-icon" />
                        </div>
                      )}
                      {/* Minimal Overlay for Socials */}
                      <div className="member-social-overlay">
                        <FiLinkedin />
                        <FiMail />
                      </div>
                    </div>
                    
                    <div className="member-info-content">
                      <h3 className="member-name">{member.name}</h3>
                      <p className="member-role">{member.role}</p>
                      <p className="member-bio-snippet">{member.bio?.substring(0, 100)}...</p>
                      <button className="read-bio-btn">Read Full Profile</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Member Full Profile Modal */}
          {selectedMember && (
            <div className="modal-overlay" onClick={() => setSelectedMember(null)}>
              <div className="member-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={() => setSelectedMember(null)}>
                  <FiX />
                </button>
                <div className="modal-grid">
                  <div className="modal-visual">
                    {selectedMember.image ? (
                      <img src={resolveImageUrl(selectedMember.image)} alt={selectedMember.name} />
                    ) : (
                      <div className="modal-no-img-placeholder">
                        {selectedMember.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  <div className="modal-details">
                    <p className="modal-eyebrow">Member Profile</p>
                    <h2 className="modal-headline">{selectedMember.name}</h2>
                    <p className="modal-tagline">{selectedMember.role}</p>
                    <div className="modal-bio-text">
                      <p>{selectedMember.bio}</p>
                    </div>
                    <div className="modal-links">
                      {selectedMember.email && (
                        <a href={`mailto:${selectedMember.email}`} className="modal-link">
                          <FiMail /> {selectedMember.email}
                        </a>
                      )}
                      {selectedMember.linkedin && (
                        <a href={selectedMember.linkedin} target="_blank" rel="noreferrer" className="modal-link">
                          <FiLinkedin /> LinkedIn Professional Profile
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

    </section>
  )
}
