import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders login heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /login/i });
  expect(heading).toBeInTheDocument();
  const logout = screen.getByRole('link', { name: /logout/i });
  expect(logout).toBeInTheDocument();
});

test('view dashboard button shows dashboard', async () => {
  render(<App />);
  const btn = screen.getByRole('button', { name: /view dashboard/i });
  await userEvent.click(btn);
  const heading = screen.getByRole('heading', { name: /dashboard/i });
  expect(heading).toBeInTheDocument();
});
