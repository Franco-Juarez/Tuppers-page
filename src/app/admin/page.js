'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MateriasList from './components/MateriasList'
import ExamsList from './components/ExamsList'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [adminData, setAdminData] = useState({
    name: '',
    email: ''
  })
  const [stats, setStats] = useState({
    materias: 0,
    examenes: 0,
    usuarios: 0
  })
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken')
      
      if (!token) {
        router.push('/admin-login')
        return
      }

      try {
        const response = await fetch('/api/admin/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('No autorizado')
        }

        const data = await response.json()
        setAdminData({
          name: data.name,
          email: data.email
        })
        setIsAuthenticated(true)
        
        // Cargar estadísticas
        await fetchStats()
      } catch (error) {
        console.error('Error de autenticación:', error)
        localStorage.removeItem('adminToken')
        router.push('/admin-login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])
  
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      
      // Obtener materias
      const materiasResponse = await fetch('/api/materias', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      // Obtener exámenes
      const examsResponse = await fetch('/api/exams', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const materias = await materiasResponse.json()
      let examenes = []
      
      try {
        examenes = await examsResponse.json()
      } catch (error) {
        console.log('No hay exámenes disponibles')
      }
      
      setStats({
        materias: materias.length,
        examenes: examenes.length,
        usuarios: 1 // Por ahora solo hay un usuario administrador
      })
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin-login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // No mostrar nada mientras se redirige
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Bienvenido, <span className="font-medium text-foreground">{adminData.name}</span>
            </p>
            <Button variant="outline" onClick={handleLogout}>Cerrar sesión</Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard">
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="materias">Materias</TabsTrigger>
            <TabsTrigger value="examenes">Exámenes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Materias</CardTitle>
                  <CardDescription>Total de materias registradas</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.materias}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Exámenes</CardTitle>
                  <CardDescription>Total de exámenes programados</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.examenes}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Usuarios</CardTitle>
                  <CardDescription>Total de usuarios registrados</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.usuarios}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="materias">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Materias</CardTitle>
                <CardDescription>Administra las materias del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <MateriasList />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="examenes">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Exámenes</CardTitle>
                <CardDescription>Administra los exámenes programados</CardDescription>
              </CardHeader>
              <CardContent>
                <ExamsList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 