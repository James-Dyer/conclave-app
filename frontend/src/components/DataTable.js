import React, { useState } from 'react';
import '../styles/AdminDashboard.css';

export default function DataTable({
  columns = [],
  data = [],
  renderActions,
  loading = false,
  rowsPerPage = 10
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
            <tr key={row.id || JSON.stringify(row)}>
              {columns.map((c) => (
                <td key={c.accessor}>{row[c.accessor]}</td>
              ))}
              {renderActions && <td>{renderActions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={prev} disabled={page === 0}>
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button onClick={next} disabled={page >= totalPages - 1}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
