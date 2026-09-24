import './ScamWarning.css'

function ScamWarning() {
  return (
    <aside className="scam-warning" role="note">
      <span className="scam-warning-icon" aria-hidden="true">
        &#9888;
      </span>
      <p>
        Be careful: government schemes never ask for money to apply. Apply only
        through the official website or your nearest government office. Do not
        share your OTP, bank PIN or passwords with anyone.
      </p>
    </aside>
  )
}

export default ScamWarning
