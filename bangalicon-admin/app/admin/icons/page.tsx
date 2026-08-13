"use client";

import { useEffect, useState } from "react";
import EditIconModal from "@/components/EditIconModal";
import UploadModal from "@/components/UploadModal";

interface Icon {
  id: string;
  name: string;
  type: string;
  style: string;
  file: string;
  category_id?: string | null;
  category_name: string | null;
  tags: string[];
}

export default function IconsPage() {
  const [icons, setIcons] = useState<Icon[]>([]);
  const [filtered, setFiltered] = useState<Icon[]>([]);
  const [open, setOpen] = useState(false);
  const [editIcon, setEditIcon] = useState<Icon | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [style, setStyle] = useState("all");
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  const API = process.env.NEXT_PUBLIC_API_URL || "";
  const BASE_URL = API.replace("/api", "");

  const ensureIcons = (value: unknown): Icon[] => {
    if (!Array.isArray(value)) return [];

    return value.map((item) => ({
      ...item,
      tags: Array.isArray(item?.tags) ? item.tags : [],
    })) as Icon[];
  };

  const ensureCategories = (value: unknown) => (Array.isArray(value) ? value : []);

  const fetchIcons = async () => {
    try {
      const res = await fetch(`${API}/icons`);
      const data = await res.json();
      const safeData = ensureIcons(res.ok ? data : []);
      setIcons(safeData);
      setFiltered(safeData);
    } catch (error) {
      console.error(error);
      setIcons([]);
      setFiltered([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/categories`);
      const data = await res.json();
      setCategories(ensureCategories(res.ok ? data : []));
    } catch (error) {
      console.error(error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchIcons();
    fetchCategories();
  }, []);

  useEffect(() => {
    let result = icons;

    if (search) {
      result = result.filter(
        (icon) =>
          icon.name.toLowerCase().includes(search.toLowerCase()) ||
          icon.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (category !== "all") {
      result = result.filter((icon) => icon.category_name === category);
    }

    if (type !== "all") {
      result = result.filter((icon) => icon.type === type);
    }

    if (style !== "all") {
      result = result.filter((icon) => icon.style === style);
    }

    setFiltered(result);
  }, [search, category, type, style, icons]);

  const deleteIcon = async (id: string) => {
    if (!confirm("Delete this icon?")) return;

    await fetch(`${API}/icons/${id}`, {
      method: "DELETE",
    });

    fetchIcons();
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setType("all");
    setStyle("all");
  };

  return (
    <>
      <div className="admin-page">
        <section className="admin-page-header">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Library icons</h1>
            <p>Upload and manage icons.</p>
          </div>

          <button onClick={() => setOpen(true)} className="admin-button admin-button-primary">
            Upload icon
          </button>
        </section>

        <section className="admin-card p-4 md:p-5">
          <div className="grid gap-3 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
            <input
              placeholder="Search by icon name or tag"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="admin-select"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <select value={type} onChange={(e) => setType(e.target.value)} className="admin-select">
              <option value="all">All types</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>

            <select value={style} onChange={(e) => setStyle(e.target.value)} className="admin-select">
              <option value="all">All styles</option>
              <option value="regular">Regular</option>
              <option value="solid">Solid</option>
              <option value="brand">Brand</option>
            </select>

            <button onClick={clearFilters} className="admin-button admin-button-secondary">
              Clear filters
            </button>
          </div>
        </section>

        <section className="admin-card overflow-hidden">
          <div className="admin-page-header border-b border-[var(--line)] p-5">
            <div>
              <h2 className="text-2xl font-semibold">All icons</h2>
              <p>{filtered.length} items match the current filters.</p>
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="p-6 text-sm text-[var(--muted)]">No icons found for the current filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Preview</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Style</th>
                    <th>Tags</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((icon) => (
                    <tr key={icon.id}>
                      <td>
                        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[var(--line)] bg-[#f8f9fb]">
                          <img
                            src={`${BASE_URL}/uploads/${icon.file}`}
                            className="h-6 w-6 object-contain"
                            alt={icon.name}
                          />
                        </div>
                      </td>
                      <td className="font-medium">{icon.name}</td>
                      <td>{icon.category_name || "Unsorted"}</td>
                      <td>
                        <span className="admin-badge">{icon.type}</span>
                      </td>
                      <td>{icon.style}</td>
                      <td>
                        <div className="flex max-w-xs flex-wrap gap-2">
                          {icon.tags?.length ? (
                            icon.tags.map((tag, index) => (
                              <button
                                key={`${icon.id}-${tag}-${index}`}
                                onClick={() => setSearch(tag)}
                                className="rounded-full border border-[var(--line)] bg-[#f8f9fb] px-3 py-1 text-xs font-medium text-[var(--muted)]"
                              >
                                {tag}
                              </button>
                            ))
                          ) : (
                            <span className="text-sm text-[var(--muted)]">No tags</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditIcon(icon)}
                            className="admin-button admin-button-secondary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteIcon(icon.id)}
                            className="admin-button admin-button-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {editIcon && (
        <EditIconModal icon={editIcon} onClose={() => setEditIcon(null)} refresh={fetchIcons} />
      )}

      {open && (
        <UploadModal
          onClose={() => {
            setOpen(false);
            fetchIcons();
          }}
        />
      )}
    </>
  );
}
