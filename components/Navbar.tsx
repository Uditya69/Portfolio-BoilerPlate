"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Settings {
  fullName: string;
}

export default function Navbar() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as Settings);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          {settings?.fullName || "Portfolio"}
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <Link href="/projects" className="hover:text-primary">
            Projects
          </Link>
          <Link href="/about" className="hover:text-primary">
            About
          </Link>
          <Link href="/contact" className="hover:text-primary">
            Contact
          </Link>
          <ThemeToggle />
          {/* Admin  btn hidden on production */}
          {/* <Link href="/admin"> */}
            {/* <Button variant="outline">Admin</Button> */}
          {/* </Link> */}
        </div>
      </div>
    </nav>
  );
} 