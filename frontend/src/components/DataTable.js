import React, { useState } from 'react';
import '../styles/AdminDashboard.css';
import SecondaryButton from './SecondaryButton';

export default function DataTable({
  columns = [],
  data = [],
  renderActions,
  loading = false,
  rowsPerPage = 10,
  onRowClick
}) {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(data.length / rowsPerPage) || 1;
  const start = page * rowsPerPage;
  const visibleRows = data.slice(start, start + rowsPerPage);

  function prev() {
    setPage((p) => Math.max(p - 1, 0));
  }

  function next() {
    setPage((p) => Math.min(p + 1, totalPages - 1));
  }

  return (
    <div className="data-table-wrapper">
      {loading && (
        <div className="loading-overlay">
          <span className="spinner" aria-label="loading" />
        </div>
      )}
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.accessor}>{c.header}</th>
            ))}
            {renderActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => (
            <tr
              key={row.id || JSON.stringify(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={onRowClick ? 'clickable-row' : undefined}
            >
              {columns.map((c) => {
                const value = row[c.accessor];
                const isMoney =
                  typeof value === 'number' &&
                  c.header.toLowerCase().includes('amount');
                const display = isMoney ? `$${value}` : value;
                return <td key={c.accessor}>{display}</td>;
              })}
              {renderActions && <td>{renderActions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="pagination">
          <SecondaryButton onClick={prev} disabled={page === 0}>
            Previous
          </SecondaryButton>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <SecondaryButton onClick={next} disabled={page >= totalPages - 1}>
            Next
          </SecondaryButton>
        </div>
      )}
    </div>
  );
}
