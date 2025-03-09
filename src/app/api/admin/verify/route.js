import { isAdmin } from '@/lib/auth'

export async function GET(request) {
  const result = await isAdmin(request)
  
  if (result.error) {
    return Response.json({ error: result.error }, { status: result.status })
  }
  
  // Devolver información del usuario
  return Response.json({
    id: result.user.id,
    name: result.user.name,
    email: result.user.email
  })
} 