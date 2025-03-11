import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    // Obtener información sobre la tabla users
    const usersQuery = "PRAGMA table_info(users)"
    const usersResult = await db.execute(usersQuery)
    
    // Obtener los primeros registros de la tabla users (sin mostrar contraseñas completas)
    const usersDataQuery = "SELECT id, email, role, substr(password, 1, 10) || '...' as password_preview FROM users LIMIT 5"
    const usersDataResult = await db.execute(usersDataQuery)
    
    return NextResponse.json({
      success: true,
      usersTableStructure: usersResult.rows,
      usersData: usersDataResult.rows
    })
  } catch (error) {
    console.error('Error en debug/db:', error)
    return NextResponse.json({
      error: "Error al obtener información de la base de datos",
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
} 