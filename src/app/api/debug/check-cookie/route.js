import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'

// Clave secreta para verificar el JWT (debe coincidir con la usada para firmar)
const JWT_SECRET = process.env.SECRET_KEY || 'default-secret-key'

export async function GET() {
  try {
    // Obtener todas las cookies
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    
    // Buscar la cookie de autenticación
    const adminToken = cookieStore.get('adminToken')
    
    let decodedToken = null
    let isValid = false
    
    // Si hay token, intentar decodificarlo
    if (adminToken?.value) {
      try {
        decodedToken = verify(adminToken.value, JWT_SECRET)
        isValid = true
      } catch (error) {
        console.error('Error al verificar token:', error)
      }
    }
    
    return NextResponse.json({
      success: true,
      hasCookie: !!adminToken,
      cookieValue: adminToken ? {
        name: adminToken.name,
        value: adminToken.value ? `${adminToken.value.substring(0, 20)}...` : null,
        expires: adminToken.expires,
        path: adminToken.path,
        domain: adminToken.domain,
        secure: adminToken.secure,
        httpOnly: adminToken.httpOnly
      } : null,
      allCookies: allCookies.map(cookie => ({
        name: cookie.name,
        value: cookie.value ? `${cookie.value.substring(0, 10)}...` : null
      })),
      decodedToken: isValid ? {
        id: decodedToken.id,
        email: decodedToken.email,
        role: decodedToken.role,
        exp: new Date(decodedToken.exp * 1000).toLocaleString()
      } : null,
      isValid
    })
  } catch (error) {
    console.error('Error al verificar cookie:', error)
    return NextResponse.json({
      error: "Error al verificar cookie",
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
} 