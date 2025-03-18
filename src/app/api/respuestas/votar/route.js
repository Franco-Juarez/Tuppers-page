import { NextResponse } from "next/server";
import db from "@/lib/db";

// Votar por una respuesta
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validar datos requeridos
    if (!data.id_respuesta) {
      return NextResponse.json(
        { error: "Se requiere el ID de la respuesta" },
        { status: 400 }
      );
    }

    // Verificar que la respuesta existe
    const checkQuery = "SELECT id_respuesta FROM respuestas WHERE id_respuesta = ?";
    const checkResult = await db.execute(checkQuery, [data.id_respuesta]);

    if (!checkResult.rows.length) {
      return NextResponse.json(
        { error: "La respuesta no existe" },
        { status: 404 }
      );
    }

    // Incrementar el contador de votos
    const updateQuery = "UPDATE respuestas SET votos = votos + 1 WHERE id_respuesta = ?";
    await db.execute(updateQuery, [data.id_respuesta]);
    
    return NextResponse.json(
      { message: "Voto registrado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al votar:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 