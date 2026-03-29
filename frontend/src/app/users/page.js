"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import NavBar from "@/components/NavBar";
import { fetchUsers } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function UsersPage() {
  const { ready, token, user } = useAuthGuard();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready || user?.role !== "MANAGER") return;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchUsers(token);
        setUsers(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [ready, token, user?.role]);

  if (!ready) {
    return <main className="center-message">Checking your session...</main>;
  }

  return (
    <main className="app-shell">
      <NavBar />

      <section className="content">
        <div className="content-head">
          <h2>Users</h2>
          <p>Manager view of all users and their roles.</p>
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
          <>
            {error && <p className="error-text">{error}</p>}

            {loading ? (
              <div className="ticket-list">
                <LoadingSkeleton lines={4} />
                <LoadingSkeleton lines={4} />
                <LoadingSkeleton lines={4} />
              </div>
            ) : (
              <div className="table-wrap">
                <table className="simple-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="muted">No users found.</td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id}>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>{u.role}</td>
                          <td>{new Date(u.created_at).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
