import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './components/App';
import { AuthProvider } from './AuthContext';

function mockFetch() {
  global.fetch = jest.fn((url) => {
    if (url.endsWith('/my-charges')) {
      return Promise.resolve({
        ok: true,
        json: async () => [
          { id: 1, status: 'Outstanding', amount: 200, dueDate: '2024-05-01' }
        ]
      });
    }
    if (url.endsWith('/payments')) {
      return Promise.resolve({ ok: true, json: async () => [] });
    }
    return Promise.resolve({ ok: true, json: async () => [] });
  });
}

beforeEach(() => {
  localStorage.setItem('authToken', 'token');
  localStorage.setItem('authUser', JSON.stringify({ id: 1 }));
  mockFetch();
});

afterEach(() => {
  localStorage.clear();
  jest.resetAllMocks();
});

test('renders login heading and header buttons', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  const heading = screen.getByRole('heading', { name: /login/i });
  expect(heading).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /payment review/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /charge details/i })).toBeInTheDocument();
  const loginButtons = screen.getAllByRole('button', { name: /^login$/i });
  expect(loginButtons.length).toBeGreaterThan(0);
  const logout = screen.getByRole('button', { name: /logout/i });
  expect(logout).toBeInTheDocument();
});

test('header dashboard button shows dashboard', async () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  const btn = screen.getByRole('button', { name: /dashboard/i });
  await userEvent.click(btn);
  const heading = await screen.findByRole('heading', { name: /dashboard/i });
  expect(heading).toBeInTheDocument();
});

test('header payment review button shows form', async () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  const btn = screen.getByRole('button', { name: /payment review/i });
  await userEvent.click(btn);
  const heading = await screen.findByRole('heading', { name: /payment review/i });
  expect(heading).toBeInTheDocument();
});

test('header charge details button shows page', async () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  const btn = screen.getByRole('button', { name: /charge details/i });
  await userEvent.click(btn);
  const heading = screen.getByRole('heading', { name: /charge details/i });
  expect(heading).toBeInTheDocument();
});

test('header login button shows login page', async () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  await userEvent.click(screen.getByRole('button', { name: /dashboard/i }));
  await userEvent.click(screen.getByRole('button', { name: /^login$/i }));
  const heading = screen.getByRole('heading', { name: /login/i });
  expect(heading).toBeInTheDocument();
});

test('dashboard review button opens form with charge data', async () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  await userEvent.click(screen.getByRole('button', { name: /dashboard/i }));
  const reviewButton = await screen.findByRole('button', { name: /mark as paid/i });
  await userEvent.click(reviewButton);
  const heading = await screen.findByRole('heading', { name: /payment review/i });
  expect(heading).toBeInTheDocument();
  expect(screen.getByText(/description:/i)).toBeInTheDocument();
});

test('dashboard tile review button opens form', async () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  await userEvent.click(screen.getByRole('button', { name: /dashboard/i }));
  const button = await screen.findByTestId('dashboard-review-button');
  await userEvent.click(button);
  const heading = await screen.findByRole('heading', { name: /payment review/i });
  expect(heading).toBeInTheDocument();
});

test('dashboard details button opens details page then review form', async () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  await userEvent.click(screen.getByRole('button', { name: /dashboard/i }));
  const detailButtons = await screen.findAllByRole('button', { name: /details/i });
  await userEvent.click(detailButtons[0]);
  const detailHeading = await screen.findByRole('heading', { name: /charge details/i });
  expect(detailHeading).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /mark as paid/i })).not.toBeInTheDocument();
});

test('charge details back button returns to dashboard', async () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  await userEvent.click(screen.getByRole('button', { name: /dashboard/i }));
  const detailButtons = await screen.findAllByRole('button', { name: /details/i });
  await userEvent.click(detailButtons[0]);
  const backButton = screen.getByRole('button', { name: /back/i });
  await userEvent.click(backButton);
  const heading = await screen.findByRole('heading', { name: /dashboard/i });
  expect(heading).toBeInTheDocument();
});
