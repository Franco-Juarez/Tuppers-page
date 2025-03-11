import db from '@/lib/db'
import { sign } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Secret key for signing JWT (should be in environment variables)
const JWT_SECRET = process.env.SECRET_KEY || 'default-secret-key'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Se requiere email y contraseña" },
        { status: 400 }
      )
    }

    const query = "SELECT * FROM users WHERE email = ? AND role = 'admin'"
    const result = await db.execute(query, [email])
    
    if (!result.rows.length) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      )
    }

    const userData = result.rows[0]
    
    // Intentar comparar con bcrypt primero
    let passwordMatch = false;
    try {
      passwordMatch = await bcrypt.compare(password, userData.password);
    } catch (error) {
      // Si hay error, probablemente la contraseña no está hasheada
    }
    
    // Si bcrypt falla, comparar directamente (temporal, solo para migración)
    if (!passwordMatch) {
      passwordMatch = (password === userData.password);
      
      if (passwordMatch) {
        // Si la comparación directa funciona, hashear la contraseña para futuras sesiones
        try {
          const hashedPassword = await bcrypt.hash(password, 10);
          const updateQuery = "UPDATE users SET password = ? WHERE email = ?";
          await db.execute(updateQuery, [hashedPassword, email]);
        } catch (hashError) {
          // Error al actualizar contraseña
        }
      }
    }

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      )
    }

    const tokenPayload = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role
    }

    const token = sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' })

    // Configurar la cookie - Corregido para usar await
    const cookieStore = await cookies()
    
    // Establecer la cookie con opciones más permisivas para desarrollo
    cookieStore.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
      sameSite: 'lax' // Cambiado de 'strict' a 'lax' para permitir redirecciones
    })

    // Crear la respuesta con la cookie
    const response = NextResponse.json(
      { success: true, user: tokenPayload },
      { status: 200 }
    )
    
    // Establecer la cookie también en la respuesta directamente
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
      sameSite: 'lax'
    })
    
    return response
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
} 