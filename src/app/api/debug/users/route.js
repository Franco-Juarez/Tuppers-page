import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req) {
  try {
    // Verificar la estructura de la tabla users
    const tableInfoQuery = "PRAGMA table_info(users)";
    const tableInfo = await db.execute(tableInfoQuery);
    
    // Obtener todos los usuarios
    const usersQuery = "SELECT id, name, email, role, created_at FROM users";
    const users = await db.execute(usersQuery);
    
    return NextResponse.json({
      usersTableInfo: tableInfo.rows,
      users: users.rows
    }, { status: 200 });
  } catch (error) {
    console.error("Error al depurar la tabla de usuarios:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 