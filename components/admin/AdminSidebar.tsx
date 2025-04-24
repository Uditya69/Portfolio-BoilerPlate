"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/admin" },
  { name: "Projects", href: "/admin/projects" },
  { name: "Skills", href: "/admin/skills" },
  { name: "Contact", href: "/admin/contact" },
  { name: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-muted/40">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="font-semibold">
          Admin Panel
        </Link>
      </div>
      <nav className="space-y-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
} 