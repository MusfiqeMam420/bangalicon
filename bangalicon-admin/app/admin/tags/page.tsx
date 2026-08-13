"use client";

import { useEffect, useState } from "react";

interface TagItem {
  id: string;
  name: string;
}

export default function TagsPage() {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [name, setName] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL;

  const fetchTags = async () => {
    try {
      const res = await fetch(`${API}/tags`);
      const data = await res.json();
      setTags(Array.isArray(data) && res.ok ? data : []);
    } catch (error) {
      console.error(error);
      setTags([]);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const addTag = async () => {
    if (!name.trim()) return;

    await fetch(`${API}/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setName("");
    fetchTags();
  };

  const deleteTag = async (id: string) => {
    if (!confirm("Delete this tag?")) return;

    await fetch(`${API}/tags/${id}`, { method: "DELETE" });
    fetchTags();
  };

  return (
    <div className="admin-page">
      <section className="admin-page-header">
        <div>
          <div className="admin-badge mb-3">Search metadata</div>
          <h1 className="text-4xl font-semibold tracking-tight">Tags</h1>
          <p>Manage searchable labels that help users find icons faster.</p>
        </div>
      </section>

      <section className="admin-card p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New tag"
            className="admin-input"
          />
          <button onClick={addTag} className="admin-button admin-button-primary">
            Add tag
          </button>
        </div>
      </section>

      <section className="admin-card overflow-hidden">
        <div className="admin-page-header border-b border-[var(--line)] p-5">
          <div>
            <h2 className="text-2xl font-semibold">Tag list</h2>
            <p>{tags.length} tags available for content organization.</p>
          </div>
        </div>

        {tags.length === 0 ? (
          <p className="p-6 text-sm text-[var(--muted)]">No tags yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3 p-5">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-3 rounded-full border border-[var(--line)] bg-[#f8f9fb] px-4 py-2"
              >
                <span className="font-medium">{tag.name}</span>
                <button
                  onClick={() => deleteTag(tag.id)}
                  className="text-sm font-semibold text-[#a82020]"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
