"use client";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  confirmLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #ddd",
          padding: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        }}
      >
        <h2 style={{ margin: "0 0 8px 0", fontSize: 22, fontWeight: 700 }}>
          {title}
        </h2>

        <p style={{ margin: "0 0 20px 0", color: "#444", lineHeight: 1.5 }}>
          {message}
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={confirmLoading}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #d0d0d0",
              background: "#fff",
              cursor: confirmLoading ? "not-allowed" : "pointer",
              fontWeight: 700,
              color: "#444",
            }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={confirmLoading}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #d0d0d0",
              background: "#fff",
              cursor: confirmLoading ? "not-allowed" : "pointer",
              fontWeight: 700,
              color: "#b00020",
            }}
          >
            {confirmLoading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}