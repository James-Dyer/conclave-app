import { useState } from 'react';
import useApi from '../apiClient';
import '../styles/AddMember.css';

export default function AddMember({ onCancel }) {
  const api = useApi();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email || !password || !name) {
      setError('Email, password and name are required');
      return;
    }
    try {
      await api.createMember({ email, password, name, isAdmin });
      setMessage('Member created');
      setEmail('');
      setPassword('');
      setName('');
      setIsAdmin(false);
      if (onCancel) onCancel();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="add-member-page">
      <h1>Add Member</h1>
      <form onSubmit={handleSubmit} className="add-member-form">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          Display Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />{' '}
          Admin
        </label>
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}
        <div className="form-actions">
          <button type="submit">Submit</button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="back-button">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
