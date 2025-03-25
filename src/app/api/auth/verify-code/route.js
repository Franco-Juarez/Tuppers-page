// ARMÉ ESTA RUTA PARA VERIFICAR EL CÓDIGO ENVIADO AL MAIL. ¿CREES QUE HACE FALTA UNA RUTA NUEVA PARA ESTO O ESTA LÓGICA IRÍA TAMBIÉN EN CHANGE-PASSWORD?

import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

// Verifica:
// Obtiene el codigo asociado al mail desde la base de datos
// Lo compara con el codigo ingresado por el usuario
// Si son iguales redirecciona a la pagina de actualizar usuario.
export async function PUT(request) {
    try {
        const { mail, codigo} = await request.json();

        const [rows] = await db.execute('SELECT codigo_recuperacion FROM usuarios_autorizados WHERE mail = ? AND codigo_recuperacion IS NOT NULL', [mail]);

        const codigoHasheado = rows[0].codigo_recuperacion;

        const esIgual = await bcrypt.compare(codigo, codigoHasheado);

        if (esIgual) {
            return //redireccionar;
        } else {
            return NextResponse.json({ success: false, message: "Código incorrecto" });
        }

    } catch (error) {
        return NextResponse.json({ success: false, message: "Error al verificar el código" });
    }
}
