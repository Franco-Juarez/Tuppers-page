import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    // Eliminar la cookie de autenticación
    const cookieStore = await cookies()
    cookieStore.delete('adminToken')
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en logout:', error)
    return NextResponse.json(
      { error: "Error al cerrar sesión" },
      { status: 500 }
    )
  }
} 