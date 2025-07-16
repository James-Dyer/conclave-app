import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataTable from './components/DataTable';

test('renders table with rows and action buttons', () => {
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Amount', accessor: 'amount' }
  ];
  const data = [{ id: 1, name: 'Test', amount: 5 }];
  render(
    <DataTable
      columns={columns}
      data={data}
      renderActions={(row) => <button>Delete {row.id}</button>}
    />
  );
  expect(screen.getByText('Name')).toBeInTheDocument();
  expect(screen.getByText('Test')).toBeInTheDocument();
  expect(screen.getByText('Delete 1')).toBeInTheDocument();
});

test('paginates rows 10 at a time', async () => {
  const columns = [{ header: 'Name', accessor: 'name' }];
  const data = Array.from({ length: 15 }, (_, i) => ({ id: i, name: `Row ${i}` }));
  render(<DataTable columns={columns} data={data} />);
  // should only show first 10 rows initially
  expect(screen.getByText('Row 0')).toBeInTheDocument();
  expect(screen.queryByText('Row 10')).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /next/i }));
  expect(screen.getByText('Row 10')).toBeInTheDocument();
});

test('calls onRowClick when a row is clicked', async () => {
  const columns = [{ header: 'Name', accessor: 'name' }];
  const data = [{ id: 1, name: 'Row 1' }];
  const handle = jest.fn();
  render(<DataTable columns={columns} data={data} onRowClick={handle} />);
  const rows = screen.getAllByRole('row');
  await userEvent.click(rows[1]);
  expect(handle).toHaveBeenCalledWith(data[0]);
});
