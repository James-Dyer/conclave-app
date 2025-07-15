import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ManageCharges from './components/ManageCharges';
import { AuthProvider } from './AuthContext';

function setup() {
  localStorage.setItem('authToken', 'token');
  localStorage.setItem('authUser', JSON.stringify({ id: 1 }));
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: async () => [] }));
  render(
    <AuthProvider>
      <ManageCharges />
    </AuthProvider>
  );
}

afterEach(() => {
  localStorage.clear();
  jest.resetAllMocks();
});

test('description placeholder shows current year', () => {
  setup();
  const year = new Date().getFullYear();
  const textarea = screen.getByLabelText(/description/i);
  expect(textarea).toHaveAttribute('placeholder', `e.g. Membership Dues - Spring ${year}`);
});

test('shows error for non-numeric amount', async () => {
  setup();
  const input = screen.getByLabelText(/amount/i);
  await userEvent.type(input, '$200');
  expect(await screen.findByText(/amount must be a number/i)).toBeInTheDocument();
});
