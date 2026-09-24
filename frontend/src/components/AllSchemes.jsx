import { useEffect, useState } from 'react'
import './AllSchemes.css'
import SchemeDetails from "./SchemeDetails";
const API_URL = 'http://127.0.0.1:5000'
const formatAgeBound = (value) =>
  value === null || value === undefined || String(value).trim() === ''
    ? 'Any'
    : value

const comparisonRows = [
  ['Scheme name', (scheme) => scheme.scheme_name || '—'],
  ['Category', (scheme) => scheme.category || '—'],
  ['State', (scheme) => scheme.state || '—'],
  ['Benefit', (scheme) => scheme.benefit || '—'],
  ['Eligibility', (scheme) => scheme.eligibility || '—'],
  [
    'Age range',
    (scheme) => `${formatAgeBound(scheme.age_min)} to ${formatAgeBound(scheme.age_max)}`,
  ],
  ['Gender', (scheme) => scheme.gender || '—'],
  [
    'Income limit',
    (scheme) => (String(scheme.income_limit ?? '').trim() ? scheme.income_limit : 'No limit'),
  ],
  ['Occupation', (scheme) => scheme.occupation || '—'],
  ['Rural/Urban', (scheme) => scheme.rural_urban || '—'],
  ['Last verified', (scheme) => scheme.last_verified || '—'],
]

function AllSchemes({ onBack }) {
  const [schemes, setSchemes] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [compareSelection, setCompareSelection] = useState([])
  const [compareLimitMessage, setCompareLimitMessage] = useState('')
  const [comparisonOpen, setComparisonOpen] = useState(false)
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

  const comparedSchemes = compareSelection
    .map((schemeName) => schemes.find((scheme) => scheme.scheme_name === schemeName))
    .filter(Boolean)

  function toggleCompare(schemeName) {
    if (compareSelection.includes(schemeName)) {
      setCompareSelection(compareSelection.filter((name) => name !== schemeName))
      setCompareLimitMessage('')
      return
    }

    if (compareSelection.length >= 2) {
      setCompareLimitMessage('You can compare 2 schemes at a time')
      return
    }

    setCompareSelection([...compareSelection, schemeName])
    setCompareLimitMessage('')
  }

  function clearComparison() {
    setCompareSelection([])
    setCompareLimitMessage('')
    setComparisonOpen(false)
  }

  return (
    <div className={`all-schemes-page ${compareSelection.length ? 'has-compare-selection' : ''}`}>
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

                  <label className="compare-checkbox">
                    <input
                      type="checkbox"
                      checked={compareSelection.includes(scheme.scheme_name)}
                      onChange={() => toggleCompare(scheme.scheme_name)}
                      aria-label={`Compare ${scheme.scheme_name}`}
                    />
                    <span>Compare</span>
                  </label>

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

          {compareSelection.length > 0 && (
            <div className="compare-selection-bar" role="status">
              <div className="compare-selection-copy">
                {compareSelection.length === 1
                  ? '1 selected, choose one more'
                  : '2 schemes selected'}
                {compareLimitMessage && (
                  <small>{compareLimitMessage}</small>
                )}
              </div>

              <div className="compare-selection-actions">
                {compareSelection.length === 2 && (
                  <button
                    className="compare-action-primary"
                    type="button"
                    onClick={() => setComparisonOpen(true)}
                  >
                    Compare
                  </button>
                )}
                {compareSelection.length === 2 && (
                  <button type="button" onClick={clearComparison}>
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {comparisonOpen && comparedSchemes.length === 2 && (
            <div
              className="comparison-overlay"
              role="presentation"
              onClick={() => setComparisonOpen(false)}
            >
              <section
                className="comparison-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="comparison-title"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="comparison-modal-heading">
                  <h2 id="comparison-title">Compare schemes</h2>
                  <button type="button" onClick={() => setComparisonOpen(false)}>
                    Close
                  </button>
                </div>

                <div className="comparison-table-wrap">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th scope="col">Details</th>
                        {comparedSchemes.map((scheme) => (
                          <th scope="col" key={scheme.scheme_name}>
                            {scheme.scheme_name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map(([label, getValue]) => (
                        <tr key={label}>
                          <th scope="row">{label}</th>
                          {comparedSchemes.map((scheme) => (
                            <td key={scheme.scheme_name}>{getValue(scheme)}</td>
                          ))}
                        </tr>
                      ))}
                      <tr>
                        <th scope="row">Official website</th>
                        {comparedSchemes.map((scheme) => (
                          <td key={scheme.scheme_name}>
                            {scheme.official_website ? (
                              <a
                                href={scheme.official_website}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Visit website
                              </a>
                            ) : '—'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AllSchemes
