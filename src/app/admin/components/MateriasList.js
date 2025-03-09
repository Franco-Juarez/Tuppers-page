'use client'

import { useState, useEffect } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Pencil, Trash2, Plus } from 'lucide-react'

export default function MateriasList() {
  const [materias, setMaterias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Estados para el formulario
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentMateria, setCurrentMateria] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    profesor: '',
    email: '',
    fechaInicio: '',
    fechaFinal: '',
    horarioCursada: '',
    descripcion: '',
    recursos: ''
  })
  
  // Cargar materias
  useEffect(() => {
    fetchMaterias()
  }, [])
  
  const fetchMaterias = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch('/api/materias', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
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
  
  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  // Abrir diálogo para crear nueva materia
  const handleNewMateria = () => {
    setCurrentMateria(null)
    setFormData({
      nombre: '',
      profesor: '',
      email: '',
      fechaInicio: '',
      fechaFinal: '',
      horarioCursada: '',
      descripcion: '',
      recursos: ''
    })
    setIsDialogOpen(true)
  }
  
  // Abrir diálogo para editar materia
  const handleEditMateria = (materia) => {
    setCurrentMateria(materia)
    setFormData({
      id_materia: materia.id_materia,
      nombre: materia.nombre || '',
      profesor: materia.profesor || '',
      email: materia.email || '',
      fechaInicio: materia.fechaInicio || '',
      fechaFinal: materia.fechaFinal || '',
      horarioCursada: materia.horarioCursada || '',
      descripcion: materia.descripcion || '',
      recursos: materia.recursos || ''
    })
    setIsDialogOpen(true)
  }
  
  // Abrir diálogo para confirmar eliminación
  const handleDeleteClick = (materia) => {
    setCurrentMateria(materia)
    setIsDeleteDialogOpen(true)
  }
  
  // Guardar materia (crear o actualizar)
  const handleSaveMateria = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const isEditing = !!currentMateria
      
      const url = '/api/materias'
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar la materia')
      }
      
      // Actualizar lista de materias
      await fetchMaterias()
      
      // Cerrar diálogo
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    }
  }
  
  // Eliminar materia
  const handleDeleteMateria = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch(`/api/materias?idMateria=${currentMateria.id_materia}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar la materia')
      }
      
      // Actualizar lista de materias
      await fetchMaterias()
      
      // Cerrar diálogo
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    }
  }
  
  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es })
    } catch (error) {
      return dateString
    }
  }
  
  if (loading) {
    return <div className="text-center py-4">Cargando materias...</div>
  }
  
  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Materias</h2>
        <Button onClick={handleNewMateria} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Nueva Materia
        </Button>
      </div>
      
      {materias.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No hay materias registradas
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Profesor</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Fecha Final</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materias.map((materia) => (
                <TableRow key={materia.id_materia}>
                  <TableCell className="font-medium">{materia.nombre}</TableCell>
                  <TableCell>{materia.profesor}</TableCell>
                  <TableCell>{formatDate(materia.fechaInicio)}</TableCell>
                  <TableCell>{formatDate(materia.fechaFinal)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEditMateria(materia)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => handleDeleteClick(materia)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Diálogo para crear/editar materia */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentMateria ? 'Editar Materia' : 'Nueva Materia'}
            </DialogTitle>
            <DialogDescription>
              Complete los datos de la materia y haga clic en guardar cuando termine.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profesor">Profesor</Label>
                <Input
                  id="profesor"
                  name="profesor"
                  value={formData.profesor}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email del Profesor</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                <Input
                  id="fechaInicio"
                  name="fechaInicio"
                  type="date"
                  value={formData.fechaInicio}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fechaFinal">Fecha Final</Label>
                <Input
                  id="fechaFinal"
                  name="fechaFinal"
                  type="date"
                  value={formData.fechaFinal}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="horarioCursada">Horario de Cursada</Label>
              <Input
                id="horarioCursada"
                name="horarioCursada"
                value={formData.horarioCursada}
                onChange={handleInputChange}
                placeholder="Ej: Lunes y Miércoles de 18:00 a 22:00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recursos">Recursos</Label>
              <Textarea
                id="recursos"
                name="recursos"
                value={formData.recursos}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enlaces a recursos, bibliografía, etc."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveMateria}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la materia "{currentMateria?.nombre}".
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMateria} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 