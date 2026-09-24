import { useEffect, useState } from 'react'
import EligibilityForm from './components/EligibilityForm'
import LoginPage from './components/LoginPage'
import SchemeCard from './components/SchemeCard'
import AllSchemes from './components/AllSchemes'
import SavedSchemes from './components/SavedSchemes'
import './App.css'

const API_URL = 'https://government-scheme-backend-v6kw.onrender.com'

// Unicode escape sequences keep Indian-language text reliable in all editors.
const copy = {
  en: {
    brand: 'SchemeSetu',
    brandSub: 'Government Services',
    language: 'Language',
    languages: {
      en: 'English',
      te: 'Telugu',
      hi: 'Hindi',
    },
    eyebrow: 'Government Scheme Eligibility Service',
    title: 'Discover government support made for you.',
    description:
      'A simple way to check schemes based on your age, income, location, and occupation.',
    formTag: 'Eligibility checker',
    formTitle: 'Share your details',
    formDescription:
      'Complete the fields below to receive a preliminary list of relevant government schemes.',
    privacy:
      'Your details are checked in your browser session and are not stored.',
    resultTag: 'Eligibility results',
    resultTitle: 'Schemes that match your profile',
    resultHint:
      'We found these schemes using the information you provided.',
    match: 'matching scheme',
    matches: 'matching schemes',
    noTitle: 'No matching schemes found',
    noText:
      'Try reviewing your income, occupation, and state. More schemes can be added as the directory grows.',
    errorTitle: 'Unable to check eligibility',
    errorText:
      'Please make sure the backend service is running and try again.',
    disclaimerTitle: 'Important notice',
    disclaimer:
      'These results are preliminary. Please confirm all conditions, documents, and deadlines on the official government portal before applying.',
    footer: 'A student project for exploring government scheme eligibility.',
    allSchemes: 'All Government Schemes',
  },

  te: {
    brand: '\u0c2a\u0c25\u0c38\u0c47\u0c24\u0c41',
    brandSub: '\u0c2a\u0c4d\u0c30\u0c2d\u0c41\u0c24\u0c4d\u0c35 \u0c38\u0c47\u0c35\u0c32\u0c41',
    language: '\u0c2d\u0c3e\u0c37',
    languages: {
      en: 'English',
      te: '\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41',
      hi: '\u0939\u093f\u0928\u094d\u0926\u0940',
    },
    eyebrow:
      '\u0c2a\u0c4d\u0c30\u0c2d\u0c41\u0c24\u0c4d\u0c35 \u0c2a\u0c25\u0c15\u0c3e\u0c32 \u0c05\u0c30\u0c4d\u0c39\u0c24 \u0c38\u0c47\u0c35',
    title:
      '\u0c2e\u0c40 \u0c15\u0c4b\u0c38\u0c02 \u0c2a\u0c4d\u0c30\u0c2d\u0c41\u0c24\u0c4d\u0c35 \u0c38\u0c39\u0c3e\u0c2f\u0c3e\u0c28\u0c4d\u0c28\u0c3f \u0c15\u0c28\u0c41\u0c17\u0c4a\u0c28\u0c02\u0c21\u0c3f.',
    description:
      '\u0c2e\u0c40 \u0c35\u0c2f\u0c38\u0c4d\u0c38\u0c41, \u0c06\u0c26\u0c3e\u0c2f\u0c02, \u0c30\u0c3e\u0c37\u0c4d\u0c1f\u0c4d\u0c30\u0c02, \u0c35\u0c43\u0c24\u0c4d\u0c24\u0c3f \u0c06\u0c27\u0c3e\u0c30\u0c02\u0c17\u0c3e \u0c2a\u0c25\u0c15\u0c3e\u0c32\u0c28\u0c41 \u0c24\u0c46\u0c32\u0c41\u0c38\u0c41\u0c15\u0c4b\u0c02\u0c21\u0c3f.',
    formTag: '\u0c05\u0c30\u0c4d\u0c39\u0c24 \u0c24\u0c28\u0c3f\u0c16\u0c40',
    formTitle: '\u0c2e\u0c40 \u0c35\u0c3f\u0c35\u0c30\u0c3e\u0c32\u0c28\u0c41 \u0c05\u0c02\u0c26\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f',
    formDescription:
      '\u0c2e\u0c40\u0c15\u0c41 \u0c38\u0c30\u0c3f\u0c2a\u0c4b\u0c2f\u0c47 \u0c2a\u0c25\u0c15\u0c3e\u0c32\u0c28\u0c41 \u0c24\u0c46\u0c32\u0c41\u0c38\u0c41\u0c15\u0c4b\u0c35\u0c21\u0c3e\u0c28\u0c3f\u0c15\u0c3f \u0c15\u0c4d\u0c30\u0c3f\u0c02\u0c26\u0c3f \u0c2b\u0c40\u0c32\u0c4d\u0c21\u0c4d\u0c32\u0c28\u0c41 \u0c28\u0c3f\u0c02\u0c2a\u0c02\u0c21\u0c3f.',
    privacy:
      '\u0c2e\u0c40 \u0c35\u0c3f\u0c35\u0c30\u0c3e\u0c32\u0c28\u0c41 \u0c2d\u0c26\u0c4d\u0c30\u0c2a\u0c30\u0c1a\u0c2e\u0c41.',
    resultTag: '\u0c05\u0c30\u0c4d\u0c39\u0c24 \u0c2b\u0c32\u0c3f\u0c24\u0c3e\u0c32\u0c41',
    resultTitle:
      '\u0c2e\u0c40 \u0c35\u0c3f\u0c35\u0c30\u0c3e\u0c32\u0c15\u0c41 \u0c38\u0c30\u0c3f\u0c2a\u0c4b\u0c2f\u0c47 \u0c2a\u0c25\u0c15\u0c3e\u0c32\u0c41',
    resultHint:
      '\u0c2e\u0c40 \u0c38\u0c2e\u0c3e\u0c1a\u0c3e\u0c30\u0c02 \u0c06\u0c27\u0c3e\u0c30\u0c02\u0c17\u0c3e \u0c08 \u0c2a\u0c25\u0c15\u0c3e\u0c32\u0c28\u0c41 \u0c15\u0c28\u0c41\u0c17\u0c4a\u0c28\u0c4d\u0c28\u0c3e\u0c2e\u0c41.',
    match: '\u0c2a\u0c25\u0c15\u0c02',
    matches: '\u0c2a\u0c25\u0c15\u0c3e\u0c32\u0c41',
    noTitle:
      '\u0c38\u0c30\u0c3f\u0c2a\u0c4b\u0c2f\u0c47 \u0c2a\u0c25\u0c15\u0c3e\u0c32\u0c41 \u0c32\u0c2d\u0c3f\u0c02\u0c1a\u0c32\u0c47\u0c26\u0c41',
    noText:
      '\u0c2e\u0c40 \u0c06\u0c26\u0c3e\u0c2f\u0c02, \u0c35\u0c43\u0c24\u0c4d\u0c24\u0c3f, \u0c30\u0c3e\u0c37\u0c4d\u0c1f\u0c4d\u0c30\u0c02 \u0c35\u0c02\u0c1f\u0c3f \u0c35\u0c3f\u0c35\u0c30\u0c3e\u0c32\u0c28\u0c41 \u0c24\u0c28\u0c3f\u0c16\u0c40 \u0c1a\u0c47\u0c38\u0c3f \u0c2e\u0c33\u0c4d\u0c33\u0c40 \u0c2a\u0c4d\u0c30\u0c2f\u0c24\u0c4d\u0c28\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f.',
    errorTitle:
      '\u0c05\u0c30\u0c4d\u0c39\u0c24\u0c28\u0c41 \u0c24\u0c28\u0c3f\u0c16\u0c40 \u0c1a\u0c47\u0c2f\u0c32\u0c47\u0c15\u0c2a\u0c4b\u0c2f\u0c3e\u0c2e\u0c41',
    errorText:
      '\u0c2c\u0c4d\u0c2f\u0c3e\u0c15\u0c46\u0c02\u0c21\u0c4d \u0c28\u0c21\u0c41\u0c38\u0c4d\u0c24\u0c4b\u0c02\u0c26\u0c3f \u0c2e\u0c33\u0c4d\u0c33\u0c40 \u0c2a\u0c4d\u0c30\u0c2f\u0c24\u0c4d\u0c28\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f.',
    disclaimerTitle:
      '\u0c2e\u0c41\u0c16\u0c4d\u0c2f\u0c2e\u0c48\u0c28 \u0c17\u0c2e\u0c28\u0c3f\u0c15',
    disclaimer:
      '\u0c08 \u0c2b\u0c32\u0c3f\u0c24\u0c3e\u0c32\u0c41 \u0c2a\u0c4d\u0c30\u0c3e\u0c25\u0c2e\u0c3f\u0c15\u0c2e\u0c48\u0c28\u0c35\u0c3f. \u0c26\u0c30\u0c16\u0c3e\u0c38\u0c4d\u0c24\u0c41\u0c15\u0c41 \u0c2e\u0c41\u0c02\u0c26\u0c41 \u0c05\u0c27\u0c3f\u0c15\u0c3e\u0c30\u0c3f\u0c15 \u0c2a\u0c4b\u0c30\u0c4d\u0c1f\u0c32\u0c4d\u0c32\u0c4b \u0c28\u0c3f\u0c2c\u0c02\u0c27\u0c28\u0c32\u0c41 \u0c24\u0c28\u0c3f\u0c16\u0c40 \u0c1a\u0c47\u0c38\u0c41\u0c15\u0c4b\u0c02\u0c21\u0c3f.',
    footer:
      '\u0c2a\u0c4d\u0c30\u0c2d\u0c41\u0c24\u0c4d\u0c35 \u0c2a\u0c25\u0c15\u0c3e\u0c32\u0c3e\u0c32\u0c28\u0c41 \u0c05\u0c28\u0c4d\u0c35\u0c47\u0c37\u0c3f\u0c02\u0c1a\u0c47 \u0c35\u0c3f\u0c26\u0c4d\u0c2f\u0c3e\u0c30\u0c4d\u0c25\u0c3f \u0c2a\u0c4d\u0c30\u0c3e\u0c1c\u0c46\u0c15\u0c4d\u0c1f\u0c4d.',
    allSchemes: '\u0c05\u0c28\u0c4d\u0c28\u0c3f \u0c2a\u0c4d\u0c30\u0c2d\u0c41\u0c24\u0c4d\u0c35 \u0c2a\u0c25\u0c15\u0c3e\u0c32\u0c41',
  },

  hi: {
    brand: '\u092f\u094b\u091c\u0928\u093e \u0938\u0947\u0924\u0941',
    brandSub: '\u0938\u0930\u0915\u093e\u0930\u0940 \u0938\u0947\u0935\u093e\u090f\u0902',
    language: '\u092d\u093e\u0937\u093e',
    languages: {
      en: 'English',
      te: '\u0c24\u0c46\u0932\u0941\u0c17\u0941',
      hi: '\u0939\u093f\u0928\u094d\u0926\u0940',
    },
    eyebrow:
      '\u0938\u0930\u0915\u093e\u0930\u0940 \u092f\u094b\u091c\u0928\u093e \u092a\u093e\u0924\u094d\u0930\u0924\u093e \u0938\u0947\u0935\u093e',
    title:
      '\u0905\u092a\u0928\u0947 \u0932\u093f\u090f \u092c\u0928\u0940 \u0938\u0930\u0915\u093e\u0930\u0940 \u0938\u0939\u093e\u092f\u0924\u093e \u0916\u094b\u091c\u0947\u0902\u0964',
    description:
      '\u0909\u092e\u094d\u0930, \u0906\u092f, \u0930\u093e\u091c\u094d\u092f \u0914\u0930 \u0935\u094d\u092f\u0935\u0938\u093e\u092f \u0915\u0947 \u0906\u0927\u093e\u0930 \u092a\u0930 \u092f\u094b\u091c\u0928\u093e\u090f\u0902 \u0916\u094b\u091c\u0928\u0947 \u0915\u093e \u0906\u0938\u093e\u0928 \u0924\u0930\u0940\u0915\u093e\u0964',
    formTag: '\u092a\u093e\u0924\u094d\u0930\u0924\u093e \u091c\u093e\u0902\u091a',
    formTitle: '\u0905\u092a\u0928\u0940 \u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u0926\u0947\u0902',
    formDescription:
      '\u0906\u092a\u0915\u0947 \u0932\u093f\u090f \u0938\u0902\u092c\u0902\u0927\u093f\u0924 \u092f\u094b\u091c\u0928\u093e\u090f\u0902 \u092a\u094d\u0930\u093e\u092a\u094d\u0924 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0928\u0940\u091a\u0947 \u0915\u0947 \u0915\u094d\u0937\u0947\u0924\u094d\u0930 \u092d\u0930\u0947\u0902\u0964',
    privacy:
      '\u0906\u092a\u0915\u0940 \u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u0938\u0939\u0947\u091c\u0940 \u0928\u0939\u0940\u0902 \u091c\u093e\u0924\u0940\u0964',
    resultTag: '\u092a\u093e\u0924\u094d\u0930\u0924\u093e \u092a\u0930\u093f\u0923\u093e\u092e',
    resultTitle:
      '\u0906\u092a\u0915\u0940 \u092a\u094d\u0930\u094b\u092b\u093e\u0907\u0932 \u0938\u0947 \u092e\u093f\u0932\u0924\u0940 \u092f\u094b\u091c\u0928\u093e\u090f\u0902',
    resultHint:
      '\u0926\u0940 \u0917\u0908 \u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u0915\u0947 \u0906\u0927\u093e\u0930 \u092a\u0930 \u0939\u092e\u0928\u0947 \u092f\u0947 \u092f\u094b\u091c\u0928\u093e\u090f\u0902 \u092a\u093e\u0908 \u0939\u0948\u0902\u0964',
    match: '\u092e\u093f\u0932\u0924\u0940 \u092f\u094b\u091c\u0928\u093e',
    matches: '\u092e\u093f\u0932\u0924\u0940 \u092f\u094b\u091c\u0928\u093e\u090f\u0902',
    noTitle:
      '\u0915\u094b\u0908 \u092e\u093f\u0932\u0924\u0940 \u092f\u094b\u091c\u0928\u093e \u0928\u0939\u0940\u0902 \u092e\u093f\u0932\u0940',
    noText:
      '\u0906\u092f, \u0935\u094d\u092f\u0935\u0938\u093e\u092f \u0914\u0930 \u0930\u093e\u091c\u094d\u092f \u0915\u0940 \u091c\u093e\u0902\u091a \u0915\u0930\u0947\u0902, \u092b\u093f\u0930 \u0938\u0947 \u092a\u094d\u0930\u092f\u093e\u0938 \u0915\u0930\u0947\u0902\u0964',
    errorTitle:
      '\u092a\u093e\u0924\u094d\u0930\u0924\u093e \u091c\u093e\u0902\u091a\u0940 \u0928\u0939\u0940\u0902 \u0939\u094b \u0938\u0915\u0940',
    errorText:
      '\u092c\u0948\u0915\u090f\u0902\u0921 \u0938\u0947\u0935\u093e \u091a\u093e\u0932\u0942 \u0939\u0948 \u092f\u093e \u0928\u0939\u0940\u0902, \u091c\u093e\u0902\u091a\u0947\u0902 \u0914\u0930 \u092b\u093f\u0930 \u0938\u0947 \u092a\u094d\u0930\u092f\u093e\u0938 \u0915\u0930\u0947\u0902\u0964',
    disclaimerTitle:
      '\u092e\u0939\u0924\u094d\u0935\u092a\u0942\u0930\u094d\u0923 \u0938\u0942\u091a\u0928\u093e',
    disclaimer:
      '\u092f\u0947 \u092a\u0930\u093f\u0923\u093e\u092e \u092a\u094d\u0930\u093e\u0930\u0902\u092d\u093f\u0915 \u0939\u0948\u0902\u0964 \u0906\u0935\u0947\u0926\u0928 \u0938\u0947 \u092a\u0939\u0932\u0947 \u0906\u0927\u093f\u0915\u093e\u0930\u093f\u0915 \u092a\u094b\u0930\u094d\u091f\u0932 \u092a\u0930 \u0938\u092d\u0940 \u0936\u0930\u094d\u0924\u0947\u0902, \u0926\u0938\u094d\u0924\u093e\u0935\u0947\u091c \u0914\u0930 \u0905\u0902\u0924\u093f\u092e \u0924\u093f\u0925\u093f \u091c\u093e\u0902\u091a\u0947\u0902\u0964',
    footer:
      '\u0938\u0930\u0915\u093e\u0930\u0940 \u092f\u094b\u091c\u0928\u093e \u092a\u093e\u0924\u094d\u0930\u0924\u093e \u0915\u094b \u0938\u092e\u091d\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u090f\u0915 \u0935\u093f\u0926\u094d\u092f\u093e\u0930\u094d\u0925\u0940 \u092a\u094d\u0930\u0915\u0932\u094d\u092a\u0964',
    allSchemes: '\u0938\u092d\u0940 \u0938\u0930\u0915\u093e\u0930\u0940 \u092f\u094b\u091c\u0928\u093e\u090f\u0902',
  },
}

function Dashboard({ onNavigate }) {
  const [language, setLanguage] = useState('en')
  const [schemes, setSchemes] = useState([])
  const [nearMisses, setNearMisses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const t = copy[language]

  async function handleEligibilityCheck(userDetails) {
    setLoading(true)
    setError('')
    setHasSearched(false)
    setNearMisses([])

    try {
      const response = await fetch(`${API_URL}/api/check-eligibility`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t.errorText)
      }

      setSchemes(data.eligible || data.matching_schemes || [])
      setNearMisses(data.near_misses || [])
      setHasSearched(true)
    } catch (requestError) {
      setError(requestError.message || t.errorText)
      setSchemes([])
      setNearMisses([])
    } finally {
      setLoading(false)
    }
  }

  function shareEligibleSchemes() {
    const shareText = [
      'Eligible government schemes:',
      ...schemes.map((scheme) =>
        [scheme.scheme_name, scheme.official_website].filter(Boolean).join('\n'),
      ),
    ].join('\n\n')

    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  function printResults() {
    window.print()
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a
          className="brand"
          href="#main-content"
          aria-label={t.brand}
        >
          <span className="emblem" aria-hidden="true">
            GOI
          </span>

          <span>
            <b>{t.brand}</b>
            <small>{t.brandSub}</small>
          </span>
        </a>

        <div className="header-actions">
          

          <label className="language-picker">
            <span className="globe" aria-hidden="true">
              &#9678;
            </span>

            <span className="sr-only">
              {t.language}
            </span>

            <select
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value)
              }
              aria-label={t.language}
            >
              {Object.entries(t.languages).map(
                ([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ),
              )}
            </select>
          </label>
        </div>
      </header>

      <main id="main-content">
        <section className="hero-section">
  <div className="hero-copy">
    <p className="eyebrow">{t.eyebrow}</p>

    <h1>{t.title}</h1>

    <p>{t.description}</p>
  </div>

  <div className="hero-image">
    <img
      src="/images/dashboard-hero.png"
      alt="Government scheme eligibility services"
    />
  </div>
</section>

        <section
          className="checker-card"
          aria-labelledby="form-title"
        >
          <div className="checker-intro">
            <p className="eyebrow">{t.formTag}</p>

            <h2 id="form-title">
              {t.formTitle}
            </h2>

            <p>{t.formDescription}</p>

            <div className="privacy-note">
              <span aria-hidden="true">
                &#10003;
              </span>

              {t.privacy}
            </div>
          </div>

          <EligibilityForm
            language={language}
            loading={loading}
            onSubmit={handleEligibilityCheck}
          />
        </section>

        {error && (
          <section
            className="feedback-card error-card"
            role="alert"
          >
            <span aria-hidden="true">!</span>

            <div>
              <h2>{t.errorTitle}</h2>
              <p>{error}</p>
            </div>
          </section>
        )}

        {hasSearched &&
          !error &&
          (
            <section
              className="results-section"
              aria-live="polite"
              aria-labelledby="results-title"
            >
              {schemes.length ? (
                <>
                  <div className="printable-results">
                  <div className="results-heading">
                    <div>
                      <p className="eyebrow">
                        {schemes.length}{' '}
                        {schemes.length === 1
                          ? t.match
                          : t.matches}
                      </p>

                      <h2 id="results-title">
                        {t.resultTitle}
                      </h2>
                    </div>

                    <p>{t.resultHint}</p>
                  </div>

                  <div className="scheme-grid">
                    {schemes.map((scheme) => (
                      <SchemeCard
                        key={scheme.scheme_name}
                        scheme={scheme}
                        language={language}
                        matchReasons={scheme.match_reasons || []}
                      />
                    ))}
                  </div>
                  </div>

                  <div className="results-actions no-print">
                    <button type="button" onClick={shareEligibleSchemes}>
                      Share on WhatsApp
                    </button>
                    <button type="button" onClick={printResults}>
                      Download / Print results
                    </button>
                  </div>
                </>
              ) : (
                <div className="feedback-card empty-card">
                  <span aria-hidden="true">
                    &#8981;
                  </span>

                  <div>
                    <h2 id="results-title">
                      {t.noTitle}
                    </h2>

                    <p>{t.noText}</p>
                  </div>
                </div>
              )}

              {nearMisses.length > 0 && (
                <section
                  className="near-miss-section"
                  aria-labelledby="near-misses-title"
                >
                  <div className="results-heading near-miss-heading">
                    <div>
                      <p className="eyebrow">A little more to go</p>
                      <h2 id="near-misses-title">Almost eligible</h2>
                    </div>
                    <p>These schemes are close to matching your profile.</p>
                  </div>

                  <div className="scheme-grid">
                    {nearMisses.map((scheme) => (
                      <SchemeCard
                        key={scheme.scheme_name}
                        scheme={scheme}
                        language={language}
                        missReason={scheme.miss_reason}
                      />
                    ))}
                  </div>
                </section>
              )}
            </section>
          )}
        <section className="all-schemes-section">
  <div className="all-schemes-content">
    <p className="eyebrow">Government Scheme Directory</p>

    <h2>All Government Schemes</h2>

    <p>
      Explore government schemes available across education,
      agriculture, women welfare, housing, employment, and social welfare.
    </p>

    <button
      className="explore-schemes-button"
      onClick={() => onNavigate('/schemes')}
    >
      📋 Explore All Schemes →
    </button>
    <button
  className="saved-schemes-button"
  onClick={() => onNavigate('/saved-schemes')}
>
  ♡ Saved Schemes →
</button>
  </div>
</section>
        <aside className="disclaimer">
          <span aria-hidden="true">i</span>

          <div>
            <h2>{t.disclaimerTitle}</h2>
            <p>{t.disclaimer}</p>
          </div>
        </aside>
      </main>

      <footer>
        <span className="footer-mark">GOI</span>
        {t.footer}
      </footer>
    </div>
  )
}

function App() {
  const [path, setPath] = useState(
    window.location.pathname,
  )

  useEffect(() => {
    const updatePath = () => {
      setPath(window.location.pathname)
    }

    window.addEventListener('popstate', updatePath)

    return () => {
      window.removeEventListener('popstate', updatePath)
    }
  }, [])

  function navigate(destination) {
    window.history.pushState({}, '', destination)
    setPath(destination)
  }

  if (
    path === '/' ||
    path === '/login' ||
    path === '/login/'
  ) {
    return (
      <LoginPage
        onContinue={() => navigate('/dashboard')}
      />
    )
  }

  if (
    path === '/schemes' ||
    path === '/schemes/'
  ) {
    return (
      <AllSchemes
        onBack={() => navigate('/dashboard')}
      />
    )
  }
  if (
  path === '/saved-schemes' ||
  path === '/saved-schemes/'
) {
  return (
    <SavedSchemes
      onBack={() => navigate('/dashboard')}
    />
  )
}

  return <Dashboard onNavigate={navigate} />
}

export default App
