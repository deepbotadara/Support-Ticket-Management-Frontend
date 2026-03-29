const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

const parseJsonSafely = (text) => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

export const apiRequest = async (path, { method = "GET", token, body } = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) return null;

  const text = await response.text();
  const data = parseJsonSafely(text);

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
};

export const login = (email, password) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
  });

export const fetchTickets = (token, query = "") =>
  apiRequest(`/tickets${query}`, {
    token,
  });

export const createTicket = (token, payload) =>
  apiRequest("/tickets", {
    method: "POST",
    token,
    body: payload,
  });

export const updateTicketStatus = (token, ticketId, status) =>
  apiRequest(`/tickets/${ticketId}/status`, {
    method: "PATCH",
    token,
    body: { status },
  });

export const fetchUsers = (token) =>
  apiRequest("/users", {
    token,
  });

export const assignTicket = (token, ticketId, userId) =>
  apiRequest(`/tickets/${ticketId}/assign`, {
    method: "PATCH",
    token,
    body: { userId },
  });

export const fetchTicketComments = (token, ticketId) =>
  apiRequest(`/tickets/${ticketId}/comments`, {
    token,
  });

export const addTicketComment = (token, ticketId, comment) =>
  apiRequest(`/tickets/${ticketId}/comments`, {
    method: "POST",
    token,
    body: { comment },
  });

export const updateComment = (token, commentId, comment) =>
  apiRequest(`/comments/${commentId}`, {
    method: "PATCH",
    token,
    body: { comment },
  });

export const deleteComment = (token, commentId) =>
  apiRequest(`/comments/${commentId}`, {
    method: "DELETE",
    token,
  });
