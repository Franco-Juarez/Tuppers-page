import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import db from '@/lib/db'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({
        error: "Se requieren email y password"
      }, { status: 400 })
    }
    
    // Verificar si el usuario existe
    const checkQuery = "SELECT * FROM users WHERE email = ?"
    const checkResult = await db.execute(checkQuery, [email])
    
    if (!checkResult.rows.length) {
      return NextResponse.json({
        error: "Usuario no encontrado"
      }, { status: 404 })
    }
    
    // Generar hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Actualizar la contraseña en la base de datos
    const updateQuery = "UPDATE users SET password = ? WHERE email = ?"
    await db.execute(updateQuery, [hashedPassword, email])
    
    return NextResponse.json({
      success: true,
      message: "Contraseña actualizada correctamente",
      email,
      hashedPassword
    })
  } catch (error) {
    console.error('Error al hashear contraseña:', error)
    return NextResponse.json({
      error: "Error al hashear la contraseña",
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
} 