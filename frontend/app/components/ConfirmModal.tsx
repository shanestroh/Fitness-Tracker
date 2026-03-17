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
        background: "rgba(15, 23, 42, 0.42)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="surface-card"
        style={{
          width: "100%",
          maxWidth: 440,
          padding: 22,
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <span className="badge badge-danger">Danger zone</span>
        </div>

        <h2
          style={{
            margin: "0 0 8px 0",
            fontSize: 24,
            lineHeight: 1.2,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "var(--text)",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            margin: "0 0 22px 0",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            fontSize: 15,
          }}
        >
          {message}
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={confirmLoading}
            className="btn btn-secondary"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={confirmLoading}
            className="btn btn-danger"
          >
            {confirmLoading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}