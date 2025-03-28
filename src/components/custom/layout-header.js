"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";

export function LayoutHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-10 flex justify-between w-full h-16 items-center gap-4 border-b bg-background px-2">
      <h2 className="hidden md:block md:text-lg font-semibold">Tecnicatura Universitaria en Programación</h2>
      {!isHome && (
        <Button variant="secondary" className="ml-auto">
            <ChevronLeftIcon className="h-4 w-4" />
            <Link href="/">Dashboard</Link>
        </Button>
      )}
    </header>
  );
}