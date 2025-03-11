'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar autenticación
        const response = await fetch('/api/admin/verify', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          setError('No autorizado. Por favor, inicia sesión.');
          
          // Solo redirigir si hemos agotado los reintentos
          if (retryCount >= 2) {
            setTimeout(() => {
              window.location.href = '/admin-login';
            }, 2000);
          }
        }
      } catch (error) {
        setError(`Error al verificar autenticación`);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [retryCount]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      window.location.href = '/admin-login';
    } catch (error) {
      // Error al cerrar sesión
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cargando panel de administración...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Panel de Administración</CardTitle>
          <CardDescription>
            Bienvenido al panel de administración de Tuppers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {error}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-white underline ml-2" 
                  onClick={handleRetry}
                >
                  Reintentar
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {userData ? (
            <div>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Rol:</strong> {userData.role || 'admin'}</p>
            </div>
          ) : (
            <p>No se pudo cargar la información del usuario.</p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogout} variant="outline">Cerrar sesión</Button>
        </CardFooter>
      </Card>
    </div>
  );
} 