import { NextResponse } from 'next/server'
import db from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { token, userId, password } = await request.json()
    
    if (!token || !userId || !password) {
      return NextResponse.json(
        { error: "Se requieren todos los campos" },
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      )
    }

    // Verificar si el token es válido
    const query = "SELECT * FROM users WHERE id = ? AND reset_token = ? AND reset_token_expiry > ?"
    const now = new Date().toISOString()
    const result = await db.execute(query, [userId, token, now])
    
    if (!result.rows.length) {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 400 }
      )
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Actualizar la contraseña y limpiar el token
    const updateQuery = "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?"
    await db.execute(updateQuery, [hashedPassword, userId])
    
    return NextResponse.json(
      { success: true, message: "Contraseña actualizada correctamente" },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error al restablecer contraseña:', error)
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
} 