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
          padding: "10px 12px",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            minWidth: isHomePage ? 0 : 72,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          {!isHomePage ? (
            <button
              onClick={() => router.back()}
              className="btn btn-secondary"
              style={{
                minHeight: 36,
                padding: "8px 12px",
                borderRadius: 10,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              ← Back
            </button>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            minWidth: 0,
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: "var(--text)",
              fontWeight: 800,
              fontSize: "clamp(15px, 4vw, 18px)",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Skrunch&apos;s Fitness Tracker
          </Link>
        </div>

        <div
          style={{
            minWidth: 72,
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
              whiteSpace: "nowrap",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}