"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { createTicket } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function NewTicketPage() {
  const router = useRouter();
  const { ready, token } = useAuthGuard();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await createTicket(token, form);
      router.push("/tickets");
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
          <h2>Create Ticket</h2>
          <p>Share issue details clearly so support can resolve it faster.</p>
        </div>

        <form className="form-card" onSubmit={onSubmit}>
          <label>
            Title
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Payment gateway timeout"
              required
              minLength={5}
            />
          </label>

          <label>
            Description
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Explain what happened, expected result, and impact..."
              required
              minLength={10}
              rows={6}
            />
          </label>

          <label>
            Priority
            <select
              value={form.priority}
              onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </label>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn" disabled={saving}>
            {saving ? "Creating..." : "Create Ticket"}
          </button>
        </form>
      </section>
    </main>
  );
}
