import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "sonner";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  try {
    const docRef = doc(db, "settings", "general");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const settings = docSnap.data();
      return {
        title: settings.siteTitle || "Portfolio",
        description: settings.siteDescription || "Personal portfolio website",
        keywords: settings.keywords || [],
        openGraph: {
          title: settings.siteTitle,
          description: settings.siteDescription,
          images: settings.ogImage ? [settings.ogImage] : [],
        },
        twitter: {
          card: "summary_large_image",
          title: settings.siteTitle,
          description: settings.siteDescription,
          images: settings.ogImage ? [settings.ogImage] : [],
          creator: settings.twitterHandle,
        },
      };
    }
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }

  return {
    title: "Portfolio",
    description: "Personal portfolio website",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-full bg-background")}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
