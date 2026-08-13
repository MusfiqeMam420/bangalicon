"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) && res.ok ? data : []);
    } catch (err) {
      console.error(err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      await fetch(`${API}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      setName("");
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteCategory = async (id: string) => {
    try {
      await fetch(`${API}/categories/${id}`, {
        method: "DELETE",
      });

      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-page">
      <section className="admin-page-header">
        <div>
          <div className="admin-badge mb-3">Taxonomy</div>
          <h1 className="text-4xl font-semibold tracking-tight">Categories</h1>
          <p>Create and maintain the main groups used across the icon library.</p>
        </div>
      </section>

      <section className="admin-card p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            type="text"
            placeholder="New category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="admin-input"
          />
          <button
            onClick={addCategory}
            disabled={loading}
            className="admin-button admin-button-primary"
          >
            {loading ? "Adding..." : "Add category"}
          </button>
        </div>
      </section>

      <section className="admin-card overflow-hidden">
        <div className="admin-page-header border-b border-[var(--line)] p-5">
          <div>
            <h2 className="text-2xl font-semibold">Category list</h2>
            <p>{categories.length} categories currently available.</p>
          </div>
        </div>

        {categories.length === 0 ? (
          <p className="p-6 text-sm text-[var(--muted)]">No categories found.</p>
        ) : (
          <ul className="divide-y divide-[var(--line)]">
            {categories.map((category) => (
              <li key={category.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div>
                  <p className="font-semibold">{category.name}</p>
                  <p className="text-sm text-[var(--muted)]">Used for browse and filter organization.</p>
                </div>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="admin-button admin-button-danger"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
