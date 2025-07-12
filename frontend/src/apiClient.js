import { useAuth } from './AuthContext';
import { useCallback, useMemo } from 'react';

// Use the deployed API directly without relying on an environment variable
const API_BASE = 'https://conclave-app.onrender.com/api';

export function useApi() {
  const { token } = useAuth();

  const withAuth = useCallback(
    (headers = {}) =>
      token ? { ...headers, Authorization: `Bearer ${token}` } : headers,
    [token]
  );

  const request = useCallback(
    async (path, options = {}, includeAuth = true) => {
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
    },
    [withAuth]
  );

  return useMemo(
    () => ({
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
      fetchMembers: (search = '') =>
        request(`/members?search=${encodeURIComponent(search)}`),
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

      fetchAllCharges: (search = '') =>
        request(`/charges?search=${encodeURIComponent(search)}`),
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
    }),
    [request]
  );
}

export default useApi;
