"use client";

import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";

type Category = {
  id: string;
  name: string;
};

export default function UploadModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [type, setType] = useState("free");
  const [style, setStyle] = useState("regular");
  const [sheetFile, setSheetFile] = useState<File | null>(null);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || "";
  const templateCsv = "/demo/bulk-icon-upload-template.csv";
  const templateXlsx = "/demo/bulk-icon-upload-template.xlsx";

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type !== "image/svg+xml") {
      alert("Only SVG allowed!");
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setName(selectedFile.name.replace(".svg", ""));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      handleFile(dropped);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      handleFile(selected);
    }
  };

  const handleSheetInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setSheetFile(selected);
  };

  const handleBulkIconsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []).filter(
      (item) => item.type === "image/svg+xml" || item.name.toLowerCase().endsWith(".svg")
    );
    setBulkFiles(selected);
  };

  const handleBulkIconsDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const selected = Array.from(e.dataTransfer.files ?? []).filter(
      (item) => item.type === "image/svg+xml" || item.name.toLowerCase().endsWith(".svg")
    );
    setBulkFiles(selected);
  };

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
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleUpload = async () => {
    if (!file) {
      alert("Upload file first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("icon", file);
    formData.append("name", name.trim());
    formData.append("category", category);
    formData.append("tags", JSON.stringify(tags));
    formData.append("type", type);
    formData.append("style", style);

    try {
      const res = await fetch(`${API}/icons`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Upload failed" }));
        throw new Error(error.message || "Upload failed");
      }

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setFile(null);
      setPreview("");
      setName("");
      setCategory("");
      setTags([]);
      setTagInput("");
      setType("free");
      setStyle("regular");

      onClose();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!sheetFile) {
      alert("Upload the sheet file first");
      return;
    }

    if (!bulkFiles.length) {
      alert("Upload the SVG files first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("sheet", sheetFile);
    bulkFiles.forEach((iconFile) => {
      formData.append("icons", iconFile);
    });

    try {
      const res = await fetch(`${API}/icons/bulk`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Bulk upload failed" }));
        throw new Error(error.message || "Bulk upload failed");
      }

      setSheetFile(null);
      setBulkFiles([]);
      onClose();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Bulk upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-backdrop fixed inset-0 z-50 grid place-items-center p-4 backdrop-blur-sm">
      <div className="admin-card w-full max-w-3xl p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="admin-badge mb-3">Upload workflow</div>
            <h2 className="text-3xl font-semibold">
              {mode === "single" ? "Add new icon" : "Bulk import icons"}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {mode === "single"
                ? "Upload an SVG, assign its metadata, and publish it into the library."
                : "Import a sheet and matching SVG files in one pass."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="admin-button admin-button-secondary h-11 w-11 rounded-full p-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-6 inline-flex rounded-full border border-[var(--line)] bg-[#f8f9fb] p-1">
          <button
            type="button"
            onClick={() => setMode("single")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "single" ? "bg-[#111111] text-white" : "text-[var(--muted)]"
            }`}
          >
            Single upload
          </button>
          <button
            type="button"
            onClick={() => setMode("bulk")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "bulk" ? "bg-[#111111] text-white" : "text-[var(--muted)]"
            }`}
          >
            Bulk by sheet
          </button>
        </div>

        {mode === "single" ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="rounded-[1.5rem] border border-dashed border-[var(--line)] bg-[#f8f9fb] p-6"
            >
              <div className="grid min-h-[270px] place-items-center rounded-[1.25rem] bg-white p-6 text-center">
                {preview ? (
                  <img src={preview} className="max-h-28" alt="Icon preview" />
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-dark)]">
                      <Upload size={24} />
                    </div>
                    <div>
                      <p className="font-semibold">Drop SVG here</p>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        Or choose a file manually from your computer.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <input type="file" accept=".svg" onChange={handleFileInput} className="mt-4 block w-full text-sm" />
            </div>

            <div className="space-y-4">
              <input
                className="admin-input"
                placeholder="Icon name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <select className="admin-select w-full" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select category</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <div className="grid gap-3 sm:grid-cols-2">
                <select className="admin-select w-full" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                </select>

                <select className="admin-select w-full" value={style} onChange={(e) => setStyle(e.target.value)}>
                  <option value="regular">Regular</option>
                  <option value="solid">Solid</option>
                  <option value="brand">Brand</option>
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
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[1.5rem] border border-[var(--line)] bg-[#f8f9fb] p-5">
              <h3 className="text-xl font-semibold">1. Upload your sheet</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Use the first sheet and include columns like <strong>name</strong>, <strong>file</strong>,{" "}
                <strong>category</strong>, <strong>type</strong>, <strong>style</strong>, and <strong>tags</strong>.
              </p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleSheetInput}
                className="mt-4 block w-full text-sm"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={templateCsv}
                  download
                  className="admin-button admin-button-secondary"
                >
                  Download CSV template
                </a>
                <a
                  href={templateXlsx}
                  download
                  className="admin-button admin-button-secondary"
                >
                  Download Excel template
                </a>
              </div>
              <div className="mt-4 rounded-[1.25rem] bg-white p-4 text-sm text-[var(--muted)]">
                {sheetFile ? `Sheet ready: ${sheetFile.name}` : "No sheet selected yet."}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--line)] bg-[#f8f9fb] p-5">
              <h3 className="text-xl font-semibold">2. Upload matching SVG files</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                The <strong>file</strong> column in your sheet should match the SVG file names you upload here.
              </p>
              <div
                onDrop={handleBulkIconsDrop}
                onDragOver={(e) => e.preventDefault()}
                className="mt-4 rounded-[1.25rem] border border-dashed border-[var(--line)] bg-white p-5 text-center"
              >
                <div className="space-y-3">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-dark)]">
                    <Upload size={22} />
                  </div>
                  <div>
                    <p className="font-semibold">Drop many SVG files here</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      You can also choose many files at once or pick a folder if your browser supports it.
                    </p>
                  </div>
                </div>
              </div>
              <input
                type="file"
                accept=".svg"
                multiple
                onChange={handleBulkIconsInput}
                className="mt-4 block w-full text-sm"
              />
              <input
                type="file"
                accept=".svg"
                multiple
                {...({ webkitdirectory: "", directory: "" } as React.InputHTMLAttributes<HTMLInputElement>)}
                onChange={handleBulkIconsInput}
                className="mt-3 block w-full text-sm"
              />
              <div className="mt-4 rounded-[1.25rem] bg-white p-4 text-sm text-[var(--muted)]">
                {bulkFiles.length ? `${bulkFiles.length} SVG files ready` : "No SVG files selected yet."}
                {bulkFiles.length ? (
                  <div className="mt-3 max-h-40 space-y-2 overflow-y-auto text-left text-xs text-[#111111]">
                    {bulkFiles.slice(0, 20).map((iconFile) => (
                      <div key={`${iconFile.name}-${iconFile.size}`}>{iconFile.name}</div>
                    ))}
                    {bulkFiles.length > 20 ? (
                      <div className="pt-1 text-[var(--muted)]">+{bulkFiles.length - 20} more files</div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="admin-button admin-button-secondary">
            Cancel
          </button>
          <button
            onClick={mode === "single" ? handleUpload : handleBulkUpload}
            disabled={loading}
            className="admin-button admin-button-primary"
          >
            {loading
              ? mode === "single"
                ? "Uploading..."
                : "Importing..."
              : mode === "single"
              ? "Upload icon"
              : "Import icons"}
          </button>
        </div>
      </div>
    </div>
  );
}
