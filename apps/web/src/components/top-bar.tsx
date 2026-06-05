"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Calendar, Search, X, User, LogOut } from "lucide-react";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        searchOpen &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
    };
    if (searchOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    onSearchChange("");
  }, [onSearchChange]);

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center gap-2.5 bg-[#111] px-6 py-4 max-sm:px-4 max-sm:py-3 sm:gap-3">
        <h1
          className={`text-xl font-bold tracking-tight whitespace-nowrap transition-all duration-300 max-sm:text-[17px] ${
            searchOpen
              ? "opacity-0 w-0 overflow-hidden sm:opacity-100 sm:w-auto"
              : "opacity-100"
          }`}
        >
          trip<span className="text-accent">picks</span>
        </h1>

        <div
          ref={containerRef}
          className="flex-1 flex justify-end sm:justify-center"
        >
          <div
            className={`flex items-center overflow-hidden transition-all duration-300 ease-out ${
              searchOpen ? "w-full max-w-160" : "w-0"
            }`}
          >
            <div className="relative w-full">
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Lagos activities"
                className="w-full rounded-full bg-[#2a2a2a] pl-5 pr-12 py-3 text-sm text-white outline-none placeholder:text-[#555] focus:bg-[#333] transition-colors max-sm:py-2.5 max-sm:pl-4 max-sm:pr-10 max-sm:text-[14px]"
              />
              <button
                onClick={closeSearch}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center size-8 rounded-full text-[#777] hover:bg-[#444] hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={openSearch}
          className={`flex items-center justify-center size-10.5 rounded-full transition-all duration-300 max-sm:size-9 ${
            searchOpen
              ? "w-0 overflow-hidden opacity-0 sm:hidden"
              : "bg-[#2a2a2a] text-[#999] hover:bg-[#333] hover:text-white"
          }`}
          title="Search"
        >
          <Search size={18} />
        </button>

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
              onClick={() =>
                user ? setMenuOpen((p) => !p) : setAuthOpen(true)
              }
              className="flex items-center justify-center size-10.5 rounded-full bg-[#2a2a2a] text-[#999] hover:bg-[#333] hover:text-white transition-colors max-sm:size-9"
              title={user ? "Account" : "Sign in"}
            >
              <User size={18} />
            </button>

            {user && menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-surface border border-[#333] shadow-xl overflow-hidden">
                <div className="px-4 py-3 text-sm text-[#bbb] border-b border-[#2a2a2a] truncate">
                  {user.email}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
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
