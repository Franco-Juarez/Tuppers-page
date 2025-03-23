import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

const obtenerCodigoCodigo = () => Math.floor(100000 + Math.random() * 900000).toString();

export async function PUT(request) {
    try {
        const { mail } = await request.json();

        const codigoRecuperacion = obtenerCodigo();

        const hashedCodigo = await bcrypt.hash(codigoRecuperacion, 10);

        const result = await db.execute('UPDATE usuarios_autorizados SET codigo_recuperacion = ? WHERE mail = ?', [hashedCodigo, mail]);
        
        return NextResponse.json({
            success: true,
            message: 'Codigo actualizado correctamente'
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Error al actualizar el codigo'
        }, { status: 500 });
    }
}

/**
 * Enviar el codigo al mail
 */

/**
 * Comparar el codigo ingresado con el de la base de datos y modificar contraseña
 */
