import ScamWarning from './ScamWarning'

function SchemeDetails({ scheme, onClose }) {
  if (!scheme) return null

  const documentsRequired = Array.isArray(scheme.documents_required)
    ? scheme.documents_required
    : []
  const howToApply = scheme.how_to_apply?.trim()
  const applyAt = scheme.apply_at?.trim()
  const hasApplyInfo = documentsRequired.length > 0 || howToApply || applyAt

  return (
    <div className="scheme-modal-overlay" onClick={onClose}>
      <div
        className="scheme-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="scheme-modal-close" onClick={onClose}>
          ✕
        </button>

        <span className="scheme-modal-category">
          {scheme.category || 'Government Scheme'}
        </span>

        <h2>{scheme.scheme_name}</h2>

        {scheme.last_verified && (
          <p className="scheme-verified-date">
            Last verified: {scheme.last_verified}
          </p>
        )}

        <div className="scheme-detail-section">
          <h3>💰 Benefit</h3>
          <p>
            {scheme.benefit || 'Benefit details are available on the official portal.'}
          </p>
        </div>

        <div className="scheme-detail-section">
          <h3>✅ Eligibility</h3>
          <p>
            {scheme.eligibility || 'Please check the official scheme guidelines.'}
          </p>
        </div>

        <div className="scheme-detail-section">
          <h3>📋 Basic Requirements</h3>
          <p>
            Age: {scheme.age_min || 'Any'} - {scheme.age_max || 'Any'}
          </p>
          <p>
            Gender: {scheme.gender || 'All'}
          </p>
          <p>
            Occupation: {scheme.occupation || 'All'}
          </p>
        </div>

        {documentsRequired.length > 0 && (
          <div className="scheme-detail-section">
            <h3>Documents you need</h3>
            <ul className="scheme-document-checklist">
              {documentsRequired.map((document, index) => (
                <li key={`${document}-${index}`}>
                  <label>
                    <input
                      type="checkbox"
                      aria-label={`Mark ${document} as ready`}
                    />
                    <span>{document}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {howToApply && (
          <div className="scheme-detail-section">
            <h3>How to apply</h3>
            <p>{howToApply}</p>
          </div>
        )}

        {applyAt && (
          <div className="scheme-detail-section">
            <h3>Where to apply</h3>
            <p>{applyAt}</p>
          </div>
        )}

        {hasApplyInfo && (
          <p className="scheme-apply-note">
            Steps can change. Please confirm on the official website before applying.
          </p>
        )}

        <ScamWarning />

        {scheme.official_website && (
          <a
            className="scheme-official-button"
            href={scheme.official_website}
            target="_blank"
            rel="noreferrer"
          >
            Visit Official Website →
          </a>
        )}

        <a
          className="report-wrong-information"
          href="https://forms.gle/F2gdThUbKQaEXdq18"
          target="_blank"
          rel="noreferrer"
        >
          Report wrong information: {scheme.scheme_name}
        </a>
      </div>
    </div>
  )
}

export default SchemeDetails
