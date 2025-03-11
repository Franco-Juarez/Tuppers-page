'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import calculateProgress from "@/hooks/calculateProgress"

export default function MateriasPage() {
  const [materias, setMaterias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const response = await fetch('/api/materias')
        if (!response.ok) throw new Error('Error al obtener materias')
        const data = await response.json()
        setMaterias(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMaterias()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Materias</h1>
        <p className="text-muted-foreground">
          Listado de todas las materias de la carrera
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p>Cargando materias...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materias.map((materia) => {
            const progress = calculateProgress(materia.fechaInicio, materia.fechaFinal)
            return (
              <Link key={materia.id_materia} href={`/materias/${materia.id_materia}`}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{materia.nombre}</CardTitle>
                    <p className="text-sm text-muted-foreground">{materia.profesor}</p>
                  </CardHeader>
                  <CardContent>
                    <Progress value={progress} className="h-2 mb-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
} 