import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET (req) {
  try {
    const { searchParams } = new URL(req.url);
    const idMateria = searchParams.get("idMateria");

    // Validar parámetro obligatorio
    if (!idMateria) {
      return NextResponse.json(
        { error: "Parámetro idMateria es requerido" },
        { status: 400 }
      );
    }

    // Query parametrizada para prevenir SQL Injection
    const query = `
      SELECT materia_correlativa, tipo, id_correlatividad
      FROM correlatividad 
      WHERE id_materia = ?
    `;

    const params = [idMateria];
    const result = await db.execute(query, params);

    // Mejor manejo de respuesta vacía
    if (!result || result.rows.length === 0) {
      return NextResponse.json(
        { message: "No se encontraron correlatividades" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows, { status: 200 });

  } catch (e) {
    console.error("Error en GET /api/correlatividad:", e);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}