"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthToken, getStoredAuth } from "@/lib/auth";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tickets", label: "Tickets" },
  { href: "/tickets/new", label: "Create Ticket" },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = getStoredAuth();

  const onLogout = () => {
    clearAuthToken();
    router.replace("/");
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div>
          <p className="brand-eyebrow">Support Ops</p>
          <h1 className="brand-title">Ticket Console</h1>
        </div>

        <nav className="nav-links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="topbar-actions">
          <span className="role-chip">{auth?.user?.role || "Guest"}</span>
          <button type="button" className="btn btn-outline" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
