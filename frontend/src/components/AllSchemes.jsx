import { useEffect, useState } from 'react'
import './AllSchemes.css'
import SchemeDetails from "./SchemeDetails";
const API_URL = 'https://government-scheme-backend-v6kw.onrender.com'

function AllSchemes({ onBack }) {
  const [schemes, setSchemes] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
const [selectedScheme, setSelectedScheme] = useState(null)
  useEffect(() => {
    fetch(`${API_URL}/api/schemes`)
      .then((response) => response.json())
      .then((data) => {
        setSchemes(Array.isArray(data) ? data : data.schemes || [])
      })
      .catch(() => setSchemes([]))
      .finally(() => setLoading(false))
  }, [])

  const categories = [
    'All',
    ...new Set(schemes.map((scheme) => scheme.category).filter(Boolean)),
  ]

  const filteredSchemes = schemes.filter((scheme) => {
    const text = `${scheme.scheme_name} ${scheme.category} ${scheme.benefit} ${scheme.eligibility}`
      .toLowerCase()

    const matchesSearch = text.includes(search.toLowerCase())
    const matchesCategory =
      category === 'All' || scheme.category === category

    return matchesSearch && matchesCategory
  })

  return (
    <div className="all-schemes-page">
      <header className="schemes-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Eligibility Checker
        </button>

        <div>
          <p className="schemes-eyebrow">Government Services</p>
          <h1>All Government Schemes</h1>
          <p>
            Explore government schemes and find support available for
            education, agriculture, housing, employment and welfare.
          </p>
        </div>
      </header>

      <section className="scheme-tools">
        <input
          type="text"
          placeholder="Search schemes..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </section>

      {loading ? (
        <div className="scheme-message">Loading schemes...</div>
      ) : (
        <>
          <div className="scheme-count">
            Showing {filteredSchemes.length} of {schemes.length} schemes
          </div>

          <section className="all-scheme-grid">
            {filteredSchemes.map((scheme) => (
              <article className="all-scheme-card" key={scheme.scheme_name}>
                <div className="scheme-image-placeholder">
                  {scheme.category || 'Government Scheme'}
                </div>

                <div className="scheme-card-content">
                  <span className="scheme-category">
                    {scheme.category || 'General'}
                  </span>

                  <h2>{scheme.scheme_name}</h2>

                  <p>
                    <strong>Benefit:</strong>{' '}
                    {scheme.benefit || 'Details available on the official portal.'}
                  </p>

                  <p>
                    <strong>Eligibility:</strong>{' '}
                    {scheme.eligibility || 'Check official scheme guidelines.'}
                  </p>

                  {scheme.official_website && (
                    <a
                      href={scheme.official_website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Official Website →
                    </a>
                  )}
                  <button
  className="save-scheme-button"
  onClick={() => {
    const saved = JSON.parse(
      localStorage.getItem('savedSchemes') || '[]'
    )

    const alreadySaved = saved.some(
      (item) => item.scheme_name === scheme.scheme_name
    )

    if (!alreadySaved) {
      localStorage.setItem(
        'savedSchemes',
        JSON.stringify([...saved, scheme])
      )
      alert('Scheme saved successfully!')
    } else {
      alert('Scheme is already saved!')
    }
  }}
>
  ♡ Save Scheme
</button>
                  <button
  className="view-details-button"
  onClick={() => setSelectedScheme(scheme)}
>
  View Details
</button>
                </div>
              </article>
            ))}
          </section>

          {!filteredSchemes.length && (
            <div className="scheme-message">
              No schemes found. Try another search or category.
            </div>
          )}
          {selectedScheme && (
  <SchemeDetails
    scheme={selectedScheme}
    onClose={() => setSelectedScheme(null)}
  />
)}
        </>
      )}
    </div>
  )
}

export default AllSchemes