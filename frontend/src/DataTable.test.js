import { render, screen } from '@testing-library/react';
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
