import { NextResponse } from "next/server";
import db from "@/lib/db";
// import { isAdmin } from "@/lib/auth";

export async function GET (req) {
  try {
    const { searchParams } = new URL(req.url);
    const idMateria = searchParams.get("idMateria");

    let query = `
      SELECT 
        id_materia,
        nombre, 
        profesor, 
        email, 
        fechaInicio, 
        fechaFinal, 
        horarioCursada, 
        descripcion, 
        recursos 
      FROM materias`;

    let params = [];

    if (idMateria) {
      query += ' WHERE id_materia = ?';
      params.push(idMateria);
    }

    const result = await db.execute(query, params);

    if (!result || !result.rows.length) {
      return NextResponse.json({ error: "No hay datos disponibles" }, { status: 404 });
    }

    return NextResponse.json(result.rows, { status: 200 });

  } catch (error) {
    console.error("Error al obtener materias:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Crear una nueva materia
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validar datos requeridos
    if (!data.nombre || !data.profesor) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Insertar nueva materia
    const query = `
      INSERT INTO materias (
        nombre, 
        profesor, 
        email, 
        fechaInicio, 
        fechaFinal, 
        horarioCursada, 
        descripcion, 
        recursos
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      data.nombre,
      data.profesor,
      data.email || '',
      data.fechaInicio || null,
      data.fechaFinal || null,
      data.horarioCursada || '',
      data.descripcion || '',
      data.recursos || ''
    ];

    const result = await db.execute(query, params);
    
    return NextResponse.json(
      { 
        message: "Materia creada correctamente", 
        id: result.lastInsertRowid 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear materia:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Actualizar una materia existente usando PATCH en lugar de PUT
export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idMateria = searchParams.get("id");
    const data = await request.json();
    
    // Validar ID de materia
    if (!idMateria) {
      return NextResponse.json(
        { error: "Se requiere el ID de la materia" },
        { status: 400 }
      );
    }

    // Verificar si la materia existe
    console.log("Verificando existencia de materia con ID:", idMateria);
    const checkQuery = "SELECT id_materia FROM materias WHERE id_materia = ?";
    const checkResult = await db.execute(checkQuery, [idMateria]);
    console.log("Resultado de verificación:", checkResult.rows);

    if (!checkResult.rows.length) {
      return NextResponse.json(
        { error: "La materia no existe" },
        { status: 404 }
      );
    }

    // Construir query dinámicamente basado en los campos proporcionados
    let updateFields = [];
    let params = [];

    if (data.nombre !== undefined) {
      updateFields.push("nombre = ?");
      params.push(data.nombre);
    }
    
    if (data.profesor !== undefined) {
      updateFields.push("profesor = ?");
      params.push(data.profesor);
    }
    
    if (data.email !== undefined) {
      updateFields.push("email = ?");
      params.push(data.email);
    }
    
    if (data.fechaInicio !== undefined) {
      updateFields.push("fechaInicio = ?");
      params.push(data.fechaInicio);
    }
    
    if (data.fechaFinal !== undefined) {
      updateFields.push("fechaFinal = ?");
      params.push(data.fechaFinal);
    }
    
    if (data.horarioCursada !== undefined) {
      updateFields.push("horarioCursada = ?");
      params.push(data.horarioCursada);
    }
    
    if (data.descripcion !== undefined) {
      updateFields.push("descripcion = ?");
      params.push(data.descripcion);
    }
    
    if (data.recursos !== undefined) {
      updateFields.push("recursos = ?");
      params.push(data.recursos);
    }

    // Si no hay campos para actualizar
    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron campos para actualizar" },
        { status: 400 }
      );
    }

    // Agregar el ID de la materia a los parámetros
    params.push(idMateria);

    const query = `
      UPDATE materias 
      SET ${updateFields.join(", ")} 
      WHERE id_materia = ?
    `;

    await db.execute(query, params);
    
    return NextResponse.json(
      { message: "Materia actualizada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar materia:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Eliminar una materia
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idMateria = searchParams.get("id");

    if (!idMateria) {
      return NextResponse.json(
        { error: "Se requiere el ID de la materia" },
        { status: 400 }
      );
    }

    // Verificar si la materia existe
    const checkQuery = "SELECT id_materia FROM materias WHERE id_materia = ?";
    const checkResult = await db.execute(checkQuery, [idMateria]);

    if (!checkResult.rows.length) {
      return NextResponse.json(
        { error: "La materia no existe" },
        { status: 404 }
      );
    }

    // Eliminar la materia
    const deleteQuery = "DELETE FROM materias WHERE id_materia = ?";
    await db.execute(deleteQuery, [idMateria]);
    
    return NextResponse.json(
      { message: "Materia eliminada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar materia:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}