"use client";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/logout", { method: "POST", credentials: "same-origin" });
        window.location.href = "/login";
      }}
      style={{
        padding: "10px 14px",
        border: "1px solid #ccc",
        borderRadius: 10,
        background: "#fff",
        cursor: "pointer",
        fontWeight: 600,
        color: "#444",
      }}
    >
      Log Out
    </button>
  );
}