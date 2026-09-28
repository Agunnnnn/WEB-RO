import { useState } from "react";
import { useAdmin } from "../context/AdminContext";

export default function LoginPage({ onBack }) {
  const { login } = useAdmin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true);
    setError("");
    const result = await login(username.trim(), password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || "Username atau password salah.");
      return;
    }
    onBack(); // login berhasil → kembali ke app utama
  }

  return (
    <div className="login-overlay">
      {/* Animated background particles */}
      <div className="login-bg">
        <div className="particle p1" />
        <div className="particle p2" />
        <div className="particle p3" />
        <div className="particle p4" />
        <div className="particle p5" />
      </div>

      <div className="login-card" role="main">
        {/* Header / Brand */}
        <div className="login-brand">
          <div className="login-shield">🛡️</div>
          <div className="login-brand-text">
            <span className="login-title">Admin Portal</span>
            <span className="login-subtitle">WoE Team Planner</span>
          </div>
        </div>

        <div className="login-divider" />

        <p className="login-desc">
          Masuk Sebagai Pengelola Guild untuk mengatur tim.
        </p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="login-field">
            <label className="login-label" htmlFor="login-username">
              <span className="login-label-icon">👤</span> Username
            </label>
            <input
              id="login-username"
              className="login-input"
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              autoComplete="username"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="login-field">
            <label className="login-label" htmlFor="login-password">
              <span className="login-label-icon">🔑</span> Password
            </label>
            <div className="login-input-wrap">
              <input
                id="login-password"
                className="login-input"
                type={showPass ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="login-toggle-pass"
                onClick={() => setShowPass((v) => !v)}
                tabIndex={-1}
                aria-label={
                  showPass ? "Sembunyikan password" : "Tampilkan password"
                }
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="login-error" role="alert">
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <button
            id="login-submit-btn"
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="login-spinner">
                <span className="spinner-dot" />
                <span className="spinner-dot" />
                <span className="spinner-dot" />
              </span>
            ) : (
              <>🛡️ Masuk sebagai Admin</>
            )}
          </button>
        </form>

        {/* Back button */}
        <button
          type="button"
          className="login-back"
          onClick={onBack}
          disabled={loading}
        >
          ← Kembali ke halaman utama
        </button>
      </div>
    </div>
  );
}
