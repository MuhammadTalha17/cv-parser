"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "CV Parser" },
    { href: "/ats", label: "ATS Score" },
  ];

  return (
    <aside className="hidden lg:flex lg:h-screen lg:w-72 lg:flex-col lg:justify-between lg:sticky lg:top-0 lg:border-r lg:border-black/10 lg:bg-black lg:p-6">
      <div>
        <p className="px-2 text-4xl font-black tracking-tight text-white">
          CVParser
        </p>

        <nav className="mt-10 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-md px-4 py-3 text-sm font-semibold tracking-wide transition-colors ${
                pathname === item.href
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="space-y-3">
        {/* <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">
            Status
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-sm font-medium text-white">System Online</p>
          </div>
        </div> */}
      </div>
    </aside>
  );
}
