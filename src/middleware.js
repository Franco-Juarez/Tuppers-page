import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

// Clave secreta para verificar el JWT (debe coincidir con la usada para firmar)
const JWT_SECRET = process.env.SECRET_KEY || 'default-secret-key'

// Rutas que requieren autenticación de administrador
const adminRoutes = ['/admin']

// Rutas que deben ser excluidas del middleware
const excludedRoutes = ['/admin-login', '/redirect-to-admin', '/api/']

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Verificar si la ruta está excluida
  if (excludedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  // Verificar si la ruta requiere autenticación de administrador
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    // Obtener la cookie de autenticación
    const adminToken = request.cookies.get('adminToken')?.value
    
    if (!adminToken) {
      // Redirigir al login si no hay token
      const loginUrl = new URL('/admin-login', request.url)
      return NextResponse.redirect(loginUrl)
    }
    
    try {
      // Verificar el token
      const decoded = verify(adminToken, JWT_SECRET)
      
      // Token válido, permitir acceso
      const response = NextResponse.next()
      return response
    } catch (error) {
      // Token inválido, redirigir al login
      const loginUrl = new URL('/admin-login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  // Para otras rutas, continuar normalmente
  return NextResponse.next()
}

// Configurar las rutas en las que se ejecutará el middleware
export const config = {
  matcher: [
    '/admin/:path*',
    '/redirect-to-admin',
  ],
} 