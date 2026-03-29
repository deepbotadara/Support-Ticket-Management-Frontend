"use client";

import { useEffect, useMemo, useState } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import NavBar from "@/components/NavBar";
import { fetchTickets } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuthGuard";

const STATUS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const PRIORITY = ["LOW", "MEDIUM", "HIGH"];

export default function ReportsPage() {
  const { ready, token } = useAuthGuard();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchTickets(token, "?page=1&limit=100");
        setTickets(data?.tickets || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [ready, token]);

  const byStatus = useMemo(() => {
    const stats = { OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0 };
    tickets.forEach((t) => {
      if (stats[t.status] !== undefined) stats[t.status] += 1;
    });
    return stats;
  }, [tickets]);

  const byPriority = useMemo(() => {
    const stats = { LOW: 0, MEDIUM: 0, HIGH: 0 };
    tickets.forEach((t) => {
      if (stats[t.priority] !== undefined) stats[t.priority] += 1;
    });
    return stats;
  }, [tickets]);

  const recentTickets = useMemo(() => {
    return [...tickets]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 8);
  }, [tickets]);

  if (!ready) {
    return <main className="center-message">Checking your session...</main>;
  }

  return (
    <main className="app-shell">
      <NavBar />

      <section className="content">
        <div className="content-head">
          <h2>Reports</h2>
          <p>Quick analytics view based on current ticket data.</p>
        </div>

        {error && <p className="error-text">{error}</p>}

        {loading ? (
          <section className="stats-grid">
            <LoadingSkeleton lines={3} />
            <LoadingSkeleton lines={3} />
            <LoadingSkeleton lines={3} />
            <LoadingSkeleton lines={3} />
          </section>
        ) : (
          <>
            <section className="stats-grid">
              <article className="stat-card">
                <p>Total Tickets</p>
                <h3>{tickets.length}</h3>
              </article>
              {STATUS.map((s) => (
                <article key={s} className="stat-card">
                  <p>{s.replace("_", " ")}</p>
                  <h3>{byStatus[s]}</h3>
                </article>
              ))}
            </section>

            <div className="content-head" style={{ marginTop: "1.2rem" }}>
              <h2>Priority Split</h2>
            </div>

            <section className="stats-grid">
              {PRIORITY.map((p) => (
                <article key={p} className="stat-card">
                  <p>{p}</p>
                  <h3>{byPriority[p]}</h3>
                </article>
              ))}
            </section>

            <div className="content-head" style={{ marginTop: "1.2rem" }}>
              <h2>Recent Tickets</h2>
            </div>

            <div className="table-wrap">
              <table className="simple-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTickets.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="muted">No tickets found.</td>
                    </tr>
                  ) : (
                    recentTickets.map((t) => (
                      <tr key={t.id}>
                        <td>{t.title}</td>
                        <td>{t.status}</td>
                        <td>{t.priority}</td>
                        <td>{new Date(t.created_at).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
