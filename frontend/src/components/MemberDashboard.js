import React, { useEffect, useState } from 'react';
import ChargeList from './ChargeList';
import PaymentList from './PaymentList';
import '../styles/MemberDashboard.css';
import useApi from '../apiClient';
import { useAuth } from '../AuthContext';
import mockData from '../../../mockData.json';

const sampleCharges = mockData.charges.filter((c) => c.memberId === 1);

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
  const api = useApi();
  const { token } = useAuth();

  useEffect(() => {
    async function loadData() {
      try {
        const [c, p] = await Promise.all([api.fetchCharges(), api.fetchPayments()]);
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
    if (token) {
      loadData();
    }
  }, [token]);

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
