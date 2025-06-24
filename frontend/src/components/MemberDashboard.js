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
  const [loadingMock, setLoadingMock] = useState(true);
  const api = useApi();
  const { token, user } = useAuth(); 
  const memberId = user?.id;

  useEffect(() => {
    window.api = api;
  }, [api]);

  // Load mockData.json as fallback or initial data
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/mockData.json`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        const charges = (data.charges || []).filter(c => c.memberId === memberId);
        const payments = (data.payments || []).filter(p => p.memberId === memberId);
        setChargeData(charges);
        setPaymentData(payments);
      })
      .catch(err => console.error('Error loading mockData.json', err))
      .finally(() => setLoadingMock(false));
  }, [memberId]);  // ← run again whenever memberId changes

  // Then overwrite with real API data if logged in
  useEffect(() => {
    if (!token) return;
    async function loadFromApi() {
      try {
        const [c, p] = await Promise.all([
          api.fetchCharges(),
          api.fetchPayments(),
        ]);
        if (c) setChargeData(c);
        if (p) setPaymentData(p);
      } catch (err) {
        console.error('API error', err);
      }
    }
    loadFromApi();
  }, [token]);

  // Render
  if (loadingMock) {
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