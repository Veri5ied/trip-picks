"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Calendar, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import AuthModal from "./auth-modal";

interface TopBarProps {
  search: string;
  savedCount: number;
  onSearchChange: (value: string) => void;
  onSavedClick: () => void;
}

export default function TopBar({
  search,
  savedCount,
  onSearchChange,
  onSavedClick,
}: TopBarProps) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center gap-4 bg-[#111] px-6 py-4 max-sm:px-4 max-sm:py-3 max-sm:gap-2.5">
        <h1 className="text-xl font-bold tracking-tight whitespace-nowrap max-sm:text-[17px]">
          trip<span className="text-accent">picks</span>
        </h1>
        <input
          className="mx-auto max-w-160 flex-1 min-w-0 rounded-full bg-[#2a2a2a] px-5 py-3 text-sm text-white outline-none placeholder:text-[#666] focus:bg-[#333] max-sm:px-3.5 max-sm:py-2.5 max-sm:text-[14px]"
          placeholder="Search Lagos activities"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button
          onClick={onSavedClick}
          className="relative flex items-center justify-center size-10.5 rounded-full bg-[#2a2a2a] text-[#999] hover:bg-[#333] hover:text-white transition-colors max-sm:size-9"
        >
          <Bookmark size={18} />
          {hydrated && savedCount > 0 && (
            <span className="absolute -top-1 -right-1 z-20 size-4 rounded-full bg-accent text-white text-[9px] font-bold flex items-center justify-center">
              {savedCount > 9 ? "9+" : savedCount}
            </span>
          )}
        </button>
        <button
          onClick={() => (user ? router.push("/plans") : setAuthOpen(true))}
          className="flex items-center justify-center size-10.5 rounded-full bg-[#2a2a2a] text-[#999] hover:bg-[#333] hover:text-white transition-colors max-sm:size-9"
          title={user ? "Plans" : "Sign in"}
        >
          <Calendar size={18} />
        </button>

        {!loading && (
          <div ref={menuRef} className="relative">
            <button
              onClick={() => (user ? setMenuOpen((p) => !p) : setAuthOpen(true))}
              className="flex items-center justify-center size-10.5 rounded-full bg-[#2a2a2a] text-[#999] hover:bg-[#333] hover:text-white transition-colors max-sm:size-9"
              title={user ? "Account" : "Sign in"}
            >
              <User size={18} />
            </button>

            {user && menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-[#1a1a1a] border border-[#333] shadow-xl overflow-hidden">
                <div className="px-4 py-3 text-sm text-[#bbb] border-b border-[#2a2a2a] truncate">
                  {user.email}
                </div>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-[#ddd] hover:bg-[#2a2a2a] transition-colors"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}
