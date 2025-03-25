'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import {
Dialog,
DialogContent,
DialogDescription,
DialogHeader,
DialogTitle,
} from "@/components/ui/dialog"

// HOLA! BUENO, VAMOS CON LA PARTE DE LA RUTA Y LO CHARLAMOS AHÍ
//aca estas?
export default function ChangePassword() {
  const router = useRouter();
  const [mail, setMail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeForm, setCodeForm] = useState(false);
  const [codeValue, setCodeValue] = useState('');
  const [dialog, setDialog] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al verificar el email');
      }

      setCodeForm(true);
      setLoading(false);
      alert('Codigo enviado al mail');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const response = await fetch('/api/auth/verify-code', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mail, codeValue }),
        });

        const data = await response.json();

        // ACÁ REVISA QUE DEVUELVE 200
        if (!response.ok) {
          throw new Error(data.error || 'Error al verificar el codigo');
        }

        setDialog(true);
        setCode('');
        setLoading(false);

        //Redireccionar a login para probar nueva contraseña luego de cerrar el dialogo
        // ESTO ES MEDIO BARDO, PERO FIJATE QUE ESTOY REDIRECCIONANDO A LA PÁGINA DE CAMBIO DE CONTRASEÑA, 
        // QUE ES DONDE EL USUARIO VA A INGRESAR LA NUEVA CONTRASEÑA. LA REDICCIÓN SE HACE UNA VEZ QUE EL ENDPOINT DEVUELVE UN 200.

        setTimeout(() => {
          router.push(`/login/update-password?email=${mail}`);
        }, 3000);

    } catch(error) {
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
                {codeForm ? (
                    <p>Ingresá el codigo enviado al mail</p>
                ) : (
                    <p>Ingresá tu email para verificar acceso</p>
                )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {codeForm ? (
                <form className="space-y-4" onSubmit={handleCodeSubmit}>
                    <InputOTP maxLength={6} value={code} onChange={(value) => setCode(value)}>
                        <InputOTPGroup className="mx-auto">
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Verificando..." : "Ingresar"}
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                        <Label htmlFor="mail">Email</Label>
                        <Input
                            id="mail"
                            placeholder="nombre@ejemplo.com"
                            type="email"
                            value={mail}
                            onChange={(e) => setMail(e.target.value)}
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
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Solo administradores autorizados pueden acceder
            </p>
          </CardFooter>
        </Card>
      </div>
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Código enviado al mail</DialogTitle>
            </DialogHeader>
            <DialogDescription>
                El código ha sido enviado al mail ingresado. Lo redirigiremos a la pagina de login...
            </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>

  );
}
