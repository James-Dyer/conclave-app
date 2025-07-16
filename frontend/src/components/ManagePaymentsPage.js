import '../styles/AdminDashboard.css';
import SecondaryButton from './SecondaryButton';

export default function ManagePaymentsPage({ onBack }) {
  return (
    <div className="admin-dashboard">
      <header className="admin-dash-header">
        <h1>Manage Payments</h1>
        {onBack && (
          <SecondaryButton onClick={onBack} className="back-button">
            Back
          </SecondaryButton>
        )}
      </header>
      <p>This page will be implemented later.</p>
    </div>
  );
}
