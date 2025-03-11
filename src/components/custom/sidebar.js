"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  Settings, 
  Menu, 
  LogOut,
  User
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Inicio",
    icon: Home,
    href: "/",
  },
  {
    label: "Materias",
    icon: BookOpen,
    href: "/materias",
  },
  {
    label: "Consultas",
    icon: MessageSquare,
    href: "/consultas",
  },
  {
    label: "Calendario",
    icon: Calendar,
    href: "/calendario",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verificar si el usuario es admin mediante una llamada a la API
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/admin/verify', {
          credentials: 'include' // Importante para incluir cookies
        });
        
        if (response.ok) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error al verificar admin:', error);
        setIsAdmin(false);
      }
    };
    
    checkAdmin();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      setIsAdmin(false);
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <ScrollArea className="h-full">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 py-4 text-lg font-semibold">Navegación</h2>
              <div className="space-y-1">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === route.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <route.icon className="h-5 w-5" />
                    {route.label}
                  </Link>
                ))}
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <nav className="hidden md:block">
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === route.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        </ScrollArea>
      </nav>
    </>
  );
} 