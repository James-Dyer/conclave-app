import React from 'react';

export default function ChargeItem({
  id,
  status,
  amount,
  dueDate,
  onRequestReview = () => {},
  onViewDetails = () => {},
}) {
  return (
    <tr className="charge-item">
      <td>{status}</td>
      <td>{amount}</td>
      <td>{new Date(dueDate).toLocaleDateString()}</td>
      <td>
        <button type="button" onClick={() => onRequestReview({ id, amount })}>
        <button
          type="button"
          onClick={() => onViewDetails({ id, status, amount, dueDate })}
        >
          Details
        </button>
          Request Review
        </button>
      </td>
    </tr>
  );
}
