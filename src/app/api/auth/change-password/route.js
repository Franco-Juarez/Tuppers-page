import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

const obtenerCodigoCodigo = () => Math.floor(100000 + Math.random() * 900000).toString();

// Pide el mail al usuario, genera el codigo, lo hashea y lo guarda en la base de datos.
export async function PUT(request) {
    try {
        const { mail } = await request.json();

        const codigoRecuperacion = obtenerCodigo();

        const hashedCodigo = await bcrypt.hash(codigoRecuperacion, 10);

        const resultado = await db.execute('UPDATE usuarios_autorizados SET codigo_recuperacion = ? WHERE mail = ?', [hashedCodigo, mail]);
        
        return NextResponse.json({
            message: 'Codigo actualizado correctamente'
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            message: 'Error al actualizar el codigo'
        }, { status: 500 });
    }
}

//Enviar mail




