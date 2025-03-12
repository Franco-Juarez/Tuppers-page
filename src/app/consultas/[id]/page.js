'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { MessageSquare, CheckCircle, Clock, AlertCircle, ArrowLeft, ThumbsUp, Flag } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ConsultaPage({ params }) {
  const [consulta, setConsulta] = useState(null)
  const [respuestas, setRespuestas] = useState([])
  const [nuevaRespuesta, setNuevaRespuesta] = useState('')
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [votando, setVotando] = useState(false)
  const [error, setError] = useState(null)
  const [mensaje, setMensaje] = useState(null)
  const router = useRouter()
  
  // Usar React.use() para desenvolver los parámetros
  const unwrappedParams = use(params)
  const idConsulta = unwrappedParams.id
  
  const [formData, setFormData] = useState({
    contenido: '',
    nombre_autor: '',
    email_autor: ''
  })
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Obtener la consulta
        const consultaResponse = await fetch(`/api/consultas?idConsulta=${idConsulta}`)
        
        if (!consultaResponse.ok) {
          throw new Error('Error al cargar la consulta')
        }
        
        const consultaData = await consultaResponse.json()
        
        if (!consultaData.length) {
          throw new Error('Consulta no encontrada')
        }
        
        setConsulta(consultaData[0])
        
        // Obtener las respuestas
        const respuestasResponse = await fetch(`/api/respuestas?idConsulta=${idConsulta}`)
        
        if (!respuestasResponse.ok) {
          throw new Error('Error al cargar las respuestas')
        }
        
        const respuestasData = await respuestasResponse.json()
        setRespuestas(respuestasData)
      } catch (error) {
        console.error('Error:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [idConsulta])
  
  const handleSubmitRespuesta = async (e) => {
    e.preventDefault()
    
    if (!formData.contenido.trim() || !formData.nombre_autor.trim()) {
      setError("Por favor, completa los campos requeridos")
      return
    }
    
    try {
      setEnviando(true)
      setError(null)
      
      const response = await fetch('/api/respuestas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_consulta: idConsulta,
          contenido: formData.contenido,
          nombre_autor: formData.nombre_autor,
          email_autor: formData.email_autor
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar la respuesta')
      }
      
      setMensaje(data.message)
      setFormData({
        contenido: '',
        nombre_autor: '',
        email_autor: ''
      })
      
      // Recargar las respuestas
      fetchRespuestas()
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setEnviando(false)
    }
  }
  
  const handleVotar = async (idRespuesta) => {
    try {
      setVotando(true)
      setError(null)
      
      const response = await fetch('/api/respuestas/votar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_respuesta: idRespuesta
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al votar por la respuesta')
      }
      
      // Recargar las respuestas después de votar exitosamente
      await fetchRespuestas()
      
    } catch (error) {
      setError(error.message)
    } finally {
      setVotando(false)
    }
  }
  
  const handleReportar = async (type, id) => {
    try {
      const response = await fetch('/api/reportar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          id
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || `Error al reportar ${tipo}`)
      }
      
      setMensaje(`${type === 'consulta' ? 'Consulta' : 'Respuesta'} reportada correctamente`)
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    }
  }
  
  const fetchRespuestas = async () => {
    try {
      const respuestasResponse = await fetch(`/api/respuestas?idConsulta=${idConsulta}`)
      
      if (!respuestasResponse.ok) {
        throw new Error('Error al cargar las respuestas')
      }
      
      const respuestasData = await respuestasResponse.json()
      setRespuestas(respuestasData)
    } catch (error) {
      console.error('Error:', error)
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-4">Cargando consulta...</div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-4 text-red-500">Error: {error}</div>
        <div className="text-center mt-4">
          <Button variant="outline" onClick={() => router.push('/consultas')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver a consultas
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push('/consultas')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver a consultas
        </Button>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">{consulta.titulo}</CardTitle>
            <div className="flex items-center gap-2">
              <EstadoBadge estado={consulta.estado} />
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 hover:text-red-700"
                onClick={() => handleReportar('consulta', consulta.id_consulta)}
              >
                Reportar
              </Button>
            </div>
          </div>
          <CardDescription>
            {formatDate(consulta.fecha_creacion)}
            {' • '}
            {consulta.materia}
            {consulta.nombre_autor && (
              <span className="ml-2">• Por: {consulta.nombre_autor}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{consulta.descripcion}</p>
        </CardContent>
      </Card>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Respuestas ({respuestas.length})</h2>
        
        {respuestas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay respuestas todavía
          </div>
        ) : (
          <div className="space-y-4">
            {respuestas.map(respuesta => (
              <Card key={respuesta.id_respuesta} className={respuesta.es_solucion ? 'border-green-300 bg-green-50' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardDescription>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {format(new Date(respuesta.fecha_creacion), 'dd MMM yyyy', { locale: es })}
                          </span>
                          {respuesta.reportada === 1 && (
                            <Badge variant="outline" className="text-red-500 border-red-200">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Reportada
                            </Badge>
                          )}
                        </div>
                      </div>
                      {respuesta.nombre_autor && (
                        <span className="ml-2">• Por: {respuesta.nombre_autor}</span>
                      )}
                    </CardDescription>
                    <div className="flex items-center gap-2">
                      {respuesta.es_solucion && (
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                          <CheckCircle className="h-3 w-3 mr-1" /> Mejor respuesta
                        </Badge>
                      )}
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {respuesta.votos} votos
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{respuesta.contenido}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleVotar(respuesta.id_respuesta)}
                    disabled={votando}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" /> Votar como mejor respuesta
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleReportar('respuesta', respuesta.id_respuesta)}
                  >
                    Reportar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {consulta.estado === 'aprobada' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tu respuesta</CardTitle>
          </CardHeader>
          <CardContent>
            {mensaje && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
                {mensaje}
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmitRespuesta}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contenido">Tu respuesta</Label>
                  <Textarea
                    id="contenido"
                    value={formData.contenido}
                    onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                    placeholder="Escribe tu respuesta aquí..."
                    rows={5}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre_autor">Tu nombre</Label>
                    <Input
                      id="nombre_autor"
                      value={formData.nombre_autor}
                      onChange={(e) => setFormData({ ...formData, nombre_autor: e.target.value })}
                      placeholder="Ingresa tu nombre"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email_autor">Tu email (opcional)</Label>
                    <Input
                      id="email_autor"
                      type="email"
                      value={formData.email_autor}
                      onChange={(e) => setFormData({ ...formData, email_autor: e.target.value })}
                      placeholder="Ingresa tu email"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={enviando}>
                  {enviando ? 'Enviando...' : 'Enviar respuesta'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function EstadoBadge({ estado }) {
  switch (estado) {
    case 'aprobada':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Aprobada
        </Badge>
      )
    case 'pendiente':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pendiente
        </Badge>
      )
    case 'rechazada':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Rechazada
        </Badge>
      )
    default:
      return null
  }
}

function formatDate(dateString) {
  if (!dateString) return ''
  try {
    return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: es })
  } catch (error) {
    return dateString
  }
} 