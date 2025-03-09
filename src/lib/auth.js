import { verify } from 'jsonwebtoken'

// Clave secreta para verificar el JWT (debe ser la misma que se usó para firmarlo)
const JWT_SECRET = 'tuppers_admin_secret_key'

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
 * @returns {Object|Response} - Datos del usuario o respuesta de error
 */
export async function isAdmin(request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Token no proporcionado', status: 401 }
    }
    
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    
    if (decoded.role !== 'admin') {
      return { error: 'Acceso no autorizado', status: 403 }
    }
    
    return { user: decoded }
  } catch (error) {
    console.error('Error de autenticación:', error)
    
    if (error.name === 'TokenExpiredError') {
      return { error: 'Token expirado', status: 401 }
    }
    
    if (error.name === 'JsonWebTokenError') {
      return { error: 'Token inválido', status: 401 }
    }
    
    return { error: 'Error interno del servidor', status: 500 }
  }
} 