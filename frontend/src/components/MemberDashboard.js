import React from 'react';
import ChargeList from './ChargeList';
import PaymentList from './PaymentList';
import '../styles/MemberDashboard.css';

const sampleCharges = [
  { id: 1, status: 'Outstanding', amount: '$200', dueDate: '2024-05-01' },
  { id: 2, status: 'Paid', amount: '$100', dueDate: '2024-04-01' }
];

const samplePayments = [
  { id: 1, amount: '$100', date: '2024-04-15', memo: 'Dues' }
];

export default function MemberDashboard({
  charges = sampleCharges,
  payments = samplePayments,
  onRequestReview = () => {},
}) {
  return (
    <div className="member-dashboard">
      <h1>Dashboard</h1>
      <section>
        <h2>Outstanding Charges</h2>
        <ChargeList charges={charges} onRequestReview={onRequestReview} />
      </section>
      <section>
        <h2>Recent Payments</h2>
        <PaymentList payments={payments} />
      </section>
    </div>
  );
}
