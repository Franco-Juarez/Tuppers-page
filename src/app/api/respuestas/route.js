import { NextResponse } from "next/server";
import db from "@/lib/db";
import { isAdmin } from "@/lib/auth";

// Obtener respuestas para una consulta específica
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const idConsulta = searchParams.get("idConsulta");
    const soloNoRevisadas = searchParams.get("noRevisadas") === "1";
    const soloReportadas = searchParams.get("reportadas") === "1";

    if (!idConsulta && !soloNoRevisadas && !soloReportadas) {
      return NextResponse.json(
        { error: "Se requiere el ID de la consulta o filtros específicos" },
        { status: 400 }
      );
    }

    let query = `
      SELECT 
        id_respuesta,
        id_consulta,
        contenido,
        fecha_creacion,
        estado,
        revisada,
        reportada,
        es_solucion,
        votos,
        nombre_autor,
        email_autor
      FROM respuestas
    `;

    // Verificar autenticación
    let isAdminUser = false;
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const authResult = await isAdmin(req);
      isAdminUser = !authResult.error;
    }

    let conditions = [];
    let params = [];

    // Filtrar por consulta
    if (idConsulta) {
      conditions.push('id_consulta = ?');
      params.push(idConsulta);
    }

    // Filtrar por no revisadas (solo para admin)
    if (soloNoRevisadas && isAdminUser) {
      conditions.push('revisada = 0');
    }

    // Filtrar por reportadas (solo para admin)
    if (soloReportadas && isAdminUser) {
      conditions.push('reportada = 1');
    }

    // Por defecto, mostrar solo las aprobadas a menos que sea admin
    if (!isAdminUser) {
      conditions.push('estado = ?');
      params.push('aprobada');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Ordenar por solución primero, luego por fecha (más recientes primero)
    query += ' ORDER BY es_solucion DESC, fecha_creacion ASC';

    const result = await db.execute(query, params);

    if (!result || !result.rows.length) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
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
    if (!data.id_consulta || !data.contenido || !data.nombre_autor) {
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
        { error: "No se pueden agregar respuestas a consultas que no están aprobadas" },
        { status: 400 }
      );
    }

    // Insertar nueva respuesta (estado aprobada por defecto, pero marcada como no revisada)
    const query = `
      INSERT INTO respuestas (
        id_consulta,
        contenido,
        estado,
        revisada,
        nombre_autor,
        email_autor
      ) VALUES (?, ?, 'aprobada', 0, ?, ?)
    `;

    const params = [
      data.id_consulta,
      data.contenido,
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

// Actualizar una respuesta (solo admin)
export async function PUT(request) {
  // Verificar que el usuario es administrador
  const authResult = await isAdmin(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const data = await request.json();
    
    // Validar ID de respuesta
    if (!data.id_respuesta) {
      return NextResponse.json(
        { error: "Se requiere el ID de la respuesta" },
        { status: 400 }
      );
    }

    // Construir query dinámicamente basado en los campos proporcionados
    let updateFields = [];
    let params = [];

    if (data.contenido !== undefined) {
      updateFields.push("contenido = ?");
      params.push(data.contenido);
    }
    
    if (data.estado !== undefined) {
      updateFields.push("estado = ?");
      params.push(data.estado);
    }
    
    if (data.revisada !== undefined) {
      updateFields.push("revisada = ?");
      params.push(data.revisada ? 1 : 0);
    }
    
    if (data.reportada !== undefined) {
      updateFields.push("reportada = ?");
      params.push(data.reportada ? 1 : 0);
    }
    
    if (data.es_solucion !== undefined) {
      updateFields.push("es_solucion = ?");
      params.push(data.es_solucion ? 1 : 0);
      
      // Si se marca como solución, desmarcar otras respuestas de la misma consulta
      if (data.es_solucion) {
        // Obtener el ID de la consulta
        const respuestaQuery = "SELECT id_consulta FROM respuestas WHERE id_respuesta = ?";
        const respuestaResult = await db.execute(respuestaQuery, [data.id_respuesta]);
        
        if (respuestaResult.rows.length > 0) {
          const idConsulta = respuestaResult.rows[0].id_consulta;
          
          // Desmarcar otras respuestas
          const desmarcarQuery = "UPDATE respuestas SET es_solucion = 0 WHERE id_consulta = ? AND id_respuesta != ?";
          await db.execute(desmarcarQuery, [idConsulta, data.id_respuesta]);
        }
      }
    }

    // Si no hay campos para actualizar
    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron campos para actualizar" },
        { status: 400 }
      );
    }

    // Agregar el ID de la respuesta a los parámetros
    params.push(data.id_respuesta);

    const query = `
      UPDATE respuestas 
      SET ${updateFields.join(", ")} 
      WHERE id_respuesta = ?
    `;

    await db.execute(query, params);
    
    return NextResponse.json(
      { message: "Respuesta actualizada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar respuesta:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Eliminar una respuesta (solo admin)
export async function DELETE(request) {
  // Verificar que el usuario es administrador
  const authResult = await isAdmin(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const idRespuesta = searchParams.get("idRespuesta");

    if (!idRespuesta) {
      return NextResponse.json(
        { error: "Se requiere el ID de la respuesta" },
        { status: 400 }
      );
    }

    // Verificar si la respuesta existe
    const checkQuery = "SELECT id_respuesta FROM respuestas WHERE id_respuesta = ?";
    const checkResult = await db.execute(checkQuery, [idRespuesta]);

    if (!checkResult.rows.length) {
      return NextResponse.json(
        { error: "La respuesta no existe" },
        { status: 404 }
      );
    }

    // Eliminar la respuesta
    const deleteQuery = "DELETE FROM respuestas WHERE id_respuesta = ?";
    await db.execute(deleteQuery, [idRespuesta]);
    
    return NextResponse.json(
      { message: "Respuesta eliminada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar respuesta:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 