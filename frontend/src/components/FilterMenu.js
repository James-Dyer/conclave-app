import React from 'react';
import '../styles/FilterMenu.css';

export default function FilterMenu({
  statusOptions = [],
  selectedStatuses = [],
  tagOptions = [],
  selectedTags = [],
  onChangeStatuses,
  onChangeTags
}) {
  const toggleStatus = (status) => {
    const next = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    onChangeStatuses(next);
  };

  const toggleTag = (tag) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onChangeTags(next);
  };

  return (
    <div className="filter-menu">
      <div className="filter-section">
        <div>Status</div>
        {statusOptions.map((s) => (
          <label key={s}>
            <input
              type="checkbox"
              checked={selectedStatuses.includes(s)}
              onChange={() => toggleStatus(s)}
            />
            {s}
          </label>
        ))}
      </div>
      <div className="filter-section">
        <div>Tags</div>
        {tagOptions.map((t) => (
          <label key={t}>
            <input
              type="checkbox"
              checked={selectedTags.includes(t)}
              onChange={() => toggleTag(t)}
            />
            {t}
          </label>
        ))}
      </div>
    </div>
  );
}
