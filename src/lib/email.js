import nodemailer from 'nodemailer';

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS_APP,
  },
  debug: true, // Habilitar logs de depuración
  logger: true // Habilitar logger
});

// Verificar la configuración al iniciar
transporter.verify(function(error, success) {
  if (error) {
    console.error('Error en la configuración del transporte de correo:', error);
  } else {
    console.log('Servidor de correo listo para enviar mensajes');
    console.log('Usando cuenta:', process.env.EMAIL_USER);
  }
});

/**
 * Envía un correo electrónico
 * @param {Object} options - Opciones del correo
 * @param {string} options.to - Destinatario
 * @param {string} options.subject - Asunto
 * @param {string} options.text - Texto plano
 * @param {string} options.html - Contenido HTML
 * @returns {Promise} - Promesa con el resultado del envío
 */
export async function sendEmail({ to, subject, text, html }) {
  try {
    // Verificar que las credenciales estén configuradas
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS_APP) {
      console.error('Credenciales de correo no configuradas');
      return { 
        success: false, 
        error: 'Credenciales de correo no configuradas. Verifica las variables EMAIL_USER y EMAIL_PASS_APP en el archivo .env' 
      };
    }

    const mailOptions = {
      from: `"Tuppers App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    console.log('Intentando enviar correo a:', to);
    console.log('Configuración de correo:', {
      from: `"Tuppers App" <${process.env.EMAIL_USER}>`,
      to,
      subject
    });
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return { 
      success: false, 
      error: error.message,
      stack: error.stack,
      code: error.code,
      command: error.command
    };
  }
}

/**
 * Envía un correo de restablecimiento de contraseña
 * @param {string} to - Correo del destinatario
 * @param {string} resetToken - Token de restablecimiento
 * @param {string} userId - ID del usuario
 * @returns {Promise} - Resultado del envío
 */
export async function sendPasswordResetEmail(to, resetToken, userId) {
  // Usar el correo específico del administrador
  const recipientEmail = process.env.EMAIL_RECIPIENT;
  
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&id=${userId}`;
  
  const subject = 'Restablecimiento de contraseña - Tuppers';
  
  const text = `
    Has solicitado restablecer tu contraseña.
    
    Por favor, haz clic en el siguiente enlace para establecer una nueva contraseña:
    ${resetUrl}
    
    Si no solicitaste este cambio, puedes ignorar este correo.
    
    Este enlace expirará en 1 hora.
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Restablecimiento de contraseña</h2>
      <p>Has solicitado restablecer tu contraseña.</p>
      <p>Haz clic en el siguiente botón para establecer una nueva contraseña:</p>
      <p style="text-align: center;">
        <a href="${resetUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Restablecer contraseña
        </a>
      </p>
      <p>O copia y pega el siguiente enlace en tu navegador:</p>
      <p style="word-break: break-all; color: #4F46E5;">${resetUrl}</p>
      <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
      <p><strong>Este enlace expirará en 1 hora.</strong></p>
      <hr style="margin-top: 20px; border: none; border-top: 1px solid #eaeaea;" />
      <p style="color: #666; font-size: 12px;">Tuppers - Tecnicatura Universitaria en Programación</p>
    </div>
  `;
  
  return sendEmail({ to: recipientEmail, subject, text, html });
} 