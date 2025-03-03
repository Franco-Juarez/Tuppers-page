import { NextResponse } from "next/server";
import db from "@/lib/db";

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