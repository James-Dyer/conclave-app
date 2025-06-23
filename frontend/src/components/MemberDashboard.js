import React, { useEffect, useState } from 'react';
import ChargeList from './ChargeList';
import PaymentList from './PaymentList';
import '../styles/MemberDashboard.css';
import { fetchCharges, fetchPayments } from '../apiClient';

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
  onViewDetails = () => {},
}) {
  const [chargeData, setChargeData] = useState(charges);
  const [paymentData, setPaymentData] = useState(payments);

  useEffect(() => {
    async function loadData() {
      try {
        const [c, p] = await Promise.all([fetchCharges(), fetchPayments()]);
        if (c) {
          console.log('Charges from API:', c);
          setChargeData(c);
        }
        if (p) {
          console.log('Payments from API:', p);
          setPaymentData(p);
        }
      } catch (err) {
        console.error('API error', err);
      }
    }
    if (process.env.REACT_APP_TOKEN) {
      loadData();
    }
  }, []);

  return (
    <div className="member-dashboard">
      <h1>Dashboard</h1>
      <section>
        <h2>Outstanding Charges</h2>
        <ChargeList
          charges={chargeData}
          onRequestReview={onRequestReview}
          onViewDetails={onViewDetails}
        />
      </section>
      <section>
        <h2>Recent Payments</h2>
        <PaymentList payments={paymentData} />
      </section>
    </div>
  );
}
