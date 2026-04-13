import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import '../styles/CoursesPage.css'
import WhyChooseCourses from '../components/WhyChooseCourses'
import { supabase } from '../lib/supabase'
import { resolveIcon, ACADEMY_TRACKS } from '../lib/icons'
import { FiArrowRight } from 'react-icons/fi'

export default function CoursesPage() {
  const navigate = useNavigate()
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)

  useSEO({
    title: 'UPLYNK Academy | Elite Tech Education & Upskilling',
    description: 'Learn in-demand skills directly from industry experts. Comprehensive tracks in Software Engineering, AI, Cloud, and Design.',
    canonical: 'https://uplynktech.com/courses',
    keywords: 'coding bootcamp, uplynk academy, software engineering course, ai course, deep learning certification, UI/UX course'
  })

  useEffect(() => {
    async function fetchAcademyData() {
      try {
        const { data, error } = await supabase
          .from('display_courses')
          .select('*')
          .order('track_name', { ascending: true })

        if (error) throw error
        processAcademyData(data)
      } catch (err) {
        console.error('Error fetching academy data:', err)
      } finally {
        setLoading(false)
      }
    }

    const processAcademyData = (data) => {
      if (!data) return
      
      // Group courses by track using metadata standard
      const grouped = {}
      
      // Initialize groups from metadata
      Object.keys(ACADEMY_TRACKS).forEach(key => {
        grouped[key] = {
          name: ACADEMY_TRACKS[key].displayName,
          slug: ACADEMY_TRACKS[key].slug,
          icon: ACADEMY_TRACKS[key].icon,
          color: ACADEMY_TRACKS[key].color,
          description: 'Advance your career with specialized technical expertise.',
          courses: []
        }
      })

      data.forEach(course => {
        const trackKey = course.track_name || 'General'
        if (!grouped[trackKey]) {
           grouped[trackKey] = {
             name: trackKey,
             slug: course.slug.split('-')[0],
             icon: 'FiCpu',
             color: '#7c3aed',
             description: 'Industry-standard training and certification.',
             courses: []
           }
        }
        
        // Pick track description from the first course in that track that has it
        if (course.details?.trackDescription) {
          grouped[trackKey].description = course.details.trackDescription
        }

        grouped[trackKey].courses.push(course)
      })

      // Filter out empty groups
      setTracks(Object.values(grouped).filter(g => g.courses.length > 0))
    }

    fetchAcademyData()

    // Realtime Subscription
    const channel = supabase
      .channel('academy-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'display_courses'
        },
        async (payload) => {
          console.log('Realtime Academy Update:', payload)
          const { data } = await supabase
            .from('display_courses')
            .select('*')
            .order('track_name', { ascending: true })
          processAcademyData(data)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <section className="academy-page">
      <div className="academy-header-section">
        <div className="academy-header-content">
          <p className="academy-eyebrow">UPLYNK Academy</p>
          <h1 className="academy-main-title">Continuous Education</h1>
          <p className="academy-main-subtitle">
            We don't just build software. We forge the next generation of top-tier engineers, data scientists, and creative strategists. Join our comprehensive learning tracks.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="academy-loading">
          <div className="loader"></div>
          <p>Unlocking Academy Curriculum...</p>
        </div>
      ) : (
        <>
          {/* Track Overview Cards */}
          <div className="academy-tracks-overview">
            {tracks.map((track) => {
              const Icon = resolveIcon(track.icon)
              const color = track.color
              return (
                <div
                  key={track.slug}
                  className="track-overview-card"
                  style={{ '--track-color': color }}
                  onClick={() => navigate(`/courses/${track.slug}`)}
                >
                  <div className="toc-icon-wrap">
                    <Icon className="toc-icon" />
                  </div>
                  <h3 className="toc-title">{track.name}</h3>
                  <p className="toc-desc">{track.description}</p>
                  <button className="toc-cta">
                    View Track <FiArrowRight />
                  </button>
                </div>
              )
            })}
          </div>

          {/* All individual courses overview */}
          <div className="academy-tracks-container">
            {tracks.map((track, trackIdx) => (
              <div key={trackIdx} className="academy-track">
                <div className="track-header">
                  <h2 className="track-title">{track.name}</h2>
                  <p className="track-description">{track.description}</p>
                </div>

                <div className="track-courses-grid">
                  {track.courses.map(course => (
                    <div
                      key={course.id}
                      className="academy-course-card"
                      onClick={() => navigate(`/courses/${course.slug}`)}
                    >
                      <div className="academy-course-header">
                        <span className="course-level-tag">{course.level}</span>
                        {course.status && (
                          <span className={`course-status-tag ${course.status.toLowerCase().replace(' ', '-')}`}>
                            {course.status}
                          </span>
                        )}
                      </div>
                      <h3 className="course-card-title">{course.title}</h3>
                      <p className="course-card-desc">{course.description}</p>

                      <div className="course-card-meta">
                        <div className="meta-block">
                          <span className="m-label">Duration</span>
                          <span className="m-value">{course.duration}</span>
                        </div>
                        <div className="meta-block">
                          <span className="m-label">Students</span>
                          <span className="m-value">{(course.students || 0).toLocaleString()}+</span>
                        </div>
                      </div>

                      {course.start_date && (
                        <div className="course-start-date">
                          Starts: {new Date(course.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </div>
                      )}

                      <div className="course-card-footer">
                        <button className="enroll-btn-preview">Join Academy →</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <WhyChooseCourses />
    </section>
  )
}
