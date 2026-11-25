"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CloseIcon, DropletIcon, MenuIcon } from "./icons";

const links = [
  { href: "/donors", label: "Find donors" },
  { href: "/register", label: "Become a donor" },
  { href: "/dashboard", label: "My dashboard" },
  { href: "/requests", label: "Request blood" },
  { href: "/track", label: "Track request" },
  { href: "/admin", label: "Admin" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="grid size-9 place-items-center rounded-xl bg-rose-600 text-white shadow-sm shadow-rose-600/25">
            <DropletIcon className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-[1.05rem] font-bold tracking-tight text-slate-900">
              LifeLink
            </span>
            <span className="block text-[0.65rem] font-medium uppercase tracking-[0.14em] text-slate-500">
              Blood donor network
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-rose-50 text-rose-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/register" className="btn-primary btn-sm">
            Register as donor
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="btn-ghost size-10 !p-0 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? (
            <CloseIcon className="size-5" />
          ) : (
            <MenuIcon className="size-5" />
          )}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="container-page grid gap-1 py-3">
            {links.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                    active
                      ? "bg-rose-50 text-rose-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2"
            >
              Register as donor
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
