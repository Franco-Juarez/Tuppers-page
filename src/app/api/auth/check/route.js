import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

export async function GET(req) {
  try {
    // 1. Obtener token de la cookie
    const token = req.cookies.get('session_token')?.value;

    // 2. Verificar existencia del token
    if (!token) {
      return NextResponse.json(
        { isValid: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    // 3. Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Obtener usuario de la base de datos
    const result = await db.execute('SELECT * FROM users WHERE id = ?', [decoded.userId]);
    const user = result.rows[0];

    // 5. Respuesta condicional
    if (!user) {
      return NextResponse.json(
        { isValid: false, error: 'User not found' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      isValid: true,
      user: {
        id: user.id,
        name: user.name,
        mail: user.mail
      }
    });
  } catch (error) {
    console.error('Error en check:', error);
    return NextResponse.json(
      { isValid: false, error: 'Invalid token' },
      { status: 401 }
    );
  }
}
