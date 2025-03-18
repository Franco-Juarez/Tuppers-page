import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

// app/api/auth/login/route.js
export async function POST(request) {
  try {
    const { mail } = await request.json();

    // 1. Buscar usuario en la base de datos por email
    const result = await db.execute('SELECT * FROM usuarios_autorizados WHERE mail = ?', [mail]);
    const user = result.rows[0];

    // 2. Verificar existencia
    if (!user) {
      return NextResponse.json(
        { error: "Email no encontrado" },
        { status: 401 }
      );
    }

    // 3. Crear token JWT con duración de 24 horas
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 4. Setear cookie segura
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        mail: user.mail,
      }
    });

    response.cookies.set({
      name: 'session_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 horas
    });

    return response;
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
