'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MessageSquare, Plus } from "lucide-react"

export default function ConsultasPage() {
  const [consultas, setConsultas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const response = await fetch('/api/consultas')
        if (!response.ok) throw new Error('Error al obtener consultas')
        const data = await response.json()
        setConsultas(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchConsultas()
  }, [])

  // Función para formatear la fecha
  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString)
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Consultas</h1>
          <p className="text-muted-foreground">
            Listado de todas las consultas realizadas
          </p>
        </div>
        <Link href="/consultas/nueva">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva Consulta
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p>Cargando consultas...</p>
        </div>
      ) : consultas.length === 0 ? (
        <div className="text-center py-10">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No hay consultas</h3>
          <p className="mt-2 text-muted-foreground">
            Comienza creando una nueva consulta.
          </p>
          <Link href="/consultas/nueva" className="mt-4 inline-block">
            <Button>Nueva Consulta</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {consultas.map((consulta) => (
            <Link key={consulta.id_consulta} href={`/consultas/${consulta.id_consulta}`}>
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{consulta.titulo}</CardTitle>
                    <Badge variant={consulta.estado === 'Resuelta' ? 'success' : 'secondary'}>
                      {consulta.estado}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Materia: {consulta.materia}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm">
                    {consulta.descripcion}
                  </p>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  Creada el {formatearFecha(consulta.fecha_creacion)}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 