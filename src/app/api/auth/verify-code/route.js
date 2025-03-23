// ARMÉ ESTA RUTA PARA VERIFICAR EL CÓDIGO ENVIADO AL MAIL. ¿CREES QUE HACE FALTA UNA RUTA NUEVA PARA ESTO O ESTA LÓGICA IRÍA TAMBIÉN EN CHANGE-PASSWORD?

import { NextResponse } from 'next/server';


export async function POST(request) {
    const { code } = await request.json();

    // Aquí puedes verificar el código con la base de datos o con cualquier otra lógica
    // Por ahora, solo devolveremos un mensaje de éxito

    console.log(code);
    return NextResponse.json({ message: 'Código verificado correctamente' });
}




