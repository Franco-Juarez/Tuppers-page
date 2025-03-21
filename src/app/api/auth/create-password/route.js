import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { mail, password } = await request.json();

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.execute('UPDATE usuarios_autorizados SET contraseña = ? WHERE mail = ?', [hashedPassword, mail]);
        
        return NextResponse.json({
            success: true,
            message: 'Contraseña actualizada correctamente'
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Error al actualizar la contraseña'
        }, { status: 500 });
    }
}