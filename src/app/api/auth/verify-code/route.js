// ARMÉ ESTA RUTA PARA VERIFICAR EL CÓDIGO ENVIADO AL MAIL. ¿CREES QUE HACE FALTA UNA RUTA NUEVA PARA ESTO O ESTA LÓGICA IRÍA TAMBIÉN EN CHANGE-PASSWORD?

import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

// Verifica y cambia la contraseña:
// Obtiene el codigo asociado al mail desde la base de datos
// Lo compara con el codigo ingresado por el usuario
// Si son iguales, modifica la contraseña
export async function PUT(request) {
    try {
        const { mail, codigo , nuevaContrasenia} = await request.json();

        const [rows] = await db.execute('SELECT codigo_recuperacion FROM usuarios_autorizados WHERE mail = ? AND codigo_recuperacion IS NOT NULL', [mail]);

        const codigoHasheado = rows[0].codigo_recuperacion;

        const esIgual = await bcrypt.compare(codigo, codigoHasheado);

        if (!esIgual) {
            return NextResponse.json({message: 'Código incorrecto' });
        }

        const contraHasheada = await bcrypt.hash(nuevaContrasenia, 10);
        
        await db.execute('UPDATE usuarios_autorizados SET contraseña = ?, codigo_recuperacion = NULL WHERE mail = ?', [contraHasheada, mail]);

        return NextResponse.json({message: 'Contraseña actualizada correctamente' });

    } catch (error) {
        return NextResponse.json({message: 'Error al verificar el código o cambiar la contraseña' });
    }
}
