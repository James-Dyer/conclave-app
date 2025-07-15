import { useState } from 'react';
import useApi from '../apiClient';
import ConfirmDialog from './ConfirmDialog';
import { useNotifications } from '../NotificationContext';
import '../styles/AddMember.css';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

export default function AddMember({ onCancel }) {
  const api = useApi();
  const { addNotification } = useNotifications();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('Active');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }
    const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRe.test(email)) {
      setError('Invalid email format');
      return;
    }
    try {
      await api.createMember({
        email,
        name,
        status,
        isAdmin
      });
      addNotification('Member added successfully.');
      setName('');
      setEmail('');
      setStatus('Active');
      setIsAdmin(false);
      if (onCancel) onCancel();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdminToggle = (e) => {
    if (e.target.checked) setShowConfirm(true);
    else setIsAdmin(false);
  };

  const confirmAdmin = () => {
    setIsAdmin(true);
    setShowConfirm(false);
  };
  const cancelAdmin = () => {
    setIsAdmin(false);
    setShowConfirm(false);
  };

  return (
    <div className="add-member-page">
      <h1>Add Member</h1>
      <form onSubmit={handleSubmit} className="add-member-form">
        <label>
          Full Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Active">Active</option>
            <option value="Alumni">Alumni</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
            <option value="Expelled">Expelled</option>
          </select>
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={handleAdminToggle}
          />{' '}
          Admin
        </label>
        {error && <div className="error">{error}</div>}
        <div className="form-actions">
          <PrimaryButton type="submit">Submit</PrimaryButton>
          {onCancel && (
            <SecondaryButton type="button" onClick={onCancel} className="back-button">
              Cancel
            </SecondaryButton>
          )}
        </div>
      </form>
      <ConfirmDialog
        open={showConfirm}
        title="Confirm Admin"
        onConfirm={confirmAdmin}
        onCancel={cancelAdmin}
      >
        <p>Grant administrative privileges to this user?</p>
      </ConfirmDialog>
    </div>
  );
}
