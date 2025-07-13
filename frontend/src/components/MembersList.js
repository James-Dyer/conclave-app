import { useEffect, useState } from 'react';
import useApi from '../apiClient';
import { useAuth } from '../AuthContext';
import SearchBar from './SearchBar';
import SortMenu from './SortMenu';
import FilterMenu from './FilterMenu';
import DataTable from './DataTable';
import '../styles/AdminDashboard.css';

const STATUS_OPTIONS = ['Active', 'Alumni', 'Inactive', 'Suspended', 'Expelled'];

const SORT_OPTIONS = [
  { label: 'Name A→Z', value: 'nameAsc' },
  { label: 'Name Z→A', value: 'nameDesc' },
  { label: 'Initiation Date', value: 'initAsc' },
  { label: 'Amount Owed', value: 'amountDesc' }
];

export default function MembersList({ onBack, onAdd }) {
  const api = useApi();
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('nameAsc');
  const [statusFilter, setStatusFilter] = useState([]);
  const [tagFilter, setTagFilter] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = user?.isAdmin
          ? await api.fetchAdminMembers(search)
          : await api.fetchMembers(search);
        setMembers(data || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search, user]);

  return (
    <div className="admin-dashboard">
      <header className="admin-dash-header">
        <h1>Members List</h1>
        <div className="action-buttons">
          {onBack && (
            <button onClick={onBack} className="back-button">Back</button>
          )}
          {onAdd && (
            <button onClick={onAdd} className="add-button">Add Member</button>
          )}
        </div>
      </header>
      {error && <div className="error">{error}</div>}
      <div className="control-bar">
        <SearchBar value={search} onChange={setSearch} />
        <SortMenu options={SORT_OPTIONS} value={sort} onChange={setSort} />
      </div>
      <FilterMenu
        statusOptions={STATUS_OPTIONS}
        selectedStatuses={statusFilter}
        tagOptions={[...new Set(members.flatMap((m) => m.tags || []))]}
        selectedTags={tagFilter}
        onChangeStatuses={setStatusFilter}
        onChangeTags={setTagFilter}
      />
      <DataTable
        loading={loading}
        columns={[
          { header: 'Name', accessor: 'name' },
          { header: 'Email', accessor: 'email' },
          { header: 'Status', accessor: 'status' },
          { header: 'Initiation Date', accessor: 'initiationDate' },
          { header: 'Amount Owed', accessor: 'amountOwed' },
          { header: 'Tags', accessor: 'tags' }
        ]}
        data={filteredAndSorted(members, {
          search,
          sort,
          statusFilter,
          tagFilter
        })}
      />
    </div>
  );
}

export function filteredAndSorted(data, { sort, statusFilter, tagFilter }) {
  let rows = data;
  if (statusFilter.length)
    rows = rows.filter((m) => statusFilter.includes(m.status));
  if (tagFilter.length)
    rows = rows.filter((m) => (m.tags || []).some((t) => tagFilter.includes(t)));

  switch (sort) {
    case 'nameDesc':
      rows = [...rows].sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'initAsc':
      rows = [...rows].sort((a, b) =>
        (a.initiationDate || '').localeCompare(b.initiationDate || '')
      );
      break;
    case 'amountDesc':
      rows = [...rows].sort((a, b) => (b.amountOwed || 0) - (a.amountOwed || 0));
      break;
    default:
      rows = [...rows].sort((a, b) => a.name.localeCompare(b.name));
  }
  return rows;
}
