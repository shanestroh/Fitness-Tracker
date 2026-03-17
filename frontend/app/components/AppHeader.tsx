"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/login";
  const isHomePage = pathname === "/";

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (isLoginPage) {
    return null;
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(10px)",
        background: "rgba(255,255,255,0.88)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--max-content-width)",
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ minWidth: 84 }}>
          {!isHomePage ? (
            <button
              onClick={() => router.back()}
              className="btn btn-secondary"
              style={{
                minHeight: 36,
                padding: "8px 12px",
                borderRadius: 10,
                fontWeight: 700,
              }}
            >
              ← Back
            </button>
          ) : null}
        </div>

        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "var(--text)",
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: "-0.02em",
          }}
        >
          Skrunch's Fitness Tracker
        </Link>

        <div
          style={{
            minWidth: 84,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{
              minHeight: 36,
              padding: "8px 12px",
              borderRadius: 10,
              fontWeight: 700,
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}