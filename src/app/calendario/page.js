'use client'

import { useState, useEffect } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { es } from 'date-fns/locale'

export default function CalendarioPage() {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState(new Date())
  const [eventosDia, setEventosDia] = useState([])

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch('/api/eventos')
        if (!response.ok) throw new Error('Error al obtener eventos')
        const data = await response.json()
        setEventos(data)
      } catch (error) {
        console.error('Error:', error)
        // Si hay error, usar datos de ejemplo
        setEventos([
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
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchEventos()
  }, [])

  // Función para verificar si una fecha tiene eventos
  const fechaTieneEventos = (date) => {
    const formattedDate = date.toISOString().split('T')[0]
    return eventos.some(evento => evento.fecha === formattedDate)
  }

  // Función para obtener los eventos de un día específico
  const obtenerEventosDia = (date) => {
    const formattedDate = date.toISOString().split('T')[0]
    return eventos.filter(evento => evento.fecha === formattedDate)
  }

  // Actualizar eventos del día seleccionado cuando cambia la fecha
  useEffect(() => {
    setEventosDia(obtenerEventosDia(date))
  }, [date, eventos])

  // Función para obtener el color de la insignia según el tipo de evento
  const getColorByTipo = (tipo) => {
    switch (tipo) {
      case 'examen':
        return 'destructive'
      case 'entrega':
        return 'warning'
      case 'evento':
        return 'secondary'
      default:
        return 'default'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendario Académico</h1>
        <p className="text-muted-foreground">
          Calendario con fechas importantes y eventos académicos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Calendario</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center min-h-[300px]">
                <p>Cargando calendario...</p>
              </div>
            ) : (
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={es}
                modifiers={{
                  hasEvent: (date) => fechaTieneEventos(date)
                }}
                modifiersClassNames={{
                  hasEvent: "bg-primary/20 font-bold"
                }}
                className="rounded-md border"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eventos del día</CardTitle>
          </CardHeader>
          <CardContent>
            {eventosDia.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No hay eventos para este día
              </p>
            ) : (
              <div className="space-y-4">
                {eventosDia.map((evento) => (
                  <div key={evento.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{evento.titulo}</h3>
                      <Badge variant={getColorByTipo(evento.tipo)}>
                        {evento.tipo}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {evento.descripcion}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 