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
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CheckCircle, XCircle, Eye, Trash2, AlertTriangle, Bell } from 'lucide-react'

export default function ConsultasList() {
  const [consultas, setConsultas] = useState([])
  const [consultasNoRevisadas, setConsultasNoRevisadas] = useState([])
  const [consultasReportadas, setConsultasReportadas] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingNoRevisadas, setLoadingNoRevisadas] = useState(true)
  const [loadingReportadas, setLoadingReportadas] = useState(true)
  const [error, setError] = useState(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentConsulta, setCurrentConsulta] = useState(null)
  const [respuestas, setRespuestas] = useState([])
  const [respuestasNoRevisadas, setRespuestasNoRevisadas] = useState([])
  const [loadingRespuestas, setLoadingRespuestas] = useState(false)
  const [activeTab, setActiveTab] = useState("todas")
  
  // Cargar consultas
  useEffect(() => {
    fetchConsultas()
    fetchConsultasNoRevisadas()
    fetchConsultasReportadas()
    fetchRespuestasNoRevisadas()
  }, [])
  
  const fetchConsultas = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      
      // Obtener todas las consultas
      const response = await fetch('/api/consultas?estado=all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Error al cargar consultas')
      }
      
      const data = await response.json()
      setConsultas(data)
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }
  
  const fetchConsultasNoRevisadas = async () => {
    try {
      setLoadingNoRevisadas(true)
      const token = localStorage.getItem('adminToken')
      
      // Obtener consultas no revisadas
      const response = await fetch('/api/consultas?noRevisadas=1', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Error al cargar consultas no revisadas')
      }
      
      const data = await response.json()
      setConsultasNoRevisadas(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoadingNoRevisadas(false)
    }
  }
  
  const fetchConsultasReportadas = async () => {
    try {
      setLoadingReportadas(true)
      const token = localStorage.getItem('adminToken')
      
      // Obtener consultas reportadas
      const response = await fetch('/api/consultas?reportadas=1', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Error al cargar consultas reportadas')
      }
      
      const data = await response.json()
      setConsultasReportadas(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoadingReportadas(false)
    }
  }
  
  const fetchRespuestasNoRevisadas = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      
      // Obtener respuestas no revisadas
      const response = await fetch('/api/respuestas?noRevisadas=1', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Error al cargar respuestas no revisadas')
      }
      
      const data = await response.json()
      setRespuestasNoRevisadas(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }
  
  // Cargar respuestas para una consulta específica
  const fetchRespuestas = async (idConsulta) => {
    try {
      setLoadingRespuestas(true)
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch(`/api/respuestas?idConsulta=${idConsulta}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Error al cargar respuestas')
      }
      
      const data = await response.json()
      setRespuestas(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoadingRespuestas(false)
    }
  }
  
  // Abrir diálogo para ver consulta
  const handleViewConsulta = async (consulta) => {
    setCurrentConsulta(consulta)
    setIsViewDialogOpen(true)
    await fetchRespuestas(consulta.id_consulta)
  }
  
  // Abrir diálogo para confirmar eliminación
  const handleDeleteClick = (consulta) => {
    setCurrentConsulta(consulta)
    setIsDeleteDialogOpen(true)
  }
  
  // Cambiar estado de una consulta (aprobar o rechazar)
  const handleChangeEstado = async (idConsulta, nuevoEstado) => {
    try {
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch('/api/consultas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_consulta: idConsulta,
          estado: nuevoEstado
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error al ${nuevoEstado === 'aprobada' ? 'aprobar' : 'rechazar'} la consulta`)
      }
      
      // Actualizar listas de consultas
      await Promise.all([
        fetchConsultas(),
        fetchConsultasNoRevisadas(),
        fetchConsultasReportadas()
      ])
      
      // Si estamos viendo la consulta, actualizar su estado
      if (currentConsulta && currentConsulta.id_consulta === idConsulta) {
        setCurrentConsulta({
          ...currentConsulta,
          estado: nuevoEstado
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    }
  }
  
  // Marcar consulta como revisada
  const handleMarcarRevisada = async (idConsulta) => {
    try {
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch('/api/consultas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_consulta: idConsulta,
          revisada: 1
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al marcar como revisada')
      }
      
      // Actualizar listas de consultas
      await Promise.all([
        fetchConsultas(),
        fetchConsultasNoRevisadas(),
        fetchConsultasReportadas()
      ])
      
      // Si estamos viendo la consulta, actualizar su estado
      if (currentConsulta && currentConsulta.id_consulta === idConsulta) {
        setCurrentConsulta({
          ...currentConsulta,
          revisada: 1
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    }
  }
  
  // Cambiar estado de una respuesta (aprobar o rechazar)
  const handleChangeEstadoRespuesta = async (idRespuesta, nuevoEstado) => {
    try {
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch('/api/respuestas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_respuesta: idRespuesta,
          estado: nuevoEstado
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error al ${nuevoEstado === 'aprobada' ? 'aprobar' : 'rechazar'} la respuesta`)
      }
      
      // Actualizar lista de respuestas
      if (currentConsulta) {
        await fetchRespuestas(currentConsulta.id_consulta)
      }
      
      // Actualizar lista de respuestas no revisadas
      await fetchRespuestasNoRevisadas()
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    }
  }
  
  // Marcar respuesta como revisada
  const handleMarcarRespuestaRevisada = async (idRespuesta) => {
    try {
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch('/api/respuestas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_respuesta: idRespuesta,
          revisada: 1
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al marcar como revisada')
      }
      
      // Actualizar lista de respuestas
      if (currentConsulta) {
        await fetchRespuestas(currentConsulta.id_consulta)
      }
      
      // Actualizar lista de respuestas no revisadas
      await fetchRespuestasNoRevisadas()
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    }
  }
  
  // Marcar una respuesta como solución
  const handleMarkAsSolution = async (idRespuesta) => {
    try {
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch('/api/respuestas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_respuesta: idRespuesta,
          es_solucion: true
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al marcar como solución')
      }
      
      // Actualizar lista de respuestas
      if (currentConsulta) {
        await fetchRespuestas(currentConsulta.id_consulta)
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    }
  }
  
  // Eliminar consulta
  const handleDeleteConsulta = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch(`/api/consultas?idConsulta=${currentConsulta.id_consulta}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar la consulta')
      }
      
      // Actualizar listas de consultas
      await Promise.all([
        fetchConsultas(),
        fetchConsultasNoRevisadas(),
        fetchConsultasReportadas()
      ])
      
      // Cerrar diálogo
      setIsDeleteDialogOpen(false)
      setIsViewDialogOpen(false)
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    }
  }
  
  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es })
    } catch (error) {
      return dateString
    }
  }
  
  const getConsultasToShow = () => {
    switch (activeTab) {
      case 'noRevisadas':
        return consultasNoRevisadas;
      case 'reportadas':
        return consultasReportadas;
      case 'todas':
      default:
        return consultas;
    }
  };
  
  const getLoadingState = () => {
    switch (activeTab) {
      case 'noRevisadas':
        return loadingNoRevisadas;
      case 'reportadas':
        return loadingReportadas;
      case 'todas':
      default:
        return loading;
    }
  };
  
  const isLoading = getLoadingState();
  const consultasToShow = getConsultasToShow();
  
  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Consultas</h2>
        <div className="flex items-center gap-2">
          {respuestasNoRevisadas.length > 0 && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
              <Bell className="h-3 w-3" />
              {respuestasNoRevisadas.length} respuestas sin revisar
            </Badge>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="todas" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="noRevisadas" className="relative">
            No revisadas
            {consultasNoRevisadas.length > 0 && (
              <Badge className="ml-1 bg-yellow-500 text-white">{consultasNoRevisadas.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="reportadas" className="relative">
            Reportadas
            {consultasReportadas.length > 0 && (
              <Badge className="ml-1 bg-red-500 text-white">{consultasReportadas.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="todas" className="mt-4">
          {renderConsultasList(consultas, loading)}
        </TabsContent>
        
        <TabsContent value="noRevisadas" className="mt-4">
          {renderConsultasList(consultasNoRevisadas, loadingNoRevisadas)}
        </TabsContent>
        
        <TabsContent value="reportadas" className="mt-4">
          {renderConsultasList(consultasReportadas, loadingReportadas)}
        </TabsContent>
      </Tabs>
      
      {/* Diálogo para ver consulta y sus respuestas */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {currentConsulta?.titulo}
            </DialogTitle>
            <DialogDescription>
              {currentConsulta?.materia} • {formatDate(currentConsulta?.fecha_creacion)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Descripción</h3>
              <div className="flex items-center gap-2">
                <EstadoBadge estado={currentConsulta?.estado} />
                {currentConsulta?.revisada === 0 && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    No revisada
                  </Badge>
                )}
                {currentConsulta?.reportada === 1 && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    Reportada
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-md">
              <p className="whitespace-pre-wrap">{currentConsulta?.descripcion}</p>
            </div>
            
            <div className="flex gap-2 justify-end">
              {currentConsulta?.estado === 'pendiente' && (
                <>
                  <Button 
                    variant="outline"
                    className="text-green-600 hover:text-green-700"
                    onClick={() => handleChangeEstado(currentConsulta.id_consulta, 'aprobada')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" /> Aprobar
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleChangeEstado(currentConsulta.id_consulta, 'rechazada')}
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Rechazar
                  </Button>
                </>
              )}
              
              {currentConsulta?.revisada === 0 && (
                <Button 
                  variant="outline"
                  onClick={() => handleMarcarRevisada(currentConsulta.id_consulta)}
                >
                  Marcar como revisada
                </Button>
              )}
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Respuestas ({respuestas.length})</h3>
              
              {loadingRespuestas ? (
                <div className="text-center py-4">Cargando respuestas...</div>
              ) : respuestas.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No hay respuestas para esta consulta
                </div>
              ) : (
                <div className="space-y-4">
                  {respuestas.map((respuesta) => (
                    <div 
                      key={respuesta.id_respuesta} 
                      className={`p-4 border rounded-md ${respuesta.es_solucion ? 'bg-green-50 border-green-200' : ''}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(respuesta.fecha_creacion)}
                        </div>
                        <div className="flex gap-2">
                          <EstadoBadge estado={respuesta.estado} />
                          
                          {respuesta.revisada === 0 && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              No revisada
                            </Badge>
                          )}
                          
                          {respuesta.reportada === 1 && (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              Reportada
                            </Badge>
                          )}
                          
                          {respuesta.es_solucion && (
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                              <CheckCircle className="h-3 w-3 mr-1" /> Solución
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="whitespace-pre-wrap mb-3">{respuesta.contenido}</p>
                      
                      <div className="flex gap-2 justify-end">
                        {respuesta.estado === 'pendiente' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleChangeEstadoRespuesta(respuesta.id_respuesta, 'aprobada')}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" /> Aprobar
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleChangeEstadoRespuesta(respuesta.id_respuesta, 'rechazada')}
                            >
                              <XCircle className="h-3 w-3 mr-1" /> Rechazar
                            </Button>
                          </>
                        )}
                        
                        {respuesta.revisada === 0 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMarcarRespuestaRevisada(respuesta.id_respuesta)}
                          >
                            Marcar como revisada
                          </Button>
                        )}
                        
                        {respuesta.estado === 'aprobada' && !respuesta.es_solucion && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMarkAsSolution(respuesta.id_respuesta)}
                          >
                            Marcar como solución
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Cerrar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleDeleteClick(currentConsulta)}
            >
              Eliminar
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
              Esta acción eliminará permanentemente la consulta "{currentConsulta?.titulo}" y todas sus respuestas.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConsulta} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
  
  function renderConsultasList(consultas, loading) {
    if (loading) {
      return <div className="text-center py-4">Cargando consultas...</div>
    }
    
    if (consultas.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No hay consultas disponibles
        </div>
      )
    }
    
    return (
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Materia</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultas.map((consulta) => (
              <TableRow key={consulta.id_consulta}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {consulta.titulo}
                    {consulta.revisada === 0 && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Nuevo
                      </Badge>
                    )}
                    {consulta.reportada === 1 && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Reportada
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{consulta.materia}</TableCell>
                <TableCell>{formatDate(consulta.fecha_creacion)}</TableCell>
                <TableCell>
                  <EstadoBadge estado={consulta.estado} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleViewConsulta(consulta)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {consulta.estado === 'pendiente' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleChangeEstado(consulta.id_consulta, 'aprobada')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleChangeEstado(consulta.id_consulta, 'rechazada')}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    
                    {consulta.revisada === 0 && (
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleMarcarRevisada(consulta.id_consulta)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => handleDeleteClick(consulta)}
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
    )
  }
}

function EstadoBadge({ estado }) {
  switch (estado) {
    case 'aprobada':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Aprobada
        </Badge>
      )
    case 'pendiente':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Pendiente
        </Badge>
      )
    case 'rechazada':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Rechazada
        </Badge>
      )
    default:
      return null
  }
} 