"use client";

import { useState } from "react";

export default function FilterBar({ onSearch }: any) {
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <input
        type="text"
        placeholder="Search icons..."
        className="w-full px-4 py-2 border rounded-lg"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
      />

      <select className="px-4 py-2 border rounded-lg">
        <option>All</option>
        <option>Free</option>
        <option>Premium</option>
      </select>

      <select className="px-4 py-2 border rounded-lg">
        <option>All Categories</option>
        <option>UI</option>
        <option>Arrows</option>
        <option>Brands</option>
      </select>
    </div>
  );
}