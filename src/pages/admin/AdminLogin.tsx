import { useState } from "react";
import Icon from "@/components/ui/icon";

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (login === "admin" && password === "admin2026") {
      localStorage.setItem("adminAuth", "true");
      setTimeout(() => onLogin(), 300);
    } else {
      setError("Неверный логин или пароль");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-body flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="font-display font-black text-3xl mb-2">
            <span className="text-gradient-orange">ARTSTAGE</span>
            <span className="text-white/50">.PRO</span>
          </div>
          <div className="text-white/40 text-sm">Панель администратора</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#10101A] border border-white/5 rounded-2xl p-8">
          <h2 className="font-display font-bold text-xl text-white mb-6 text-center">Вход в систему</h2>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <Icon name="AlertCircle" size={16} />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-white/40 text-sm mb-2 block">Логин</label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full bg-[#16162A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5C1A]/50 transition-colors placeholder:text-white/20"
                placeholder="admin"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="text-white/40 text-sm mb-2 block">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#16162A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5C1A]/50 transition-colors placeholder:text-white/20"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-[#FF5C1A] to-[#FF1A8C] text-white font-display font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Icon name="Loader" size={16} className="animate-spin" />}
            Войти
          </button>

          <div className="mt-6 text-center">
            <a href="/" className="text-white/30 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors">
              <Icon name="ArrowLeft" size={14} />
              Вернуться на сайт
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
