import React from 'react';
import '../styles/ChargeDetails.css';
import SecondaryButton from './SecondaryButton';

const sampleCharge = {
  id: 1,
  status: 'Outstanding',
  amount: '$500',
  dueDate: '2024-05-01',
  description: 'Semester dues',
};

export default function ChargeDetails({ charge, onRequestReview, onBack }) {
  const displayCharge = { ...sampleCharge, ...(charge || {}) };

  return (
    <div className="charge-details-page">
      <h1>Charge Details</h1>

      <table className="charge-details-table">
        <tbody>
          <tr>
            <th>Status</th>
            <td>{displayCharge.status}</td>
          </tr>
          <tr>
            <th>Amount</th>
            <td>{displayCharge.amount}</td>
          </tr>
          <tr>
            <th>Due Date</th>
            <td>{new Date(displayCharge.dueDate).toLocaleDateString()}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>{displayCharge.description || '-'}</td>
          </tr>
        </tbody>
      </table>

      <div className="charge-actions">
        {onBack && (
          <SecondaryButton type="button" onClick={onBack} className="back-button">
            Back
          </SecondaryButton>
        )}
      </div>
    </div>
  );
}
