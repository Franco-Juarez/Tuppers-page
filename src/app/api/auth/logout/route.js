import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Soporte para método GET (para compatibilidad con código existente)
export function GET(request) {
  return handleLogout();
}

// Método POST para logout (más semánticamente correcto)
export async function POST(request) {
  return handleLogout();
}

// Función compartida para manejar el logout
function handleLogout() {
  const cookieStore = cookies();
  const token = cookieStore.get("session_token");

  try {
    // Eliminar la cookie de sesión, incluso si no existe
    cookieStore.delete("session_token");

    const response = NextResponse.json(
      { success: true, message: "Sesión cerrada correctamente" },
      { status: 200 }
    );

    // Para asegurar que la cookie se elimina en el navegador
    response.cookies.set({
      name: "session_token",
      value: "",
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}