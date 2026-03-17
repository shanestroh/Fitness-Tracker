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
    <div onClick={onCancel} className="modal-overlay">
      <div
        onClick={(e) => e.stopPropagation()}
        className="surface-card modal-card"
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
          className="section-heading section-heading-lg"
          style={{
            lineHeight: 1.2,
            marginBottom: 8,
          }}
        >
          {title}
        </h2>

        <p
          className="muted-copy"
          style={{
            margin: "0 0 22px 0",
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>

        <div className="action-row-end">
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