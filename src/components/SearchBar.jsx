import React from 'react';

export default function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search users..."
      className="form-control mb-2"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
