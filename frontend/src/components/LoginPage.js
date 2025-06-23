import { useState } from 'react';
import '../styles/LoginPage.css';
import useApi from '../apiClient';
import { useAuth } from '../AuthContext';

export default function LoginPage({ onLogin = () => {} }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setToken, setUser } = useAuth();
  const api = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await api.login(email, password);
      setToken(data.token);
      setUser(data.member);
      onLogin();
    } catch (err) {
      setError(err.message);
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
