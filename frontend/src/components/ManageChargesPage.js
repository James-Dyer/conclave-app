import { useState } from 'react';
import ChargesList from './ChargesList';
import ManageCharges from './ManageCharges';
import '../styles/AdminDashboard.css';
import SecondaryButton from './SecondaryButton';
import PrimaryButton from './PrimaryButton';

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
          <SecondaryButton onClick={onBack} className="back-button">
            Back
          </SecondaryButton>
        )}
      </header>
      <PrimaryButton onClick={() => setCreating(true)}>Create Charge</PrimaryButton>
      <ChargesList />
    </div>
  );
}
