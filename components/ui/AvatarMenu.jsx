
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { useModal } from "@/components/modal/ModalProvider";

import { User, Globe, Brain, LineChart, LogOut, Loader2 } from "lucide-react";

export default function AvatarMenu() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const dropdownRef = useRef(null);

  const router = useRouter();
  const { logout, user } = useAuth();
  const { showSnackbar } = useModal();

  /* Klik buiten = sluiten */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* LOGOUT MET LOADER */
  const handleLogout = async () => {
    setLoadingLogout(true);
    setShowDropdown(false);

    await logout();

    showSnackbar("Je bent veilig uitgelogd ✔", "success");

    router.push("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* AVATAR KNOP */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="
          w-9 h-9 rounded-full
          bg-[var(--primary)]
          text-white
          flex items-center justify-center
          font-semibold
          hover:opacity-90
          transition-all
          shadow-sm
        "
        title="Open profielmenu"
      >
        {user?.first_name?.charAt(0)?.toUpperCase() ||
          user?.email?.charAt(0)?.toUpperCase() ||
          "?"}
      </button>

      {/* DROPDOWN */}
      {showDropdown && (
        <div
          className="
            absolute right-0 mt-3 w-56
            bg-[var(--card-bg)]
            border border-[var(--card-border)]
            rounded-xl
            shadow-[var(--shadow-lg)]
            py-1 z-50 animate-fade-slide
          "
        >
          <ul className="text-sm text-[var(--text-dark)]">
            {/* User info */}
            {user && (
              <li className="px-4 py-2 pb-3 border-b border-[var(--border)]">
                <p className="font-semibold">
                  {user.first_name
                    ? `${user.first_name} ${user.last_name || ""}`
                    : user.email}
                </p>
                <p className="text-xs text-[var(--text-light)] capitalize">
                  Rol: {user.role}
                </p>
              </li>
            )}

            <DropdownItem href="/profile" icon={<User size={16} />}>
              Profiel
            </DropdownItem>

            <DropdownButton icon={<Globe size={16} />}>
              Taal &amp; Regio
            </DropdownButton>

            <DropdownButton icon={<Brain size={16} />}>
              AI Instellingen
            </DropdownButton>

            <DropdownButton icon={<LineChart size={16} />}>
              Tradingstijl
            </DropdownButton>

            {/* LOGOUT */}
            <DropdownButton
              icon={
                loadingLogout ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut size={16} />
                )
              }
              danger
              onClick={loadingLogout ? undefined : handleLogout}
            >
              {loadingLogout ? "Uitloggen…" : "Uitloggen"}
            </DropdownButton>
          </ul>
        </div>
      )}
    </div>
  );
}

/* LINKS */
function DropdownItem({ href, icon, children }) {
  return (
    <li>
      <Link
        href={href}
        className="
          flex items-center gap-3 px-4 py-2.5
          hover:bg-[var(--bg-soft)]
          rounded-lg transition
        "
      >
        <span className="text-[var(--text-light)]">{icon}</span>
        <span>{children}</span>
      </Link>
    </li>
  );
}

/* BUTTONS */
function DropdownButton({ icon, children, danger = false, onClick }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`
          w-full text-left flex items-center gap-3 px-4 py-2.5
          rounded-lg transition
          hover:bg-[var(--bg-soft)]
          ${
            danger
              ? "text-red-500 hover:text-red-600"
              : "text-[var(--text-dark)]"
          }
        `}
      >
        <span
          className={`${
            danger ? "text-red-400" : "text-[var(--text-light)]"
          }`}
        >
          {icon}
        </span>
        <span>{children}</span>
      </button>
    </li>
  );
}
