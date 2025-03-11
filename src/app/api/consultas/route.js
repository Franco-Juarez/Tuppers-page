import { NextResponse } from "next/server";
import db from "@/lib/db";
import { isAdmin } from "@/lib/auth";

// Obtener consultas (con filtros opcionales)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const idMateria = searchParams.get("idMateria");
    const idConsulta = searchParams.get("idConsulta");
    const estado = searchParams.get("estado");
    const soloNoRevisadas = searchParams.get("noRevisadas") === "1";
    const soloReportadas = searchParams.get("reportadas") === "1";
    
    let query = `
      SELECT 
        c.id_consulta,
        c.titulo,
        c.descripcion,
        c.id_materia,
        m.nombre as materia,
        c.fecha_creacion,
        c.estado,
        c.revisada,
        c.reportada,
        (SELECT COUNT(*) FROM respuestas WHERE id_consulta = c.id_consulta) as num_respuestas
      FROM consultas c
      LEFT JOIN materias m ON c.id_materia = m.id_materia
    `;

    let params = [];
    let conditions = [];

    // Filtrar por materia
    if (idMateria) {
      conditions.push('c.id_materia = ?');
      params.push(idMateria);
    }

    // Filtrar por ID de consulta
    if (idConsulta) {
      conditions.push('c.id_consulta = ?');
      params.push(idConsulta);
    }

    // Verificar autenticación
    let isAdminUser = false;
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const authResult = await isAdmin(req);
      isAdminUser = !authResult.error;
    }

    // Filtrar por estado
    if (estado && estado !== 'all') {
      conditions.push('c.estado = ?');
      params.push(estado);
    } else if (!estado || estado !== 'all') {
      // Si no es admin o no se especificó 'all', mostrar solo las aprobadas
      if (!isAdminUser) {
        conditions.push('c.estado = ?');
        params.push('aprobada');
      }
    }

    // Filtrar por no revisadas (solo para admin)
    if (soloNoRevisadas && isAdminUser) {
      conditions.push('c.revisada = 0');
    }

    // Filtrar por reportadas (solo para admin)
    if (soloReportadas && isAdminUser) {
      conditions.push('c.reportada = 1');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Ordenar por fecha de creación (más recientes primero)
    query += ' ORDER BY c.fecha_creacion DESC';
    
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

// Crear una nueva consulta
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validar datos requeridos
    if (!data.titulo || !data.descripcion || !data.id_materia || !data.nombre_autor) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Verificar que la materia existe
    const materiaQuery = "SELECT id_materia FROM materias WHERE id_materia = ?";
    const materiaResult = await db.execute(materiaQuery, [data.id_materia]);

    if (!materiaResult.rows.length) {
      return NextResponse.json(
        { error: "La materia especificada no existe" },
        { status: 404 }
      );
    }

    // Insertar nueva consulta (estado aprobada por defecto, pero marcada como no revisada)
    const query = `
      INSERT INTO consultas (
        titulo, 
        descripcion, 
        id_materia,
        estado,
        revisada,
        nombre_autor,
        email_autor
      ) VALUES (?, ?, ?, 'aprobada', 0, ?, ?)
    `;

    const params = [
      data.titulo,
      data.descripcion,
      data.id_materia,
      data.nombre_autor,
      data.email_autor || ''
    ];

    const result = await db.execute(query, params);
    
    // Convertir BigInt a Number para poder serializarlo
    const insertId = Number(result.lastInsertRowid);
    
    return NextResponse.json(
      { 
        message: "Consulta creada correctamente.", 
        id: insertId
      }, 
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Actualizar una consulta (solo admin)
export async function PUT(request) {
  // Verificar que el usuario es administrador
  const authResult = await isAdmin(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const data = await request.json();
    
    // Validar ID de consulta
    if (!data.id_consulta) {
      return NextResponse.json(
        { error: "Se requiere el ID de la consulta" },
        { status: 400 }
      );
    }

    // Construir query dinámicamente basado en los campos proporcionados
    let updateFields = [];
    let params = [];

    if (data.titulo !== undefined) {
      updateFields.push("titulo = ?");
      params.push(data.titulo);
    }
    
    if (data.descripcion !== undefined) {
      updateFields.push("descripcion = ?");
      params.push(data.descripcion);
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
    
    if (data.id_materia !== undefined) {
      // Verificar que la materia existe
      const materiaQuery = "SELECT id_materia FROM materias WHERE id_materia = ?";
      const materiaResult = await db.execute(materiaQuery, [data.id_materia]);

      if (!materiaResult.rows.length) {
        return NextResponse.json(
          { error: "La materia especificada no existe" },
          { status: 404 }
        );
      }
      
      updateFields.push("id_materia = ?");
      params.push(data.id_materia);
    }

    // Si no hay campos para actualizar
    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron campos para actualizar" },
        { status: 400 }
      );
    }

    // Agregar el ID de la consulta a los parámetros
    params.push(data.id_consulta);

    const query = `
      UPDATE consultas 
      SET ${updateFields.join(", ")} 
      WHERE id_consulta = ?
    `;

    await db.execute(query, params);
    
    return NextResponse.json(
      { message: "Consulta actualizada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Eliminar una consulta (solo admin)
export async function DELETE(request) {
  // Verificar que el usuario es administrador
  const authResult = await isAdmin(request);
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const idConsulta = searchParams.get("idConsulta");

    if (!idConsulta) {
      return NextResponse.json(
        { error: "Se requiere el ID de la consulta" },
        { status: 400 }
      );
    }

    // Verificar si la consulta existe
    const checkQuery = "SELECT id_consulta FROM consultas WHERE id_consulta = ?";
    const checkResult = await db.execute(checkQuery, [idConsulta]);

    if (!checkResult.rows.length) {
      return NextResponse.json(
        { error: "La consulta no existe" },
        { status: 404 }
      );
    }

    // Eliminar primero las respuestas asociadas
    const deleteRespuestasQuery = "DELETE FROM respuestas WHERE id_consulta = ?";
    await db.execute(deleteRespuestasQuery, [idConsulta]);

    // Eliminar la consulta
    const deleteQuery = "DELETE FROM consultas WHERE id_consulta = ?";
    await db.execute(deleteQuery, [idConsulta]);
    
    return NextResponse.json(
      { message: "Consulta y sus respuestas eliminadas correctamente" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 