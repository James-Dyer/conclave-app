import React from 'react';
import ChargeItem from './ChargeItem';
import '../styles/ChargeList.css';

export default function ChargeList({ charges, onRequestReview = () => {} }) {
  if (!charges || charges.length === 0) {
    return <div className="charge-list-empty">No charges found.</div>;
  }

  return (
    <table className="charge-list">
      <thead>
        <tr>
          <th>Status</th>
          <th>Amount</th>
          <th>Due Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {charges.map((charge) => (
          <ChargeItem
            key={charge.id || `${charge.status}-${charge.dueDate}`}
            {...charge}
            onRequestReview={onRequestReview}
          />
        ))}
      </tbody>
    </table>
  );
}
