'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';


export default function UpdatePassword() {
    return (
      <Suspense fallback={<div>Cargando...</div>}>
        <UpdatePasswordContent />
      </Suspense>
    );
  }


const UpdatePasswordContent = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [repetedPassword, setRepetedPassword] = useState('');

  const searchParams = useSearchParams();
  const mail = searchParams.get('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!mail) {
      setError('No se pudo obtener el email');
      setLoading(false);
      return;
    }

    if (password !== repetedPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al verificar el email');
      }

      setLoading(false);
      alert('Contraseña actualizada correctamente');
      router.push('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Restablecer contraseña</CardTitle>
            <CardDescription className="text-center">
                Ingresá una nueva contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                        <Label htmlFor="mail">Nueva contraseña</Label>
                        <Input
                            id="password"
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Label htmlFor="mail">Repetir contraseña</Label>
                        <Input
                            id="repeted-password"
                            type="text"
                            value={repetedPassword}
                            onChange={(e) => setRepetedPassword(e.target.value)}
                            required
                        />
                    </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Verificando..." : "Ingresar"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Solo administradores autorizados pueden acceder
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>

  );
}
