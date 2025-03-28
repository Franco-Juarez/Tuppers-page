import { AuthProvider } from "@/context/auth";
import "./globals.css";
import { Sidebar } from "@/components/custom/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { LayoutHeader } from "@/components/custom/layout-header";

export const metadata = {
  title: "Tuppers",
  description: "Tecnicatura Universitaria en Programación",
};

export default function RootLayout({ children }) {

  return (
    <html lang="es">
      <body className="antialiased">
        <AuthProvider>
        <div className="flex min-h-screen">
          <aside className="fixed inset-y-0 z-20 hidden w-64 flex-shrink-0 border-r bg-background md:sticky md:flex md:flex-col">
            <div className="flex h-16 items-center border-b px-6">
              <h1 className="text-lg font-semibold">Tuppers</h1>
            </div>
            <Sidebar />
          </aside>
          <div className="flex flex-1 flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
              <div className="md:hidden">
                <Sidebar />
              </div>
              <LayoutHeader />
            </header>
            <main className="flex-1 p-6 bg-muted/40">
              {children}
            </main>
          </div>
        </div>
        </AuthProvider>
      </body>
    </html>
  );
}
