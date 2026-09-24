import './About.css'

const REPORT_FORM_URL = 'https://forms.gle/F2gdThUbKQaEXdq18'

function About({ onBack }) {
  return (
    <div className="all-schemes-page about-page">
      <header className="schemes-header about-header">
        <button className="back-button" type="button" onClick={onBack}>
          &#8592; Back to Eligibility Checker
        </button>

        <div>
          <p className="schemes-eyebrow">SchemeSetu</p>
          <h1>About this site</h1>
          <p>
            A simple guide to finding government schemes that may fit your
            situation.
          </p>
        </div>
      </header>

      <main className="about-content">
        <section className="about-panel">
          <h2>What this site does</h2>
          <p>
            This site helps people find government schemes they may be eligible
            for. Enter your age, gender, state, income and occupation to see
            schemes that may fit your details.
          </p>
        </section>

        <section className="about-panel">
          <h2>How it works</h2>
          <ol className="about-steps">
            <li>
              <span>1</span>
              <div>
                <h3>Enter your details</h3>
                <p>Share the basic information requested in the form.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <h3>Review your matches</h3>
                <p>See matching schemes and the reasons they fit your details.</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <h3>Visit the official website</h3>
                <p>Open the scheme website to confirm the rules and apply.</p>
              </div>
            </li>
          </ol>
        </section>

        <section className="about-panel">
          <h2>Almost eligible</h2>
          <p>
            This section shows schemes you narrowly miss, such as being a few
            years outside an age range or slightly above an income limit.
          </p>
        </section>

        <section className="about-panel">
          <h2>About the data</h2>
          <p>
            The site currently lists 84 central and state schemes, with a focus
            on women, students, farmers and Telangana. It is not an official
            government website and is not affiliated with any government body.
          </p>
        </section>

        <section className="about-panel about-notice">
          <h2>Disclaimer</h2>
          <p>
            Scheme rules, amounts and dates can change often. Always confirm the
            details on the official website before applying.
          </p>
        </section>

        <section className="about-panel about-report-panel">
          <h2>Found a mistake?</h2>
          <p>Tell us if any scheme information needs correcting.</p>
          <a href={REPORT_FORM_URL} target="_blank" rel="noreferrer">
            Report wrong information
          </a>
        </section>
      </main>
    </div>
  )
}

export default About
