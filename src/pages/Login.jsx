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
          max-w-sm
          rounded-[28px]
          border
          border-white/20
          bg-white/75
          dark:bg-[#16181d]/75
          backdrop-blur-2xl
          shadow-[0_30px_80px_rgba(0,0,0,.18)]
          p-8
        "
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-white dark:bg-white shadow-lg flex items-center justify-center overflow-hidden border border-zinc-200">
            <img
              src="/dipoLogo.png"
              alt="SMK Diponegoro Cipari"
              className="w-14 h-14 object-contain"
            />
          </div>

          <h1 className="mt-5 tracking-tight dark:text-white">
            SISTEM BENDAHARA SEKOLAH
          </h1>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <Input
            icon={HiEnvelope}
            label="Email"
            placeholder="rockefeller@gmail.com"
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

        {/* Button */}
        <div className="flex justify-center mt-7">
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 justify-center"
          >
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-7 text-center">
          <div className="text-xs text-zinc-400">
            SMK Diponegoro Cipari {new Date().getFullYear()}
          </div>

          <div className="mt-1 text-[11px] text-zinc-400 tracking-wide">
            Payment Management System v1.0
          </div>
        </div>
      </form>
    </div>
  );
}
