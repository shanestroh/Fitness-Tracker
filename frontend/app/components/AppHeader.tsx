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
    <header className="app-header">
      <div className="app-header-inner">
        <div
          className="app-header-side app-header-side-left"
          style={{ minWidth: isHomePage ? 0 : 72 }}
        >
          {!isHomePage && (
            <button
              onClick={() => router.back()}
              className="btn btn-secondary"
              style={{ whiteSpace: "nowrap" }}
            >
              ← Back
            </button>
          )}
        </div>

        <div className="app-header-center">
          <Link href="/" className="app-header-title">
            Skrunch&apos;s Fitness Tracker
          </Link>
        </div>

        <div
          className="app-header-side app-header-side-right"
          style={{ minWidth: 72 }}
        >
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{ whiteSpace: "nowrap" }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}