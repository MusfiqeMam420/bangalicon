"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type IconRecord = {
  id: string;
  name: string;
  category_id?: string | null;
  type: string;
  style: string;
  tags?: string[];
};

type Category = {
  id: string;
  name: string;
};

export default function EditIconModal({
  icon,
  onClose,
  refresh,
}: {
  icon: IconRecord;
  onClose: () => void;
  refresh: () => void | Promise<void>;
}) {
  const [name, setName] = useState(icon.name);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>(icon.category_id ? String(icon.category_id) : "");
  const [type, setType] = useState(icon.type);
  const [style, setStyle] = useState(icon.style);
  const [tags, setTags] = useState<string[]>(icon.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    fetch(`${API}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error(error);
        setCategories([]);
      });
  }, [API]);

  useEffect(() => {
    setName(icon.name);
    setFile(null);
    setCategory(icon.category_id ? String(icon.category_id) : "");
    setType(icon.type);
    setStyle(icon.style);
    setTags(icon.tags ?? []);
    setTagInput("");
  }, [icon]);

  const handleTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    e.preventDefault();
    const value = tagInput.trim().toLowerCase();

    if (!value || tags.includes(value)) {
      setTagInput("");
      return;
    }

    setTags((prev) => [...prev, value]);
    setTagInput("");
  };

  const removeTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("category", category);
    formData.append("type", type);
    formData.append("style", style);
    formData.append("tags", JSON.stringify(tags));

    if (file) {
      formData.append("icon", file);
    }

    try {
      const res = await fetch(`${API}/icons/${icon.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Update failed" }));
        throw new Error(error.message || "Update failed");
      }

      await refresh();
      onClose();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-backdrop fixed inset-0 z-50 grid place-items-center p-4 backdrop-blur-sm">
      <div className="admin-card w-full max-w-xl p-6">
        <div className="mb-5">
          <div className="admin-badge mb-3">Edit icon</div>
          <h2 className="text-3xl font-semibold">Update asset</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Adjust naming, category, access type, style, tags, or replace the SVG file.
          </p>
        </div>

        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="admin-input"
            placeholder="Icon name"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="admin-select w-full"
          >
            <option value="">Select category</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <div className="grid gap-3 sm:grid-cols-2">
            <select value={type} onChange={(e) => setType(e.target.value)} className="admin-select w-full">
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>

            <select value={style} onChange={(e) => setStyle(e.target.value)} className="admin-select w-full">
              <option value="regular">Regular</option>
              <option value="solid">Solid</option>
            </select>
          </div>

          <div className="rounded-[1.25rem] border border-[var(--line)] bg-[#f8f9fb] p-4">
            <label className="mb-2 block text-sm font-semibold">Tags</label>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKey}
              placeholder="Type a tag and press Enter"
              className="admin-input"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-medium text-[#111111]"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(index)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-[var(--line)] bg-[#f8f9fb] p-4">
            <label className="mb-2 block text-sm font-semibold">Replace SVG</label>
            <input type="file" accept=".svg" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="admin-button admin-button-secondary">
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="admin-button admin-button-primary"
          >
            {loading ? "Updating..." : "Update icon"}
          </button>
        </div>
      </div>
    </div>
  );
}
