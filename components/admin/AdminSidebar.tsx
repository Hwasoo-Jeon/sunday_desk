import Link from "next/link";
import { signOutAction } from "@/actions/auth";
import { BRAND } from "@/lib/brand";

const adminNavItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/generator", label: "Generator" },
  { href: "/admin/outputs", label: "Outputs" }
];

export function AdminSidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-line bg-white px-5 py-6 md:block">
      <Link href="/admin" className="block text-base font-semibold text-ink">
        {BRAND.name}
      </Link>
      <nav className="mt-8 space-y-1">
        {adminNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-md px-3 py-2 text-sm text-muted hover:bg-panel hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <form action={signOutAction} className="mt-8">
        <button
          type="submit"
          className="w-full rounded-md border border-line px-3 py-2 text-left text-sm text-muted hover:bg-panel hover:text-ink"
        >
          Logout
        </button>
      </form>
    </aside>
  );
}
