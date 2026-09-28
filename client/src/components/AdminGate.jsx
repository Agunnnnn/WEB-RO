import { useAdmin } from "../context/AdminContext";

export default function AdminGate({ onLoginClick }) {
  const { isAdmin, admin, logout } = useAdmin();

  if (isAdmin) {
    return (
      <button
        type="button"
        className="btn btn-ghost btn-sm admin-badge"
        onClick={logout}
      >
        🛡️ {admin?.displayName || admin?.username || "Admin"} — keluar
      </button>
    );
  }

  return (
    <button
      type="button"
      id="admin-login-btn"
      className="btn btn-ghost btn-sm"
      onClick={onLoginClick}
    >
      Masuk Pengelola Guild
    </button>
  );
}
