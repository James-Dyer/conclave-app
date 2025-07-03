import React, { useEffect, useState } from 'react';
import ChargeList from './ChargeList';
import PaymentList from './PaymentList';
import '../styles/MemberDashboard.css';
import useApi from '../apiClient';
import { useAuth } from '../AuthContext';

export default function MemberDashboard({
  onRequestReview = () => {},
  onViewDetails = () => {},
}) {
  const [chargeData, setChargeData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const { token } = useAuth();

  useEffect(() => {
    window.api = api;
  }, [api]);

  // Load data from the API for the logged in member
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    async function load() {
      try {
        const [c, p] = await Promise.all([
          api.fetchCharges(),
          api.fetchPayments()
        ]);
        if (c) setChargeData(c);
        if (p) setPaymentData(p);
      } catch (err) {
        console.error('API error', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token, api]);


  // Render
  if (loading) {
    return <div>Loading…</div>;
  }

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
