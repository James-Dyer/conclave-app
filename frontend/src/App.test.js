import { render, screen } from '@testing-library/react';
import App from './components/App';
import { AuthProvider } from './AuthContext';

function mockFetch() {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: async () => [] })
  );
}

beforeEach(() => {
  mockFetch();
});

afterEach(() => {
  localStorage.clear();
  jest.resetAllMocks();
});

function renderApp() {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

test('shows logout button when token present', () => {
  localStorage.setItem('authToken', 'token');
  localStorage.setItem('authUser', JSON.stringify({ id: 1 }));
  renderApp();
  expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
});

test('hides logout button when not logged in', () => {
  renderApp();
  expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
});
