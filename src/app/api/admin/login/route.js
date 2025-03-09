import db from '@/lib/db'
import { sign } from 'jsonwebtoken'

// Clave secreta para firmar el JWT (en producción debería estar en variables de entorno)
const JWT_SECRET = 'tuppers_admin_secret_key'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validar que se proporcionaron email y password
    if (!email || !password) {
      return Response.json({ error: 'Email y contraseña son requeridos' }, { status: 400 })
    }

    // Buscar el usuario en la base de datos
    const query = `SELECT * FROM users WHERE email = ? AND rol = 'admin' LIMIT 1`
    const user = await db.execute({ sql: query, args: [email] })

    // Verificar si el usuario existe
    if (!user.rows || user.rows.length === 0) {
      return Response.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const userData = user.rows[0]

    // Verificar la contraseña (en producción debería estar hasheada)
    if (userData.password !== password) {
      return Response.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    // Generar token JWT
    const token = sign(
      { 
        id: userData.id, 
        email: userData.email,
        name: userData.name,
        role: userData.rol
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    )

    // Devolver token y datos básicos del usuario
    return Response.json({
      token,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email
      }
    })
  } catch (error) {
    console.error('Error en login:', error)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 