"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, UserPlus, LogIn } from "lucide-react";

import { API_BASE_URL } from "@/lib/config";
import { useAuth } from "@/components/auth/AuthProvider";
import { useModal } from "@/components/modal/ModalProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const { showSnackbar } = useModal();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Al ingelogd? → direct naar dashboard
  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Account aanmaken
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg =
          data.detail ||
          "Account aanmaken mislukt. Bestaat dit e-mailadres al?";
        showSnackbar(msg, "danger");
        setLoading(false);
        return;
      }

      showSnackbar("Account aangemaakt ✔ Je wordt nu ingelogd…", "success");

      // 2️⃣ Direct inloggen met hetzelfde email/wachtwoord
      const loginRes = await login(email, password);

      if (!loginRes.success) {
        showSnackbar("Account gemaakt — log nu handmatig in", "info");
        router.push("/login");
        return;
      }

      // 3️⃣ Na succesvolle login → dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("❌ Register fout:", err);
      showSnackbar("Serverfout bij account aanmaken", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-soft)] px-4">
      <div
        className="
          w-full max-w-md 
          bg-[var(--card-bg)] border border-[var(--card-border)]
          rounded-2xl shadow-xl p-8
          animate-fade-slide
        "
      >
        <h1 className="text-3xl font-bold text-center mb-2 text-[var(--text-dark)]">
          Account aanmaken
        </h1>
        <p className="text-center text-[var(--text-light)] mb-8">
          Maak een nieuw TradeLayer-account
        </p>

        {/* Formulier */}
        <form onSubmit={handleRegister} className="space-y-6">
          {/* E-mail */}
          <div>
            <label className="text-sm text-[var(--text-light)] mb-1 block">
              E-mail
            </label>
            <div
              className="
                flex items-center gap-2 
                bg-[var(--bg-soft)] border border-[var(--border)]
                rounded-xl px-3 py-2
                focus-within:ring-1 focus-within:ring-[var(--primary)]
              "
            >
              <Mail size={18} className="text-[var(--text-light)]" />
              <input
                type="email"
                required
                className="bg-transparent outline-none w-full"
                placeholder="jij@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Wachtwoord */}
          <div>
            <label className="text-sm text-[var(--text-light)] mb-1 block">
              Wachtwoord
            </label>
            <div
              className="
                flex items-center gap-2 
                bg-[var(--bg-soft)] border border-[var(--border)]
                rounded-xl px-3 py-2
                focus-within:ring-1 focus-within:ring-[var(--primary)]
              "
            >
              <Lock size={18} className="text-[var(--text-light)]" />
              <input
                type="password"
                required
                minLength={6}
                className="bg-transparent outline-none w-full"
                placeholder="•••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Submit-knop */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full flex items-center justify-center gap-2
              bg-[var(--primary)] hover:bg-[var(--primary-dark)]
              text-white font-semibold py-3 rounded-xl
              shadow-sm hover:shadow-md transition
              disabled:bg-gray-400 disabled:cursor-not-allowed
            "
          >
            <UserPlus size={18} />
            {loading ? "Aanmaken…" : "Account aanmaken"}
          </button>
        </form>

        {/* Naar login */}
        <p className="text-center text-[var(--text-light)] mt-6">
          Heb je al een account?{" "}
          <Link
            href="/login"
            className="text-[var(--primary)] font-semibold hover:underline inline-flex items-center gap-1"
          >
            <LogIn size={14} />
            Log in →
          </Link>
        </p>
      </div>
    </div>
  );
}
