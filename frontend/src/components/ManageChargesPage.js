import { useState } from 'react';
import ChargesList from './ChargesList';
import ManageCharges from './ManageCharges';
import '../styles/AdminDashboard.css';

export default function ManageChargesPage({ onBack }) {
  const [creating, setCreating] = useState(false);
  if (creating) {
    return <ManageCharges onBack={() => setCreating(false)} />;
  }
  return (
    <div className="admin-dashboard">
      <header className="admin-dash-header">
        <h1>Manage Charges</h1>
        {onBack && (
          <button onClick={onBack} className="back-button">Back</button>
        )}
      </header>
      <button onClick={() => setCreating(true)}>Create Charge</button>
      <ChargesList />
    </div>
  );
}
