import { useState } from 'react';
import ChargesList from './ChargesList';
import '../styles/AdminDashboard.css';

export default function CreateCharges({ onBack }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="admin-dashboard">
      <header className="admin-dash-header">
        <h1>Create Charges</h1>
        {onBack && (
          <button onClick={onBack} className="back-button">Back</button>
        )}
      </header>
      <div>
        <button onClick={() => setShowForm(!showForm)}>Add Charge</button>
      </div>
      {showForm && (
        <div>
          <em>Charge creation form coming soon...</em>
        </div>
      )}
      <ChargesList />
    </div>
  );
}
