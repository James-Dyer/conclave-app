import { useAuth } from './AuthContext';

const API_BASE = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api`
  : '/api';

export function useApi() {
  const { token } = useAuth();

  function withAuth(headers = {}) {
    return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
  }

  async function request(path, options = {}, includeAuth = true) {
    const headers = includeAuth ? withAuth(options.headers) : options.headers;
    const opts = { ...options, headers };
    const res = await fetch(`${API_BASE}${path}`, opts);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'API request failed');
    }
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  return {
    login: (email, password) =>
      request(
        '/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        },
        false
      ),
    fetchCharges: () => request('/charges'),
    fetchPayments: () => request('/payments'),
    submitReview: (review) =>
      request('/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      })
  };
}

export default useApi;
