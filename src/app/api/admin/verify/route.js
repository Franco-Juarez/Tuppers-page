import { isAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const result = await isAdmin(request)
  
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }
  
  // Devolver información del usuario
  return NextResponse.json({
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    role: result.user.role
  })
} 