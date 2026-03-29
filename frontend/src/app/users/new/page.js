"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { createUser } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function NewUserPage() {
  const router = useRouter();
  const { ready, token, user } = useAuthGuard();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "SUPPORT",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (user?.role !== "MANAGER") return;

    setSaving(true);
    setError("");

    try {
      await createUser(token, form);
      router.push("/users");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!ready) {
    return <main className="center-message">Checking your session...</main>;
  }

  return (
    <main className="app-shell">
      <NavBar />

      <section className="content">
        <div className="content-head">
          <h2>Create User</h2>
          <p>Manager can add support staff and users from here.</p>
        </div>

        {user?.role !== "MANAGER" ? (
          <article className="ticket-card">
            <p className="error-text">Only managers can access this page.</p>
            <div className="ticket-actions">
              <Link className="btn btn-outline" href="/dashboard">
                Back to Dashboard
              </Link>
            </div>
          </article>
        ) : (
          <form className="form-card" onSubmit={onSubmit}>
            <label>
              Name
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ravi Patel"
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="ravi@support.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Min 6+ characters"
                required
                minLength={6}
              />
            </label>

            <label>
              Role
              <select
                value={form.role}
                onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              >
                <option value="MANAGER">MANAGER</option>
                <option value="SUPPORT">SUPPORT</option>
                <option value="USER">USER</option>
              </select>
            </label>

            {error && <p className="error-text">{error}</p>}

            <div className="ticket-actions">
              <button type="submit" className="btn" disabled={saving}>
                {saving ? "Creating..." : "Create User"}
              </button>

              <Link className="btn btn-outline" href="/users">
                Cancel
              </Link>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
