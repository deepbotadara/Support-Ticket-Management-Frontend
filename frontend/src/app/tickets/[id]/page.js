"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import NavBar from "@/components/NavBar";
import { addTicketComment, fetchTicketComments, fetchTickets } from "@/lib/api";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const { ready, token } = useAuthGuard();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const ticketId = useMemo(() => Number(id), [id]);

  useEffect(() => {
    if (!ready || !ticketId) return;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const ticketData = await fetchTickets(token, "?page=1&limit=100");
        const selected = (ticketData?.tickets || []).find((t) => t.id === ticketId);

        if (!selected) {
          setError("Ticket not found or not accessible.");
          setTicket(null);
          setComments([]);
          return;
        }

        setTicket(selected);

        const commentData = await fetchTicketComments(token, ticketId);
        setComments(commentData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [ready, token, ticketId]);

  const onAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSaving(true);
    setError("");

    try {
      await addTicketComment(token, ticketId, commentText.trim());
      setCommentText("");
      const refreshed = await fetchTicketComments(token, ticketId);
      setComments(refreshed || []);
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
          <h2>Ticket Details</h2>
          <p>Review full context and collaborate with comments.</p>
        </div>

        {error && <p className="error-text">{error}</p>}

        {loading ? (
          <p className="muted">Loading ticket...</p>
        ) : ticket ? (
          <>
            <article className="ticket-card">
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

            <section className="comments-block">
              <h3>Comments ({comments.length})</h3>

              <form className="form-card" onSubmit={onAddComment}>
                <label>
                  Add Comment
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write an update or ask for clarification..."
                    rows={4}
                    minLength={2}
                    required
                  />
                </label>

                <button type="submit" className="btn" disabled={saving}>
                  {saving ? "Posting..." : "Post Comment"}
                </button>
              </form>

              <div className="ticket-list">
                {comments.length === 0 ? (
                  <p className="muted">No comments yet.</p>
                ) : (
                  comments.map((comment) => (
                    <article key={comment.id} className="ticket-card">
                      <p>{comment.comment}</p>
                      <div className="ticket-meta">
                        <span>By: {comment.author?.email || "Unknown"}</span>
                        <span>{new Date(comment.created_at).toLocaleString()}</span>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </>
        ) : (
          <p className="muted">Ticket not available.</p>
        )}
      </section>
    </main>
  );
}
