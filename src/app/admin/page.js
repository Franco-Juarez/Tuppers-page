'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Calendar, PenLine } from "lucide-react";

// Importar los componentes de administración
import MateriasPanel from '@/components/admin/MateriasPanel';
import ConsultasPanel from '@/components/admin/ConsultasPanel';
import ExamenesPanel from '@/components/admin/ExamenesPanel';
import LogoutButton from '@/components/LogoutButton';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        
        if (data.isValid) {
          setUser(data.user);
        } else {
          // Redirigir a login si no está autenticado
          router.push('/login');
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-gray-500">Gestiona materias, consultas y exámenes</p>
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>{user.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name || 'Administrador'}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <LogoutButton />
            </div>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      <Tabs defaultValue="materias" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="materias" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Materias
          </TabsTrigger>
          <TabsTrigger value="consultas" className="flex items-center">
            <PenLine className="h-4 w-4 mr-2" />
            Consultas
          </TabsTrigger>
          <TabsTrigger value="examenes" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Exámenes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="materias">
          <MateriasPanel />
        </TabsContent>
        
        <TabsContent value="consultas">
          <ConsultasPanel />
        </TabsContent>
        
        <TabsContent value="examenes">
          <ExamenesPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
} 