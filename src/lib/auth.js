import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'

// Clave secreta para verificar el JWT (debe ser la misma que se usó para firmarlo)
const JWT_SECRET = process.env.SECRET_KEY || 'default-secret-key'

/**
 * Verifica un token JWT y devuelve los datos decodificados
 * @param {string} token - Token JWT a verificar
 * @returns {Object} - Datos decodificados del token
 * @throws {Error} - Si el token es inválido o ha expirado
 */
export function verifyToken(token) {
  try {
    return verify(token, JWT_SECRET)
  } catch (error) {
    throw error
  }
}

/**
 * Middleware para verificar si el usuario es administrador
 * @param {Request} request - Objeto de solicitud
 * @returns {Object} - Datos del usuario o respuesta de error
 */
export async function isAdmin(request) {
  // Obtener la cookie de autenticación
  const cookieStore = await cookies()
  const token = cookieStore.get('adminToken')?.value
  
  if (!token) {
    return { error: 'No autorizado', status: 401 }
  }
  
  try {
    const decoded = verifyToken(token)
    
    if (decoded.role !== 'admin') {
      return { error: 'No autorizado', status: 403 }
    }
    
    return { error: null, user: decoded }
  } catch (error) {
    return { error: 'Token inválido', status: 401 }
  }
} 