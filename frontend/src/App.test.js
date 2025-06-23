import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /login/i });
  expect(heading).toBeInTheDocument();
  const logout = screen.getByRole('link', { name: /logout/i });
  expect(logout).toBeInTheDocument();
});
