import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: "Se requiere un correo electrónico" },
        { status: 400 }
      )
    }

    // Verificar si la tabla tiene las columnas necesarias
    try {
      const checkColumnsQuery = "PRAGMA table_info(users)"
      const columnsResult = await db.execute(checkColumnsQuery)
      
      const columns = columnsResult.rows.map(row => row.name)
      console.log('Columnas existentes:', columns)
      
      const hasResetTokenColumn = columns.includes('reset_token')
      const hasExpiryColumn = columns.includes('reset_token_expiry')
      
      if (!hasResetTokenColumn || !hasExpiryColumn) {
        console.error('La tabla users no tiene las columnas necesarias para el restablecimiento de contraseña')
        return NextResponse.json(
          { error: "La base de datos no está configurada correctamente. Por favor, ejecuta /api/debug/db-setup primero." },
          { status: 500 }
        )
      }
    } catch (error) {
      console.error('Error al verificar la estructura de la tabla:', error)
      return NextResponse.json(
        { error: "Error al verificar la estructura de la base de datos", message: error.message },
        { status: 500 }
      )
    }

    // Verificar si el usuario existe
    const query = "SELECT * FROM users WHERE email = ?"
    const result = await db.execute(query, [email])
    
    if (!result.rows.length) {
      // Por seguridad, no revelamos si el correo existe o no
      return NextResponse.json(
        { success: true, message: "Si el correo existe, recibirás un enlace para restablecer tu contraseña" },
        { status: 200 }
      )
    }

    const user = result.rows[0]
    
    // Generar token de restablecimiento
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hora
    
    // Guardar token en la base de datos
    try {
      const updateQuery = "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?"
      await db.execute(updateQuery, [resetToken, resetTokenExpiry.toISOString(), user.id])
    } catch (error) {
      console.error('Error al guardar el token de restablecimiento:', error)
      return NextResponse.json(
        { error: "Error al guardar el token de restablecimiento", message: error.message },
        { status: 500 }
      )
    }
    
    // Enviar correo electrónico (siempre al correo específico)
    const recipientEmail = process.env.EMAIL_RECIPIENT
    console.log('Enviando correo de restablecimiento a:', recipientEmail)
    
    try {
      const emailResult = await sendPasswordResetEmail(recipientEmail, resetToken, user.id)
      
      if (!emailResult.success) {
        console.error('Error al enviar correo:', emailResult.error)
        return NextResponse.json(
          { error: "Error al enviar el correo de restablecimiento", message: emailResult.error },
          { status: 500 }
        )
      }
    } catch (error) {
      console.error('Error al enviar correo:', error)
      return NextResponse.json(
        { error: "Error al enviar el correo de restablecimiento", message: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { success: true, message: "Se ha enviado un enlace de restablecimiento a tu correo electrónico" },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error al solicitar restablecimiento:', error)
    return NextResponse.json(
      { error: "Error al procesar la solicitud", message: error.message, stack: error.stack },
      { status: 500 }
    )
  }
} 