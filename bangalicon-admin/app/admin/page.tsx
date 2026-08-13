"use client";

import { FolderTree, ImageIcon, Tag, Users } from "lucide-react";
import { useEffect, useState } from "react";

type DashboardStats = {
  icons: number;
  categories: number;
  tags: number;
  users: number;
};

type IconItem = {
  id: string;
  name: string;
  type: string;
  file: string;
  category_name?: string | null;
};

const statCards = [
  { key: "icons", label: "Icons", icon: ImageIcon },
  { key: "categories", label: "Categories", icon: FolderTree },
  { key: "tags", label: "Tags", icon: Tag },
  { key: "users", label: "Users", icon: Users },
] as const;

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    icons: 0,
    categories: 0,
    tags: 0,
    users: 0,
  });
  const [recentIcons, setRecentIcons] = useState<IconItem[]>([]);
  const [usersAvailable, setUsersAvailable] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || "";
  const BASE_URL = API.replace("/api", "");

  const ensureArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [iconsRes, catRes, tagRes, userRes] = await Promise.allSettled([
          fetch(`${API}/icons`),
          fetch(`${API}/categories`),
          fetch(`${API}/tags`),
          fetch(`${API}/users`),
        ]);

        const icons = ensureArray<IconItem>(
          iconsRes.status === "fulfilled" && iconsRes.value.ok ? await iconsRes.value.json() : []
        );
        const categories = ensureArray(
          catRes.status === "fulfilled" && catRes.value.ok ? await catRes.value.json() : []
        );
        const tags = ensureArray(
          tagRes.status === "fulfilled" && tagRes.value.ok ? await tagRes.value.json() : []
        );
        const users = ensureArray(
          userRes.status === "fulfilled" && userRes.value.ok ? await userRes.value.json() : []
        );

        setUsersAvailable(userRes.status === "fulfilled" && userRes.value.ok);
        setStats({
          icons: icons.length,
          categories: categories.length,
          tags: tags.length,
          users: users.length,
        });
        setRecentIcons(icons.slice(0, 6));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [API]);

  return (
    <div className="admin-page">
      <section className="admin-page-header">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Library dashboard</h1>
          <p>Simple overview of your icon library.</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;
          const value = stats[item.key];

          return (
            <article key={item.key} className="admin-card p-5">
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[#111111]">
                  <Icon size={20} />
                </div>
                <span className="admin-badge">{item.label}</span>
              </div>
              <p className="text-sm text-[var(--muted)]">{item.label}</p>
              <h2 className="mt-2 text-4xl font-semibold">{value}</h2>
            </article>
          );
        })}
      </section>

      <section className="admin-card overflow-hidden">
        <div className="admin-page-header border-b border-[var(--line)] p-5">
          <div>
            <h2 className="text-2xl font-semibold">Recent uploads</h2>
            <p>Latest icons in the library.</p>
          </div>
        </div>

        {!recentIcons.length ? (
          <p className="p-6 text-sm text-[var(--muted)]">No recent icons found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {recentIcons.map((icon) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
