import React from 'react';

export default function ChargeItem({ id, status, amount, dueDate, onRequestReview = () => {} }) {
  return (
    <tr className="charge-item">
      <td>{status}</td>
      <td>{amount}</td>
      <td>{new Date(dueDate).toLocaleDateString()}</td>
      <td>
        <button type="button" onClick={() => onRequestReview({ id, amount })}>
          Request Review
        </button>
      </td>
    </tr>
  );
}
