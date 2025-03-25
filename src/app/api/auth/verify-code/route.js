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
        const { mail, codigo } = await request.json();
        console.log(mail, codigo);

        const [rows] = await db.execute('SELECT codigo_recuperacion FROM usuarios_autorizados WHERE mail = ? AND codigo_recuperacion IS NOT NULL', [mail]);

        const codigoHasheado = rows[0].codigo_recuperacion;

        const esIgual = await bcrypt.compare(codigo, codigoHasheado);


        // ACÁ HICE UNOS AJUSTES PARA QUE DEVUELVA EL STATUS QUE FALTABA, EL RESTO JOYA!
        // AHORA LO QUQ QUIERO PROBAR ES QUE SI EL CODIGO ES CORRECTO, REDIRECCIONE A LA PÁGINA DE CAMBIO DE CONTRASEÑA. PERO, COMO NO TENEMOS LO DEL MAIL, LO ESTOY MOSTRANDO POR CONSOLA.
        // POR CONSOLA, JEJE. 
        // ah joya, una vez que tengamos la pagina se redireccionaria ahi, que seria la funcion de cambiar la contrasenia en change-password no?
        // AHÍ TE MUESTRO COMO ES ESO. VAMOS AL ARCHIVO LOGIN/CHANGE-PASSWORD/PAGE.JS Y CHARLAMOS AHÍ
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
