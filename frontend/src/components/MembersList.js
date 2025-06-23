import { useEffect, useState } from 'react';
import useApi from '../apiClient';
import '../styles/AdminDashboard.css';

export default function MembersList() {
  const api = useApi();
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await api.fetchMembers();
        setMembers(data || []);
      } catch (e) {
        setError(e.message);
      }
    }
    load();
  }, []);

  return (
    <div className="admin-dashboard">
      <header className="admin-dash-header">
        <h1>Members List</h1>
      </header>
      {error && <div className="error">{error}</div>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.isAdmin ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
