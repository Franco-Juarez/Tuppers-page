import { NextResponse } from "next/server";
import db from "@/lib/db";

// Reportar una consulta o respuesta
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validar datos requeridos
    if (!data.type || !data.id) {
      return NextResponse.json(
        { error: "Se requiere el tipo (consulta o respuesta) y el ID" },
        { status: 400 }
      );
    }

    if (data.type !== 'consulta' && data.type !== 'respuesta') {
      return NextResponse.json(
        { error: "El tipo debe ser 'consulta' o 'respuesta'" },
        { status: 400 }
      );
    }

    // Verificar que el elemento existe
    let checkQuery, updateQuery;
    if (data.type === 'consulta') {
      checkQuery = "SELECT id_consulta FROM consultas WHERE id_consulta = ?";
      updateQuery = "UPDATE consultas SET reportada = 1 WHERE id_consulta = ?";
    } else {
      checkQuery = "SELECT id_respuesta FROM respuestas WHERE id_respuesta = ?";
      updateQuery = "UPDATE respuestas SET reportada = 1 WHERE id_respuesta = ?";
    }

    const checkResult = await db.execute(checkQuery, [data.id]);

    if (!checkResult.rows.length) {
      return NextResponse.json(
        { error: `El/La ${data.type} especificado/a no existe` },
        { status: 404 }
      );
    }

    // Marcar como reportado
    await db.execute(updateQuery, [data.id]);
    
    return NextResponse.json(
      { message: `${data.type === 'consulta' ? 'Consulta' : 'Respuesta'} reportada correctamente` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al reportar:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 