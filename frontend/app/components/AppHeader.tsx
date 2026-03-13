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
        background: "#ffffff",
        borderBottom: "1px solid #d1d5db",
        boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ minWidth: 70 }}>
          {!isHomePage ? (
            <button
              onClick={() => router.back()}
              style={{
                border: "none",
                background: "transparent",
                color: "#111",
                cursor: "pointer",
                fontSize: 15,
                padding: 0,
                fontWeight: 600
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
            color: "#111",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          Fitness Tracker
        </Link>

        <div style={{ minWidth: 70, display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleLogout}
            style={{
              border: "1px solid #d1d5db",
              background: "#fff",
              color: "#111",
              borderRadius: 8,
              padding: "6px 10px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}