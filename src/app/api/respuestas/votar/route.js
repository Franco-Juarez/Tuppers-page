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
    const respuestaQuery = "SELECT id_respuesta, id_consulta FROM respuestas WHERE id_respuesta = ?";
    const respuestaResult = await db.execute(respuestaQuery, [data.id_respuesta]);

    if (!respuestaResult.rows.length) {
      return NextResponse.json(
        { error: "La respuesta especificada no existe" },
        { status: 404 }
      );
    }

    // Incrementar el contador de votos
    const updateQuery = "UPDATE respuestas SET votos = votos + 1 WHERE id_respuesta = ?";
    await db.execute(updateQuery, [data.id_respuesta]);
    
    // Verificar si esta respuesta ahora tiene más votos que cualquier otra en la misma consulta
    const idConsulta = respuestaResult.rows[0].id_consulta;
    
    // Obtener la respuesta con más votos
    const maxVotosQuery = `
      SELECT id_respuesta, votos 
      FROM respuestas 
      WHERE id_consulta = ? 
      ORDER BY votos DESC 
      LIMIT 1
    `;
    const maxVotosResult = await db.execute(maxVotosQuery, [idConsulta]);
    
    if (maxVotosResult.rows.length > 0) {
      const respuestaConMasVotos = maxVotosResult.rows[0];
      
      // Si la respuesta con más votos tiene al menos 3 votos, marcarla como solución
      if (respuestaConMasVotos.votos >= 3) {
        // Primero, desmarcar todas las respuestas como solución
        await db.execute(
          "UPDATE respuestas SET es_solucion = 0 WHERE id_consulta = ?", 
          [idConsulta]
        );
        
        // Luego, marcar la respuesta con más votos como solución
        await db.execute(
          "UPDATE respuestas SET es_solucion = 1 WHERE id_respuesta = ?", 
          [respuestaConMasVotos.id_respuesta]
        );
      }
    }
    
    return NextResponse.json(
      { message: "Voto registrado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al votar por la respuesta:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 