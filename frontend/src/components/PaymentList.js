import React from 'react';
import '../styles/PaymentList.css';

export default function PaymentList({ payments }) {
  if (!payments || payments.length === 0) {
    return <div className="payment-list-empty">No payments found.</div>;
  }

  return (
    <table className="payment-list">
      <thead>
        <tr>
          <th>Amount Paid</th>
          <th>Paid Date</th>
          <th>Memo</th>
          <th>Status</th>
          <th>Admin Note</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((p) => (
          <tr key={p.id || `${p.amount}-${p.date}`}>
            <td>{p.amount}</td>
            <td>{new Date(p.date).toLocaleDateString()}</td>
            <td>{p.memo || '-'}</td>
            <td>{p.status}</td>
            <td>{p.adminNote || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
