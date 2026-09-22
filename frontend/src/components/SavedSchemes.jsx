import { useEffect, useState } from 'react'
import SchemeDetails from './SchemeDetails'
import './SavedSchemes.css'

function SavedSchemes({ onBack }) {
const [savedSchemes, setSavedSchemes] = useState([])
const [selectedScheme, setSelectedScheme] = useState(null)

useEffect(() => {
  const saved = JSON.parse(
    localStorage.getItem('savedSchemes') || '[]'
  );

  setSavedSchemes(saved);
}, []);

function removeScheme(schemeName) {
const updatedSchemes = savedSchemes.filter(
(scheme) => scheme.scheme_name !== schemeName
)

```
localStorage.setItem(
  'savedSchemes',
  JSON.stringify(updatedSchemes)
)

setSavedSchemes(updatedSchemes)
```

}

return ( <div className="saved-schemes-page"> <header className="saved-header"> <button className="back-button" onClick={onBack}>
← Back </button>


    <p className="saved-eyebrow">
      My Government Services
    </p>

    <h1>Saved Schemes</h1>

    <p>
      Keep your important government schemes in one place
      for quick access later.
    </p>
  </header>

  {savedSchemes.length === 0 ? (
    <section className="saved-empty-state">
      <div className="saved-icon">♡</div>

      <h2>No Saved Schemes Yet</h2>

      <p>
        When you find a useful government scheme, save it
        here for easy access later.
      </p>

      <button onClick={onBack}>
        Explore Government Schemes →
      </button>
    </section>
  ) : (
    <section className="saved-scheme-list">
      <div className="saved-count">
        {savedSchemes.length} saved scheme
        {savedSchemes.length !== 1 ? 's' : ''}
      </div>

      <div className="saved-grid">
        {savedSchemes.map((scheme) => (
          <article
            className="saved-scheme-card"
            key={scheme.scheme_name}
          >
            <span className="saved-category">
              {scheme.category || 'Government Scheme'}
            </span>

            <h2>{scheme.scheme_name}</h2>

            <p>
              <strong>Benefit:</strong>{' '}
              {scheme.benefit ||
                'Details available on the official portal.'}
            </p>

            <div className="saved-card-actions">
              <button
                className="saved-view-button"
                onClick={() => setSelectedScheme(scheme)}
              >
                View Details
              </button>

              {scheme.official_website && (
                <a
                  className="saved-official-link"
                  href={scheme.official_website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Official Website →
                </a>
              )}

              <button
                className="remove-scheme-button"
                onClick={() =>
                  removeScheme(scheme.scheme_name)
                }
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )}

  <SchemeDetails
    scheme={selectedScheme}
    onClose={() => setSelectedScheme(null)}
  />
</div>


)
}

export default SavedSchemes
