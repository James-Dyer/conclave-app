import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './components/SearchBar';
import { useState } from 'react';

test('renders with value and placeholder', () => {
  const handleChange = jest.fn();
  render(<SearchBar value="abc" onChange={handleChange} placeholder="Find" />);
  const input = screen.getByRole('textbox');
  expect(input).toHaveValue('abc');
  expect(input).toHaveAttribute('placeholder', 'Find');
});

test('calls onChange when typing', async () => {
  function Wrapper() {
    const [val, setVal] = useState('');
    return <SearchBar value={val} onChange={setVal} />;
  }
  render(<Wrapper />);
  const input = screen.getByRole('textbox');
  await userEvent.type(input, 'hi');
  expect(input).toHaveValue('hi');
});
