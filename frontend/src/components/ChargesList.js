import { useEffect, useState } from 'react';
import useApi from '../apiClient';
import SearchBar from './SearchBar';
import SortMenu from './SortMenu';
import FilterMenu from './FilterMenu';
import DataTable from './DataTable';
import '../styles/AdminDashboard.css';

const STATUS_OPTIONS = ['Outstanding', 'Paid', 'Delinquent', 'Under Review'];

const SORT_OPTIONS = [
  { label: 'Due ↑', value: 'dueAsc' },
  { label: 'Due ↓', value: 'dueDesc' },
  { label: 'Amount ↑', value: 'amountAsc' },
  { label: 'Amount ↓', value: 'amountDesc' }
];

export default function ChargesList() {
  const api = useApi();
  const [charges, setCharges] = useState([]);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('dueAsc');
  const [statusFilter, setStatusFilter] = useState([]);
  const [tagFilter, setTagFilter] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [c, m] = await Promise.all([
          api.fetchAllCharges(search),
          api.fetchMembers('')
        ]);
        setCharges(c || []);
        setMembers(m || []);
      } catch (e) {
        setError(e.message);
      }
    }
    load();
  }, [search]);

  function memberName(id) {
    const m = members.find((mem) => mem.id === id);
    return m ? m.name : id;
  }

  async function handleMarkPaid(id) {
    await api.updateCharge(id, { status: 'Paid' });
    setCharges(charges.map((c) => (c.id === id ? { ...c, status: 'Paid' } : c)));
  }

  async function handleDelete(id) {
    await api.deleteCharge(id);
    setCharges(charges.filter((c) => c.id !== id));
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-dash-header">
        <h1>Charge List</h1>
      </header>
      {error && <div className="error">{error}</div>}
      <div className="control-bar">
        <SearchBar value={search} onChange={setSearch} />
        <SortMenu options={SORT_OPTIONS} value={sort} onChange={setSort} />
      </div>
      <FilterMenu
        statusOptions={STATUS_OPTIONS}
        selectedStatuses={statusFilter}
        tagOptions={[...new Set(charges.flatMap((c) => c.tags || []))]}
        selectedTags={tagFilter}
        onChangeStatuses={setStatusFilter}
        onChangeTags={setTagFilter}
      />
      <DataTable
        columns={[
          { header: 'Member', accessor: 'memberName' },
          { header: 'Description', accessor: 'description' },
          { header: 'Amount', accessor: 'amount' },
          { header: 'Status', accessor: 'status' },
          { header: 'Due Date', accessor: 'dueDate' },
          { header: 'Tags', accessor: 'tags' }
        ]}
        data={prepareRows(charges, members, {
          sort,
          statusFilter,
          tagFilter
        })}
        renderActions={(row) => (
          <div className="action-buttons">
            {row.status !== 'Paid' && (
              <button onClick={() => handleMarkPaid(row.id)}>Mark Paid</button>
            )}
            <button onClick={() => handleDelete(row.id)}>Delete</button>
          </div>
        )}
      />
    </div>
  );
}

function prepareRows(charges, members, { sort, statusFilter, tagFilter }) {
  const getName = (id) => {
    const m = members.find((mem) => mem.id === id);
    return m ? m.name : id;
  };

  let rows = charges.map((c) => ({
    ...c,
    memberName: getName(c.memberId)
  }));

  if (statusFilter.length)
    rows = rows.filter((r) => statusFilter.includes(r.status));
  if (tagFilter.length)
    rows = rows.filter((r) => (r.tags || []).some((t) => tagFilter.includes(t)));

  switch (sort) {
    case 'dueDesc':
      rows = [...rows].sort((a, b) => b.dueDate.localeCompare(a.dueDate));
      break;
    case 'amountAsc':
      rows = [...rows].sort((a, b) => a.amount - b.amount);
      break;
    case 'amountDesc':
      rows = [...rows].sort((a, b) => b.amount - a.amount);
      break;
    default:
      rows = [...rows].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }
  return rows;
}
