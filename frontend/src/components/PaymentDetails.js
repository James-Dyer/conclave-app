import React from 'react';
import '../styles/PaymentDetails.css';
import SecondaryButton from './SecondaryButton';

const samplePayment = {
  id: 1,
  amount: '$100',
  date: '2024-05-01',
  memo: 'Dues',
  status: 'Approved',
  adminNote: ''
};

export default function PaymentDetails({ payment, onBack }) {
  const display = { ...samplePayment, ...(payment || {}) };
  return (
    <div className="payment-details-page">
      <h1>Payment Details</h1>
      <table className="payment-details-table">
        <tbody>
          <tr>
            <th>Amount</th>
            <td>{display.amount}</td>
          </tr>
          <tr>
            <th>Paid On</th>
            <td>{new Date(display.date).toLocaleDateString()}</td>
          </tr>
          <tr>
            <th>Status</th>
            <td>{display.status}</td>
          </tr>
          <tr>
            <th>Memo</th>
            <td>{display.memo || '-'}</td>
          </tr>
          <tr>
            <th>Admin Note</th>
            <td>{display.adminNote || '-'}</td>
          </tr>
        </tbody>
      </table>
      <div className="payment-actions">
        {onBack && (
          <SecondaryButton type="button" onClick={onBack} className="back-button">
            Back
          </SecondaryButton>
        )}
      </div>
    </div>
  );
}
