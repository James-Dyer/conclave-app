import { useState } from 'react';
import '../styles/LoginPage.css';
import useApi from '../apiClient';
import { useAuth } from '../AuthContext';
import { supabase } from '../supabaseClient';

export default function LoginPage({ onLogin = () => {} }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken, setUser } = useAuth();
  const api = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error || !data.session) {
        throw new Error(error ? error.message : 'Login failed');
      }
      const token = data.session.access_token;
      setToken(token);
      const res = await fetch('/api/member', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const member = await res.json();
      setUser(member);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? (
            <span className="spinner" aria-label="loading" />
          ) : (
            'Login'
          )}
        </button>
      </form>
    </div>
  );
}
