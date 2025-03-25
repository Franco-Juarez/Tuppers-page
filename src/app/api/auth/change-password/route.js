import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

const obtenerCodigo = () => Math.floor(100000 + Math.random() * 900000).toString();

// Pide el mail al usuario, genera el codigo, lo hashea y lo guarda en la base de datos.
// CAMBIÉ EL MÉTODO DE PUT A POST PARA DESPUÉS USAR EL PUT PARA CAMBIAR LA CONTRASEÑA EN LA MISMA RUTA.
export async function POST(request) {
    try {
        const { mail } = await request.json();

        const codigoRecuperacion = obtenerCodigo();
        console.log(codigoRecuperacion)

        // PODRÍAMOS INVOCAR LA FUNCIÓN DE MANDAR MAIL ACÁ Y LE PASAMOS EL MAIL Y CÓDIGO SIN HASHEAR. 
        // EJEMPLO: sendMail(mail, codigoRecuperacion);
        // LA FUNCIÓN PODRÍA RETORNAR UN BOOLEANO PARA INDICAR SI EL MAIL SE ENVIÓ CORRECTAMENTE Y ASI VERIFICARLO EN ESTE CÓDIGO. SI NO SE ENVIÓ, RETORNAR UN ERROR.
        // ¿QUÉ TE PARECE ESTA IDEA? SI SE TE OCURRE OTRA FORMA, LO CHARLAMOS Y AJUSTAMOS :)

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

// CAMBIO DE CONTRASEÑA 
// RECICLÉ EL QUE HABÍA ARMADO ANTES, FIJATE QUE TE PARECE, CREO QUE LE HACEN FALTA 
// ALGUNAS VALIDACIONES PARA LOS DATOS QUE RECIBE Y MANEJA, NO?
export async function PUT(request) {
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




