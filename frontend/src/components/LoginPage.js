import { useState } from 'react';
import '../styles/LoginPage.css';
import useApi from '../apiClient';
import { useAuth } from '../AuthContext';
import { supabase } from '../supabaseClient';
import PrimaryButton from './PrimaryButton';
import InfoDialog from './InfoDialog';
import logo from '../assets/images/UC-Merced-SigmaChi-ExpectMore.svg';

export default function LoginPage({ onLogin = () => {} }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailHelp, setShowEmailHelp] = useState(false);
  const { setToken, setUser } = useAuth();
  const api = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) console.error('Auth error:', authError);
      if (authError || !data.session) {
        throw new Error(authError ? authError.message : 'Login failed');
      }
      const token = data.session.access_token;
      setToken(token);
      const member = await api.fetchMember();
      setUser(member);
      localStorage.setItem('currentPage', 'dashboard');
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={logo} alt="Sigma Chi logo" className="login-logo" />
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email" className="visually-hidden">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
          />
          <label htmlFor="password" className="visually-hidden">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
          {error && <div className="error">{error}</div>}
          <PrimaryButton type="submit" disabled={loading} className="login-button">
            <span className={loading ? 'hidden-text' : undefined}>Login</span>
            {loading && <span className="spinner" aria-label="loading" />}
          </PrimaryButton>
        </form>
        <div className="forgot-links">
          <a
            href="#"
            className="forgot-link"
            onClick={(e) => {
              e.preventDefault();
              setShowEmailHelp(true);
            }}
          >
            Forgot Email?
          </a>
          <a href="#" className="forgot-link">
            Forgot Password?
          </a>
        </div>
        <InfoDialog
          open={showEmailHelp}
          title="Forgot Email?"
          onClose={() => setShowEmailHelp(false)}
        >
          <p>Instructions on how to find your email go here.</p>
        </InfoDialog>
      </div>
    </div>
  );
}
