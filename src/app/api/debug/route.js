import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req) {
  try {
    // Verificar la estructura de la tabla consultas
    const tableInfoQuery = "PRAGMA table_info(consultas)";
    const tableInfo = await db.execute(tableInfoQuery);
    
    // Contar consultas por estado
    const countQuery = "SELECT estado, COUNT(*) as count FROM consultas GROUP BY estado";
    const countResult = await db.execute(countQuery);
    
    // Obtener todas las consultas
    const consultasQuery = "SELECT * FROM consultas";
    const consultas = await db.execute(consultasQuery);
    
    // Verificar la estructura de la tabla respuestas
    const respuestasTableInfoQuery = "PRAGMA table_info(respuestas)";
    const respuestasTableInfo = await db.execute(respuestasTableInfoQuery);
    
    return NextResponse.json({
      consultasTableInfo: tableInfo.rows,
      consultasPorEstado: countResult.rows,
      consultas: consultas.rows,
      respuestasTableInfo: respuestasTableInfo.rows
    }, { status: 200 });
  } catch (error) {
    console.error("Error al depurar la base de datos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 