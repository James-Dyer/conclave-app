import { prepareRows } from './components/ChargesList';

test('filters and sorts charges', () => {
  const charges = [
    { id: 1, memberId: 1, amount: 30, status: 'Paid', dueDate: '2024-01-01', tags: ['A'] },
    { id: 2, memberId: 2, amount: 10, status: 'Outstanding', dueDate: '2024-02-01', tags: ['B'] }
  ];
  const members = [
    { id: 1, name: 'Z' },
    { id: 2, name: 'A' }
  ];
  const result = prepareRows(charges, members, {
    sort: 'amountAsc',
    statusFilter: ['Outstanding'],
    tagFilter: []
  });
  expect(result).toHaveLength(1);
  expect(result[0].memberName).toBe('A');
});
