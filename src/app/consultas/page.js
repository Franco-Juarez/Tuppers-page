'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MessageSquare, Plus, Search, X, Filter } from "lucide-react"
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ConsultasPage() {
  const [consultas, setConsultas] = useState([])
  const [materias, setMaterias] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroTexto, setFiltroTexto] = useState('')
  const [filtroMateria, setFiltroMateria] = useState('all')
  const [ordenamiento, setOrdenamiento] = useState('recientes')

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

    const fetchMaterias = async () => {
      try {
        const response = await fetch('/api/materias')
        if (!response.ok) throw new Error('Error al obtener materias')
        const data = await response.json()
        setMaterias(data)
      } catch (error) {
        console.error('Error al cargar materias:', error)
      }
    }

    fetchConsultas()
    fetchMaterias()
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

  // Filtrar consultas según el texto y materia seleccionada
  const consultasFiltradas = consultas.filter(consulta => {
    const textoFiltro = filtroTexto.toLowerCase();
    const cumpleFiltroTexto = 
      consulta.titulo.toLowerCase().includes(textoFiltro) ||
      consulta.descripcion.toLowerCase().includes(textoFiltro) ||
      consulta.materia.toLowerCase().includes(textoFiltro);
    
    const cumpleFiltroMateria = 
      filtroMateria === 'all' || 
      consulta.id_materia.toString() === filtroMateria;
    
    return cumpleFiltroTexto && cumpleFiltroMateria;
  });
  
  // Ordenar las consultas según el criterio seleccionado
  const consultasOrdenadas = [...consultasFiltradas].sort((a, b) => {
    const fechaA = new Date(a.fecha_creacion);
    const fechaB = new Date(b.fecha_creacion);
    
    if (ordenamiento === 'recientes') {
      return fechaB - fechaA;
    } else {
      return fechaA - fechaB;
    }
  });

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltroTexto('');
    setFiltroMateria('all');
    setOrdenamiento('recientes');
  };

  console.log(consultas)

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
      <Separator />
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2 items-center flex-grow">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)} 
                type="text" 
                placeholder="Buscar por título, descripción o materia" 
                className="pl-9 w-full"
              />
              {filtroTexto && (
                <button 
                  onClick={() => setFiltroTexto('')}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Select 
              value={filtroMateria} 
              onValueChange={setFiltroMateria}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filtrar por materia" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las materias</SelectItem>
                {materias.map(materia => (
                  <SelectItem key={materia.id_materia} value={materia.id_materia.toString()}>
                    {materia.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={ordenamiento} 
              onValueChange={setOrdenamiento}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M11 5h10"></path>
                    <path d="M11 9h7"></path>
                    <path d="M11 13h4"></path>
                    <path d="m3 17 3 3 3-3"></path>
                    <path d="M6 18V4"></path>
                  </svg>
                  <SelectValue placeholder="Ordenar por fecha" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recientes">Más recientes</SelectItem>
                <SelectItem value="antiguas">Más antiguas</SelectItem>
              </SelectContent>
            </Select>
            
            {(filtroTexto || filtroMateria !== 'all' || ordenamiento !== 'recientes') && (
              <Button variant="outline" size="sm" onClick={limpiarFiltros}>
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>
        
        {(filtroTexto || filtroMateria !== 'all' || ordenamiento !== 'recientes') && (
          <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
            <span>Mostrando {consultasOrdenadas.length} de {consultas.length} consultas</span>
            {filtroMateria !== 'all' && (
              <Badge variant="outline" className="ml-2">
                {materias.find(m => m.id_materia.toString() === filtroMateria)?.nombre || 'Materia seleccionada'}
              </Badge>
            )}
            {ordenamiento !== 'recientes' && (
              <Badge variant="outline" className="ml-2 bg-blue-50">
                Ordenado: Más antiguas primero
              </Badge>
            )}
          </div>
        )}
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
          {consultasOrdenadas.map((consulta) => (
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
                  <p>Creada el {formatearFecha(consulta.fecha_creacion)} por <Link className='hover:text-red-500' href={`mailto:${consulta.email_autor}`}>{consulta.nombre_autor}</Link></p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 