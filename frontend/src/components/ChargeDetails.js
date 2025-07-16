import React from 'react';
import '../styles/ChargeDetails.css';
import SecondaryButton from './SecondaryButton';

const sampleCharge = {
  id: 1,
  status: 'Outstanding',
  amount: 500,
  partialAmountPaid: 0,
  dueDate: '2024-05-01',
  description: 'Semester dues',
  updatedAt: '2024-05-01',
};

export default function ChargeDetails({ charge, onRequestReview, onBack }) {
  const displayCharge = { ...sampleCharge, ...(charge || {}) };
  const statusDisplay =
    displayCharge.partialAmountPaid > 0
      ? `${displayCharge.status} ($${displayCharge.partialAmountPaid})`
      : displayCharge.status;

  return (
    <div className="charge-details-page">
      <h1>Charge Details</h1>

      <table className="charge-details-table">
        <tbody>
          <tr>
            <th>Status</th>
            <td>{statusDisplay}</td>
          </tr>
          <tr>
            <th>Amount</th>
            <td>{`$${displayCharge.amount}`}</td>
          </tr>
          <tr>
            <th>Due Date</th>
            <td>{new Date(displayCharge.dueDate).toLocaleDateString()}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>{displayCharge.description || '-'}</td>
          </tr>
          <tr>
            <th>Last Updated</th>
            <td>
              {displayCharge.updatedAt
                ? new Date(displayCharge.updatedAt).toLocaleString()
                : '-'}
            </td>
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
