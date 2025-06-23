import React from 'react';

export default function ChargeItem({ status, amount, dueDate }) {
  return (
    <tr className="charge-item">
      <td>{status}</td>
      <td>{amount}</td>
      <td>{new Date(dueDate).toLocaleDateString()}</td>
    </tr>
  );
}
