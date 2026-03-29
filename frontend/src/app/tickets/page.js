"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { fetchTickets } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function TicketsPage() {
  const { ready, token } = useAuthGuard();

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);

  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;

    const load = async () => {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
      });

      if (status) params.set("status", status);
      if (priority) params.set("priority", priority);

      try {
        const data = await fetchTickets(token, `?${params.toString()}`);
        setTickets(data?.tickets || []);
        setPagination(data?.pagination || { page: 1, totalPages: 1 });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [ready, token, page, status, priority]);

  if (!ready) {
    return <main className="center-message">Checking your session...</main>;
  }

  return (
    <main className="app-shell">
      <NavBar />

      <section className="content">
        <div className="content-head">
          <h2>Tickets</h2>
          <p>Filter and track current support work.</p>
        </div>

        <div className="filter-row">
          <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
            <option value="">All Status</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          <select value={priority} onChange={(e) => { setPage(1); setPriority(e.target.value); }}>
            <option value="">All Priority</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>

        {error && <p className="error-text">{error}</p>}

        {loading ? (
          <p className="muted">Loading tickets...</p>
        ) : (
          <div className="ticket-list">
            {tickets.length === 0 && <p className="muted">No tickets found.</p>}

            {tickets.map((ticket) => (
              <article key={ticket.id} className="ticket-card">
                <div className="ticket-top">
                  <h3>{ticket.title}</h3>
                  <span className={`status-pill status-${ticket.status.toLowerCase()}`}>
                    {ticket.status.replace("_", " ")}
                  </span>
                </div>
                <p>{ticket.description}</p>
                <div className="ticket-meta">
                  <span>Priority: {ticket.priority}</span>
                  <span>Creator: {ticket.creator?.email || "-"}</span>
                  <span>Assignee: {ticket.assignee?.email || "Unassigned"}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="pager-row">
          <button
            type="button"
            className="btn btn-outline"
            disabled={pagination.page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>

          <span className="muted">
            Page {pagination.page || 1} of {pagination.totalPages || 1}
          </span>

          <button
            type="button"
            className="btn btn-outline"
            disabled={(pagination.page || 1) >= (pagination.totalPages || 1)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}
