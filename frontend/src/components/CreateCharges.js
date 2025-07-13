import '../styles/AdminDashboard.css';

export default function CreateCharges({ onBack }) {
  return (
    <div className="admin-dashboard">
      <header className="admin-dash-header">
        <h1>Create Charges</h1>
        {onBack && (
          <button onClick={onBack} className="back-button">Back</button>
        )}
      </header>
      <p>Charge assignment process coming soon.</p>
    </div>
  );
}
