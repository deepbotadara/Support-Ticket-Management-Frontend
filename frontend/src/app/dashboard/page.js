"use client";

import { useEffect, useMemo, useState } from "react";
import NavBar from "@/components/NavBar";
import { fetchTickets, fetchUsers } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuthGuard";

const STATUS_ORDER = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export default function DashboardPage() {
  const { ready, token, user } = useAuthGuard();
  const [tickets, setTickets] = useState([]);
  const [userStats, setUserStats] = useState({ total: 0, MANAGER: 0, SUPPORT: 0, USER: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready) return;

    const load = async () => {
      try {
        const data = await fetchTickets(token, "?page=1&limit=100");
        setTickets(data?.tickets || []);

        if (user?.role === "MANAGER") {
          const users = await fetchUsers(token);
          const stats = { total: users.length, MANAGER: 0, SUPPORT: 0, USER: 0 };

          users.forEach((u) => {
            if (stats[u.role] !== undefined) stats[u.role] += 1;
          });

          setUserStats(stats);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    load();
  }, [ready, token, user?.role]);

  const stats = useMemo(() => {
    const base = {
      total: tickets.length,
      OPEN: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
      CLOSED: 0,
    };

    tickets.forEach((t) => {
      if (base[t.status] !== undefined) base[t.status] += 1;
    });

    return base;
  }, [tickets]);

  if (!ready) {
    return <main className="center-message">Checking your session...</main>;
  }

  return (
    <main className="app-shell">
      <NavBar />

      <section className="content">
        <div className="hero-card">
          <p className="hero-kicker">Welcome back</p>
          <h2>{user?.email}</h2>
          <p>You are signed in as {user?.role}. This dashboard gives you a quick pulse of ticket flow.</p>
        </div>

        {error && <p className="error-text">{error}</p>}

        <section className="stats-grid">
          <article className="stat-card">
            <p>Total Tickets</p>
            <h3>{stats.total}</h3>
          </article>
          {STATUS_ORDER.map((status) => (
            <article key={status} className="stat-card">
              <p>{status.replace("_", " ")}</p>
              <h3>{stats[status]}</h3>
            </article>
          ))}
        </section>

        {user?.role === "MANAGER" && (
          <>
            <div className="content-head" style={{ marginTop: "1.2rem" }}>
              <h2>Team Snapshot</h2>
              <p>Current user distribution across roles.</p>
            </div>

            <section className="stats-grid">
              <article className="stat-card">
                <p>Total Users</p>
                <h3>{userStats.total}</h3>
              </article>
              <article className="stat-card">
                <p>Managers</p>
                <h3>{userStats.MANAGER}</h3>
              </article>
              <article className="stat-card">
                <p>Support</p>
                <h3>{userStats.SUPPORT}</h3>
              </article>
              <article className="stat-card">
                <p>Users</p>
                <h3>{userStats.USER}</h3>
              </article>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
