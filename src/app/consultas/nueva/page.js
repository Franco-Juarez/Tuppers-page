'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NuevaConsultaPage() {
  const [materias, setMaterias] = useState([])
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
  const [mensaje, setMensaje] = useState(null)
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    id_materia: '',
    nombre_autor: '',
    email_autor: ''
  })
  const router = useRouter()
  
  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/materias')
        
        if (!response.ok) {
          throw new Error('Error al cargar materias')
        }
        
        const data = await response.json()
        setMaterias(data)
      } catch (error) {
        console.error('Error:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchMaterias()
  }, [])
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      id_materia: value
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.titulo || !formData.descripcion || !formData.id_materia) {
      setError('Por favor, completa todos los campos')
      return
    }
    
    try {
      setEnviando(true)
      setError(null)
      
      const response = await fetch('/api/consultas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la consulta')
      }
      
      setMensaje(data.message)
      setFormData({
        titulo: '',
        descripcion: '',
        id_materia: '',
        nombre_autor: '',
        email_autor: ''
      })
      
      // Redirigir a la página de consultas después de 2 segundos
      setTimeout(() => {
        router.push('/consultas')
      }, 2000)
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setEnviando(false)
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-4">Cargando...</div>
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
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Nueva Consulta</CardTitle>
          <CardDescription>
            Completa el formulario para crear una nueva consulta. Tu consulta será revisada por un administrador antes de ser publicada.
          </CardDescription>
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
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                placeholder="Escribe un título descriptivo para tu consulta"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_autor">Tu nombre</Label>
                <Input
                  id="nombre_autor"
                  name="nombre_autor"
                  value={formData.nombre_autor}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu nombre"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email_autor">Tu email (opcional)</Label>
                <Input
                  id="email_autor"
                  name="email_autor"
                  type="email"
                  value={formData.email_autor}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu email"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="id_materia">Materia</Label>
              <Select 
                value={formData.id_materia} 
                onValueChange={handleSelectChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una materia" />
                </SelectTrigger>
                <SelectContent>
                  {materias.map((materia) => (
                    <SelectItem 
                      key={materia.id_materia} 
                      value={materia.id_materia.toString()}
                    >
                      {materia.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Describe detalladamente tu consulta"
                rows={6}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Crear Consulta'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 