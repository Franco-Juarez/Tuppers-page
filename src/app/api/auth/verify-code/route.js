import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

// Verifica:
// Obtiene el codigo asociado al mail desde la base de datos
// Lo compara con el codigo ingresado por el usuario
// Si son iguales redirecciona a la pagina de actualizar usuario.
export async function PUT(request) {
    try {
        const { mail, code } = await request.json();

        const codigo = await db.execute('SELECT codigo_recuperacion FROM usuarios_autorizados WHERE mail = ?', [mail]);
        
        const codigoHasheado = codigo.rows[0].codigo_recuperacion;

        const esIgual = await bcrypt.compare(code, codigoHasheado);

        if (esIgual) {
            return NextResponse.json({
                message: 'Codigo verificado correctamente'
            }, { status: 200 });
        } else {
            return NextResponse.json({
                message: 'Codigo incorrecto'
            }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({
            message: 'Error al verificar el codigo'
        }, { status: 500 });
    }
}
