import { NextResponse } from "next/server";
import db from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Función auxiliar para verificar si el usuario es admin
async function checkAdminUser(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("session_token")?.value;
    
    if (!token) {
      return false;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.role === 'admin';
  } catch (error) {
    return false;
  }
}

// Obtener respuestas (con filtros opcionales)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const idConsulta = searchParams.get("idConsulta");
    const idRespuesta = searchParams.get("idRespuesta");
    
    // Verificar si el usuario es administrador (para poder ver respuestas rechazadas)
    const isAdminUser = await checkAdminUser(req);
    
    let query = `
      SELECT 
        r.id_respuesta,
        r.contenido,
        r.id_consulta,
        r.fecha_creacion,
        r.votos,
        r.estado,
        r.reportada,
        r.nombre_autor,
        r.email_autor
      FROM respuestas r
      JOIN consultas c ON r.id_consulta = c.id_consulta
    `;

    let params = [];
    let conditions = [];

    // Filtrar por consulta
    if (idConsulta) {
      conditions.push('r.id_consulta = ?');
      params.push(idConsulta);
    }

    // Filtrar por ID de respuesta
    if (idRespuesta) {
      conditions.push('r.id_respuesta = ?');
      params.push(idRespuesta);
    }

    // Si no es admin, mostrar solo las respuestas de consultas aprobadas
    if (!isAdminUser) {
      conditions.push('c.estado = ?');
      params.push('aprobada');
      
      // Y mostrar solo respuestas aprobadas
      conditions.push('r.estado = ?');
      params.push('aprobada');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Ordenar por votos (más votados primero)
    query += ' ORDER BY r.votos DESC, r.fecha_creacion DESC';
    
    const result = await db.execute(query, params);
    
    if (!result || !result.rows) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error al obtener respuestas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Crear una nueva respuesta
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validar datos requeridos
    if (!data.contenido || !data.id_consulta || !data.nombre_autor) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Verificar que la consulta existe y está aprobada
    const consultaQuery = "SELECT id_consulta, estado FROM consultas WHERE id_consulta = ?";
    const consultaResult = await db.execute(consultaQuery, [data.id_consulta]);

    if (!consultaResult.rows.length) {
      return NextResponse.json(
        { error: "La consulta especificada no existe" },
        { status: 404 }
      );
    }

    if (consultaResult.rows[0].estado !== 'aprobada') {
      return NextResponse.json(
        { error: "No se pueden agregar respuestas a consultas no aprobadas" },
        { status: 403 }
      );
    }

    // Insertar nueva respuesta (estado aprobada por defecto)
    const query = `
      INSERT INTO respuestas (
        contenido,
        id_consulta,
        estado,
        votos,
        reportada,
        nombre_autor,
        email_autor
      ) VALUES (?, ?, 'aprobada', 0, 0, ?, ?)
    `;

    const params = [
      data.contenido,
      data.id_consulta,
      data.nombre_autor,
      data.email_autor || ''
    ];

    const result = await db.execute(query, params);
    
    // Convertir BigInt a Number para poder serializarlo
    const insertId = Number(result.lastInsertRowid);
    
    return NextResponse.json(
      { 
        message: "Respuesta enviada correctamente.", 
        id: insertId
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear respuesta:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 