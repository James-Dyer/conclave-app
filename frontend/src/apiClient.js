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
    fetchMember: () => request('/member'),
    fetchCharges: () => request('/my-charges'),
    fetchPayments: () => request('/payments'),
    submitReview: (review) =>
      request('/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      }),

    // Admin
    fetchMembers: (search = '') => request(`/members?search=${encodeURIComponent(search)}`),
    createMember: (member) =>
      request('/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      }),
    updateMember: (id, member) =>
      request(`/admin/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      }),
    deleteMember: (id) =>
      request(`/admin/members/${id}`, { method: 'DELETE' }),

    fetchAllCharges: (search = '') => request(`/charges?search=${encodeURIComponent(search)}`),
    createCharge: (charge) =>
      request('/admin/charges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(charge)
      }),
    updateCharge: (id, charge) =>
      request(`/admin/charges/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(charge)
      }),
    deleteCharge: (id) =>
      request(`/admin/charges/${id}`, { method: 'DELETE' }),

    fetchReviews: () => request('/admin/reviews'),
    approveReview: (id) =>
      request(`/admin/reviews/${id}/approve`, { method: 'POST' }),
    rejectReview: (id) =>
      request(`/admin/reviews/${id}/reject`, { method: 'POST' })
  };
}

export default useApi;
