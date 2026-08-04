import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiEnvelope, HiLockClosed, HiArrowRight } from "react-icons/hi2";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import { login, isLoggedIn } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      alert("Email atau password salah.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-zinc-100 to-slate-200 dark:from-[#0f1115] dark:via-[#111317] dark:to-[#090909] px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <form
        onSubmit={handleLogin}
        className="
          relative
          w-full
          max-w-md
          rounded-[32px]
          border
          border-white/20
          bg-white/75
          dark:bg-[#16181d]/75
          backdrop-blur-2xl
          shadow-[0_30px_80px_rgba(0,0,0,.18)]
          p-10
        "
      >
        <div className="text-center mb-10">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
            S
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight dark:text-white">
            School Payment
          </h1>

          <p className="mt-2 text-zinc-500 text-sm">
            Silakan login menggunakan akun Bendahara.
          </p>
        </div>

        <div className="space-y-5">
          <Input
            icon={HiEnvelope}
            label="Email"
            placeholder="bendahara@sekolah.sch.id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            icon={HiLockClosed}
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-8 h-12"
          icon={HiArrowRight}
        >
          {loading ? "Memproses..." : "Masuk"}
        </Button>

        <div className="mt-8 text-center text-xs text-zinc-400">
          © {new Date().getFullYear()} SMK Diponegoro Cipari
        </div>
        <p className="mt-2 text-[11px] text-zinc-400">
          Payment Management System v1.0
        </p>
      </form>
    </div>
  );
}
