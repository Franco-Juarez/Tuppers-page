import { NextResponse } from "next/server";
import db from "@/lib/db";
import { useAuth } from "@/context/auth";

export async function GET (req) {
  try {
    const { searchParams } = new URL(req.url);
    const idMateria = searchParams.get("idMateria");
    const idExamen = searchParams.get("idExamen");

    let query = `SELECT id_examen, titulo, consigna, id_materia, materia, fechaEntrega FROM examenes`;
    let params = [];
    let conditions = [];

    if (idMateria) {
      conditions.push('id_materia = ?');
      params.push(idMateria);
    }

    if (idExamen) {
      conditions.push('id_examen = ?');
      params.push(idExamen);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await db.execute(query, params);

    if (!result?.rows.length) {
      return NextResponse.json({ error: "No hay datos disponibles" }, { status: 404 });
    }

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error al obtener exámenes:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// Crear un nuevo examen
export async function POST(request) {
  const { user } = useAuth();
  
  // Verificar que el usuario es administrador
  if (!user || user.rol !== 'admin') {
    console.log("Acceso denegado");
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
  }

  try {
    const data = await request.json();
    
    // Validar datos requeridos
    if (!data.titulo || !data.id_materia || !data.fechaEntrega) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Obtener el nombre de la materia
    const materiaQuery = "SELECT nombre FROM materias WHERE id_materia = ?";
    const materiaResult = await db.execute(materiaQuery, [data.id_materia]);

    if (!materiaResult.rows.length) {
      return NextResponse.json(
        { error: "La materia especificada no existe" },
        { status: 404 }
      );
    }

    const nombreMateria = materiaResult.rows[0].nombre;

    // Insertar nuevo examen
    const query = `
      INSERT INTO examenes (
        titulo, 
        consigna, 
        id_materia, 
        materia, 
        fechaEntrega
      ) VALUES (?, ?, ?, ?, ?)
    `;

    const params = [
      data.titulo,
      data.consigna || '',
      data.id_materia,
      nombreMateria,
      data.fechaEntrega
    ];

    const result = await db.execute(query, params);
    
    return NextResponse.json(
      { 
        message: "Examen creado correctamente", 
        id: result.lastInsertRowid 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear examen:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// // Actualizar un examen existente
// export async function PUT(request) {
//   // Verificar que el usuario es administrador
//   const authResult = await isAdmin(request);
//   if (authResult.error) {
//     return NextResponse.json({ error: authResult.error }, { status: authResult.status });
//   }

//   try {
//     const data = await request.json();
    
//     // Validar ID de examen
//     if (!data.id_examen) {
//       return NextResponse.json(
//         { error: "Se requiere el ID del examen" },
//         { status: 400 }
//       );
//     }

//     // Construir query dinámicamente basado en los campos proporcionados
//     let updateFields = [];
//     let params = [];

//     if (data.titulo !== undefined) {
//       updateFields.push("titulo = ?");
//       params.push(data.titulo);
//     }
    
//     if (data.consigna !== undefined) {
//       updateFields.push("consigna = ?");
//       params.push(data.consigna);
//     }
    
//     if (data.fechaEntrega !== undefined) {
//       updateFields.push("fechaEntrega = ?");
//       params.push(data.fechaEntrega);
//     }
    
//     // Si se cambia la materia, actualizar también el nombre de la materia
//     if (data.id_materia !== undefined) {
//       // Obtener el nombre de la materia
//       const materiaQuery = "SELECT nombre FROM materias WHERE id_materia = ?";
//       const materiaResult = await db.execute(materiaQuery, [data.id_materia]);

//       if (!materiaResult.rows.length) {
//         return NextResponse.json(
//           { error: "La materia especificada no existe" },
//           { status: 404 }
//         );
//       }

//       const nombreMateria = materiaResult.rows[0].nombre;
      
//       updateFields.push("id_materia = ?");
//       params.push(data.id_materia);
      
//       updateFields.push("materia = ?");
//       params.push(nombreMateria);
//     }

//     // Si no hay campos para actualizar
//     if (updateFields.length === 0) {
//       return NextResponse.json(
//         { error: "No se proporcionaron campos para actualizar" },
//         { status: 400 }
//       );
//     }

//     // Agregar el ID del examen a los parámetros
//     params.push(data.id_examen);

//     const query = `
//       UPDATE examenes 
//       SET ${updateFields.join(", ")} 
//       WHERE id_examen = ?
//     `;

//     await db.execute(query, params);
    
//     return NextResponse.json(
//       { message: "Examen actualizado correctamente" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error al actualizar examen:", error);
//     return NextResponse.json(
//       { error: "Error interno del servidor" },
//       { status: 500 }
//     );
//   }
// }

// // Eliminar un examen
// export async function DELETE(request) {
//   // Verificar que el usuario es administrador
//   const authResult = await isAdmin(request);
//   if (authResult.error) {
//     return NextResponse.json({ error: authResult.error }, { status: authResult.status });
//   }

//   try {
//     const { searchParams } = new URL(request.url);
//     const idExamen = searchParams.get("idExamen");

//     if (!idExamen) {
//       return NextResponse.json(
//         { error: "Se requiere el ID del examen" },
//         { status: 400 }
//       );
//     }

//     // Verificar si el examen existe
//     const checkQuery = "SELECT id_examen FROM examenes WHERE id_examen = ?";
//     const checkResult = await db.execute(checkQuery, [idExamen]);

//     if (!checkResult.rows.length) {
//       return NextResponse.json(
//         { error: "El examen no existe" },
//         { status: 404 }
//       );
//     }

//     // Eliminar el examen
//     const deleteQuery = "DELETE FROM examenes WHERE id_examen = ?";
//     await db.execute(deleteQuery, [idExamen]);
    
//     return NextResponse.json(
//       { message: "Examen eliminado correctamente" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error al eliminar examen:", error);
//     return NextResponse.json(
//       { error: "Error interno del servidor" },
//       { status: 500 }
//     );
//   }
// }