import { filteredAndSorted } from './components/MembersList';

test('filters by status and tags', () => {
  const data = [
    { id: 1, name: 'A', status: 'Active', tags: ['Alpha'], amountOwed: 10 },
    { id: 2, name: 'B', status: 'Inactive', tags: ['Beta'], amountOwed: 20 }
  ];
  const result = filteredAndSorted(data, {
    sort: 'nameAsc',
    statusFilter: ['Active'],
    tagFilter: ['Alpha']
  });
  expect(result).toHaveLength(1);
  expect(result[0].id).toBe(1);
});

test('sorts by amount descending', () => {
  const data = [
    { id: 1, name: 'A', status: 'Active', amountOwed: 10 },
    { id: 2, name: 'B', status: 'Active', amountOwed: 30 }
  ];
  const result = filteredAndSorted(data, {
    sort: 'amountDesc',
    statusFilter: [],
    tagFilter: []
  });
  expect(result.map((r) => r.id)).toEqual([2, 1]);
});
