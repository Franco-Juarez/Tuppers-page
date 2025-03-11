import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { password, hash } = await request.json()
    
    if (!password || !hash) {
      return NextResponse.json({
        error: "Se requieren password y hash"
      }, { status: 400 })
    }
    
    // Verificar si la contraseña coincide con el hash
    const isMatch = await bcrypt.compare(password, hash)
    
    // Generar un nuevo hash para la contraseña (para comparación)
    const newHash = await bcrypt.hash(password, 10)
    
    return NextResponse.json({
      success: true,
      isMatch,
      passwordLength: password.length,
      hashLength: hash.length,
      newHash,
      newHashLength: newHash.length
    })
  } catch (error) {
    console.error('Error en debug/bcrypt:', error)
    return NextResponse.json({
      error: "Error al verificar la contraseña",
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
} 