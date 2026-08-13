"use client";

import { useEffect, useMemo, useState } from "react";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  plan: "free" | "premium";
  billingCycle: "monthly" | "yearly" | null;
  status: "free" | "premium";
  premiumSince: string | null;
  premiumExpiresAt: string | null;
  joinedAt: string | null;
  updatedAt: string | null;
  lastPayment: {
    amount: number | null;
    currency: string;
    paidAt: string | null;
    reference: string | null;
  } | null;
};

const formatDate = (value: string | null) => {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const formatMoney = (amount: number | null, currency: string) => {
  if (amount == null) return "No payment yet";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      try {
        const res = await fetch(`${API}/users`, { cache: "no-store" });

        if (!res.ok) {
          setAvailable(false);
          setUsers([]);
          return;
        }

        const data = await res.json();
        setAvailable(true);
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setAvailable(false);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [API]);

  const summary = useMemo(() => {
    const premium = users.filter((user) => user.plan === "premium").length;
    const free = users.length - premium;

    return { premium, free };
  }, [users]);

  return (
    <div className="admin-page">
      <section className="admin-page-header">
        <div>
          <div className="admin-badge mb-3">User management</div>
          <h1 className="text-4xl font-semibold tracking-tight">Users</h1>
          <p>See only completed user accounts with their plan details and billing activity.</p>
        </div>

        <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-3">
          <article className="admin-card p-4">
            <p className="text-sm text-[var(--muted)]">Active users</p>
            <h2 className="mt-2 text-3xl font-semibold">{users.length}</h2>
          </article>
          <article className="admin-card p-4">
            <p className="text-sm text-[var(--muted)]">Premium</p>
            <h2 className="mt-2 text-3xl font-semibold">{summary.premium}</h2>
          </article>
          <article className="admin-card p-4">
            <p className="text-sm text-[var(--muted)]">Free</p>
            <h2 className="mt-2 text-3xl font-semibold">{summary.free}</h2>
          </article>
        </div>
      </section>

      {!available ? (
        <section className="admin-card p-6">
          <div className="admin-badge mb-4">Connection note</div>
          <h2 className="text-2xl font-semibold">Users API unavailable</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            The admin panel is ready, but the user data could not be loaded from the backend right now.
          </p>
        </section>
      ) : (
        <section className="admin-card overflow-hidden">
          <div className="admin-page-header border-b border-[var(--line)] p-5">
            <div>
              <h2 className="text-2xl font-semibold">Active account details</h2>
              <p>Completed accounts only, with plan, renewal, and payment details.</p>
            </div>
          </div>

          {loading ? (
            <p className="p-6 text-sm text-[var(--muted)]">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="p-6 text-sm text-[var(--muted)]">No completed users found yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Status</th>
                    <th>Billing</th>
                    <th>Renewal</th>
                    <th>Joined</th>
                    <th>Last payment</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="flex min-w-[220px] items-center gap-3">
                          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[var(--line)] bg-[#f8f9fb] text-sm font-semibold text-[#111111]">
                            {user.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-medium text-[#111111]">{user.name}</p>
                            <p className="text-sm text-[var(--muted)]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col gap-2">
                          <span
                            className={`admin-badge capitalize ${
                              user.plan === "premium"
                                ? "bg-[rgba(201,21,27,0.08)] text-[var(--accent)]"
                                : ""
                            }`}
                          >
                            {user.status}
                          </span>
                          <span className="text-xs text-[var(--muted)] capitalize">
                            Plan: {user.plan}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="min-w-[130px]">
                          <p className="font-medium capitalize">
                            {user.billingCycle || (user.plan === "premium" ? "custom" : "free")}
                          </p>
                          <p className="text-sm text-[var(--muted)]">
                            Since {formatDate(user.premiumSince || user.joinedAt)}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div className="min-w-[120px]">
                          <p className="font-medium">
                            {user.plan === "premium" ? formatDate(user.premiumExpiresAt) : "Not applicable"}
                          </p>
                          <p className="text-sm text-[var(--muted)]">
                            {user.plan === "premium" ? "Premium access" : "Free access"}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div className="min-w-[120px]">
                          <p className="font-medium">{formatDate(user.joinedAt)}</p>
                          <p className="text-sm text-[var(--muted)]">Account created</p>
                        </div>
                      </td>
                      <td>
                        <div className="min-w-[180px]">
                          <p className="font-medium">
                            {user.lastPayment
                              ? formatMoney(user.lastPayment.amount, user.lastPayment.currency)
                              : "No payment yet"}
                          </p>
                          <p className="text-sm text-[var(--muted)]">
                            {user.lastPayment?.paidAt
                              ? `Paid ${formatDate(user.lastPayment.paidAt)}`
                              : "Free account"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
