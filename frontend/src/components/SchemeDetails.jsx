function SchemeDetails({ scheme, onClose }) {
  if (!scheme) return null

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
