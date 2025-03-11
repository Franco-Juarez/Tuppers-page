'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, KeyRound } from "lucide-react"
import Link from "next/link"

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Efecto para redirigir después de un inicio de sesión exitoso
  useEffect(() => {
    if (success) {
      // Usar un pequeño retraso para asegurarse de que la cookie se haya establecido
      const redirectTimer = setTimeout(() => {
        // Redirigir a la página intermedia en lugar de directamente a /admin
        window.location.href = '/redirect-to-admin';
      }, 1500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setSuccess(false)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión')
      }

      setSuccess(true);
      
    } catch (err) {
      setError(err.message)
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  // Función para forzar la redirección manualmente
  const handleManualRedirect = () => {
    window.location.href = '/redirect-to-admin';
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Acceso Administrativo</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al panel de administración
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4 bg-green-50 border-green-500 text-green-700">
              <AlertCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                Inicio de sesión exitoso. Redirigiendo al panel de administración...
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-green-700 underline" 
                  onClick={handleManualRedirect}
                >
                  Haz clic aquí si no eres redirigido automáticamente
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-right">
              <Link 
                href="/forgot-password" 
                className="text-sm text-muted-foreground hover:text-primary flex items-center justify-end gap-1"
              >
                <KeyRound className="h-3 w-3" />
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={loading || success}>
              {loading ? 'Iniciando sesión...' : success ? 'Redirigiendo...' : 'Iniciar sesión'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 