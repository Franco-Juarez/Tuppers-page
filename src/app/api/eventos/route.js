import { NextResponse } from 'next/server'

// Datos de ejemplo para eventos
const eventos = [
  {
    id: 1,
    titulo: 'Parcial Programación I',
    fecha: '2024-04-15',
    tipo: 'examen',
    descripcion: 'Primer parcial de Programación I'
  },
  {
    id: 2,
    titulo: 'Entrega TP Matemática',
    fecha: '2024-04-20',
    tipo: 'entrega',
    descripcion: 'Entrega del trabajo práctico de Matemática'
  },
  {
    id: 3,
    titulo: 'Inicio de clases 2do cuatrimestre',
    fecha: '2024-08-12',
    tipo: 'evento',
    descripcion: 'Inicio de clases del segundo cuatrimestre'
  },
  {
    id: 4,
    titulo: 'Recuperatorio Programación I',
    fecha: '2024-05-10',
    tipo: 'examen',
    descripcion: 'Recuperatorio del primer parcial de Programación I'
  },
  {
    id: 5,
    titulo: 'Entrega Proyecto Final',
    fecha: '2024-06-25',
    tipo: 'entrega',
    descripcion: 'Entrega del proyecto final del cuatrimestre'
  }
]

export async function GET() {
  // Simular un pequeño retraso para mostrar el estado de carga
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return NextResponse.json(eventos)
} 