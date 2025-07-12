import React from 'react';
import ChargeItem from './ChargeItem';
import '../styles/ChargeList.css';

export default function ChargeList({
  charges,
  onRequestReview = () => {},
  onViewDetails = () => {},
  pendingReviewIds = [],
}) {
  const visible = (charges || []).filter(
    (c) => c.status !== 'Paid' && c.status !== 'Deleted by Admin'
  );

  if (visible.length === 0) {
    return <div className="charge-list-empty">No charges found.</div>;
  }

  return (
    <table className="charge-list">
      <thead>
        <tr>
          <th>Description</th>
          <th>Original Amount</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Partial Amount Paid</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {visible.map((charge) => (
          <ChargeItem
            key={charge.id || `${charge.status}-${charge.dueDate}`}
            {...charge}
            onRequestReview={onRequestReview}
            onViewDetails={onViewDetails}
            pending={pendingReviewIds.includes(charge.id)}
          />
        ))}
      </tbody>
    </table>
  );
}
