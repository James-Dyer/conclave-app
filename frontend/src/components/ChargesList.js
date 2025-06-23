import { useEffect, useState } from 'react';
import useApi from '../apiClient';
import '../styles/AdminDashboard.css';

export default function ChargesList() {
  const api = useApi();
  const [charges, setCharges] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await api.fetchAllCharges();
        setCharges(data || []);
      } catch (e) {
        setError(e.message);
      }
    }
    load();
  }, []);

  return (
    <div className="admin-dashboard">
      <header className="admin-dash-header">
        <h1>Charge List</h1>
      </header>
      {error && <div className="error">{error}</div>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Member</th>
            <th>Status</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {charges.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.memberId}</td>
              <td>{c.status}</td>
              <td>{c.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
