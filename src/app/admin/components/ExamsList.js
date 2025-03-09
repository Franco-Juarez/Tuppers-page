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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

export default function ExamsList() {
  const [exams, setExams] = useState([])
  const [materias, setMaterias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Estados para el formulario
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentExam, setCurrentExam] = useState(null)
  const [formData, setFormData] = useState({
    titulo: '',
    consigna: '',
    id_materia: '',
    fechaEntrega: ''
  })
  
  // Cargar exámenes y materias
  useEffect(() => {
    Promise.all([fetchExams(), fetchMaterias()])
      .then(() => setLoading(false))
      .catch(error => {
        console.error('Error:', error)
        setError(error.message)
        setLoading(false)
      })
  }, [])
  
  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch('/api/exams', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Error al cargar exámenes')
      }
      
      const data = await response.json()
      setExams(data)
      return data
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  }
  
  const fetchMaterias = async () => {
    try {
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
      return data
    } catch (error) {
      console.error('Error:', error)
      throw error
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
  
  // Manejar cambios en el select
  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      id_materia: value
    })
  }
  
  // Abrir diálogo para crear nuevo examen
  const handleNewExam = () => {
    setCurrentExam(null)
    setFormData({
      titulo: '',
      consigna: '',
      id_materia: '',
      fechaEntrega: ''
    })
    setIsDialogOpen(true)
  }
  
  // Abrir diálogo para editar examen
  const handleEditExam = (exam) => {
    setCurrentExam(exam)
    setFormData({
      id_examen: exam.id_examen,
      titulo: exam.titulo || '',
      consigna: exam.consigna || '',
      id_materia: exam.id_materia?.toString() || '',
      fechaEntrega: exam.fechaEntrega || ''
    })
    setIsDialogOpen(true)
  }
  
  // Abrir diálogo para confirmar eliminación
  const handleDeleteClick = (exam) => {
    setCurrentExam(exam)
    setIsDeleteDialogOpen(true)
  }
  
  // Guardar examen (crear o actualizar)
  const handleSaveExam = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const isEditing = !!currentExam
      
      const url = '/api/exams'
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
        throw new Error(errorData.error || 'Error al guardar el examen')
      }
      
      // Actualizar lista de exámenes
      await fetchExams()
      
      // Cerrar diálogo
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    }
  }
  
  // Eliminar examen
  const handleDeleteExam = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch(`/api/exams?idExamen=${currentExam.id_examen}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar el examen')
      }
      
      // Actualizar lista de exámenes
      await fetchExams()
      
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
    return <div className="text-center py-4">Cargando exámenes...</div>
  }
  
  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Exámenes</h2>
        <Button onClick={handleNewExam} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Nuevo Examen
        </Button>
      </div>
      
      {exams.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No hay exámenes registrados
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Materia</TableHead>
                <TableHead>Fecha de Entrega</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id_examen}>
                  <TableCell className="font-medium">{exam.titulo}</TableCell>
                  <TableCell>{exam.materia}</TableCell>
                  <TableCell>{formatDate(exam.fechaEntrega)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEditExam(exam)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => handleDeleteClick(exam)}
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
      
      {/* Diálogo para crear/editar examen */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentExam ? 'Editar Examen' : 'Nuevo Examen'}
            </DialogTitle>
            <DialogDescription>
              Complete los datos del examen y haga clic en guardar cuando termine.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="id_materia">Materia</Label>
              <Select 
                value={formData.id_materia} 
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una materia" />
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
              <Label htmlFor="fechaEntrega">Fecha de Entrega</Label>
              <Input
                id="fechaEntrega"
                name="fechaEntrega"
                type="date"
                value={formData.fechaEntrega}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="consigna">Consigna</Label>
              <Textarea
                id="consigna"
                name="consigna"
                value={formData.consigna}
                onChange={handleInputChange}
                rows={5}
                placeholder="Detalles del examen, consignas, etc."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveExam}>
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
              Esta acción eliminará permanentemente el examen "{currentExam?.titulo}".
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteExam} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 