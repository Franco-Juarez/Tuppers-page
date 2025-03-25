import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const obtenerCodigo = () => Math.floor(100000 + Math.random() * 900000).toString();

// Pide el mail al usuario, genera el codigo, lo hashea y lo guarda en la base de datos.
// CAMBIÉ EL MÉTODO DE PUT A POST PARA DESPUÉS USAR EL PUT PARA CAMBIAR LA CONTRASEÑA EN LA MISMA RUTA.
export async function POST(request) {
    try {
        const { mail } = await request.json();

        const codigoRecuperacion = obtenerCodigo();
        console.log(codigoRecuperacion)

        // PODRÍAMOS INVOCAR LA FUNCIÓN DE MANDAR MAIL ACÁ Y LE PASAMOS EL MAIL Y CÓDIGO SIN HASHEAR. 
        sendMail(mail, codigoRecuperacion);

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

        if (!mail || !password) {
            return NextResponse.json({
                success: false,
                message: 'Datos incompletos'
            }, { status: 400 });
        }

        if( mail === '' || password === ''){
            return NextResponse.json({
                success: false,
                message: 'Datos incompletos'
            }, { status: 400 });
        }
            
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.execute('UPDATE usuarios_autorizados SET contraseña = ? WHERE mail = ?', [hashedPassword, mail]);

        if (result.affectedRows === 0) {
            return NextResponse.json({
                success: false,
                message: 'Email no encontrado'
            }, { status: 400 });
        }
        
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


// FUNCIÓN PARA MANDAR MAIL CON NODEMAILER

const sendMail = async (mail, password) => { 
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
          clientId: process.env.OAUTH_CLIENTID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
      });

      let mailOptions = {
        from: {mail},
        to: {password},
        subject: 'Nodemailer Project',
        text: 'Este es el código de recuperación de contraseña: ' + password,
      };

      transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Mail enviado correctamente");
        }
      });
}




