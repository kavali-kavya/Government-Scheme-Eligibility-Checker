const labels = {
  en: { category: 'Category', benefit: 'Benefit', eligibility: 'Eligibility details', apply: 'Apply officially', website: 'Official website' },
  te: { category: '\u0c35\u0c3f\u0c2d\u0c3e\u0c17\u0c02', benefit: '\u0c2a\u0c4d\u0c30\u0c2f\u0c4b\u0c1c\u0c28\u0c02', eligibility: '\u0c05\u0c30\u0c4d\u0c39\u0c24 \u0c35\u0c3f\u0c35\u0c30\u0c3e\u0c32\u0c41', apply: '\u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15\u0c02\u0c17\u0c3e \u0c26\u0c30\u0c16\u0c3e\u0c38\u0c4d\u0c24\u0c41 \u0c1a\u0c47\u0c2f\u0c02\u0c21\u0c3f', website: '\u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c35\u0c46\u0c2c\u0c4d\u0c38\u0c48\u0c1f' },
  hi: { category: '\u0936\u094d\u0930\u0947\u0923\u0940', benefit: '\u0932\u093e\u092d', eligibility: '\u092a\u093e\u0924\u094d\u0930\u0924\u093e \u0935\u093f\u0935\u0930\u0923', apply: '\u0906\u0927\u093f\u0915\u093e\u0930\u093f\u0915 \u0930\u0942\u092a \u0938\u0947 \u0906\u0935\u0947\u0926\u0928 \u0915\u0930\u0947\u0902', website: '\u0906\u0927\u093f\u0915\u093e\u0930\u093f\u0915 \u0935\u0947\u092c\u0938\u093e\u0907\u091f' },
}

function SchemeCard({ scheme, language, matchReasons = [], missReason }) {
  const t = labels[language] || labels.en
  const isNearMiss = Boolean(missReason)

  return (
    <article className={`scheme-card ${isNearMiss ? 'near-miss-card' : ''}`}>
      <div className="card-heading">
        <p>
          <span className="category-dot" aria-hidden="true" />
          {t.category}: {scheme.category}
        </p>
        <span className="state-tag">{scheme.state}</span>
      </div>

      <h3>{scheme.scheme_name}</h3>

      <div className="benefit-panel">
        <span className="rupee" aria-hidden="true">Rs</span>
        <div>
          <small>{t.benefit}</small>
          <strong>{scheme.benefit}</strong>
        </div>
      </div>

      <div className="eligibility-copy">
        <h4>{t.eligibility}</h4>
        <p>{scheme.eligibility}</p>
      </div>

      {matchReasons.length > 0 && (
        <div className="match-reasons">
          <h4>Why you match</h4>
          <ul>
            {matchReasons.map((reason, index) => (
              <li key={`${reason}-${index}`}>{reason}</li>
            ))}
          </ul>
        </div>
      )}

      {missReason && <p className="miss-reason">{missReason}</p>}

      {scheme.last_verified && (
        <small className="verification-date">
          Last verified: {scheme.last_verified}
        </small>
      )}

      <div className="card-actions">
        {scheme.official_website && (
          <>
            <a
              className="apply-button"
              href={scheme.official_website}
              target="_blank"
              rel="noreferrer"
            >
              {t.apply}<span aria-hidden="true">&#8599;</span>
            </a>
            <a
              className="website-link"
              href={scheme.official_website}
              target="_blank"
              rel="noreferrer"
            >
              {t.website}
            </a>
          </>
        )}
      </div>
    </article>
  )
}

export default SchemeCard
