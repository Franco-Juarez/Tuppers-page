'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton({ variant = "outline", size = "sm" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        router.push('/login');
      } else {
        console.error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleLogout} 
      disabled={loading}
      className="flex items-center"
    >
      <LogOut className="h-4 w-4 mr-2" />
      {loading ? "Cerrando sesión..." : "Cerrar sesión"}
    </Button>
  );
} 