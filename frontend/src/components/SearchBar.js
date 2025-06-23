import React from 'react';
import '../styles/SearchBar.css';

export default function SearchBar({ value, onChange, placeholder = 'Search' }) {
  return (
    <input
      className="search-bar"
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
