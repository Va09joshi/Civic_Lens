"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "./Button";
import { FaSearch } from "react-icons/fa";
import { getStoredToken } from "../services/auth";

export default function Navbar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const syncAuthState = () => {
      const token = getStoredToken();
      setIsLoggedIn(Boolean(token));
    };
    syncAuthState();

    const handleStorage = () => syncAuthState();
    const handleAuthChanged = () => syncAuthState();
    const handleFocus = () => syncAuthState();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth-changed", handleAuthChanged);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth-changed", handleAuthChanged);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/explore?search=${encodeURIComponent(search)}`);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-3 md:py-4">
        <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary text-2xl tracking-tight">
            <img src="/logo.svg" alt="CivicLens" className="h-9 w-9" />
            <span>CivicLens</span>
          </Link>

          <form
            onSubmit={handleSearch}
            className="order-3 w-full md:order-none md:w-[280px] lg:w-[340px] flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5"
          >
            <span className="pl-1 text-slate-400">
              <FaSearch size={13} />
            </span>
            <input
              className="w-full bg-transparent border-none outline-none px-1 py-1 text-sm text-slate-700 placeholder:text-slate-400"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Go
            </button>
          </form>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.push("/explore")} className="px-4 md:px-5 py-2.5">
              Feed
            </Button>
            <Button onClick={() => router.push("/create")} className="px-4 md:px-5 py-2.5">
              Create Post
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(isLoggedIn ? "/profile" : "/login")}
              className="px-4 md:px-5 py-2.5"
            >
              {isLoggedIn ? "Profile" : "Login"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
