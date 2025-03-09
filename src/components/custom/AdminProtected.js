'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminProtected({ children }) {
  const [isLoading, setIsLoading] = useState(true)
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

        // Si llegamos aquí, el usuario está autenticado
        setIsLoading(false)
      } catch (error) {
        console.error('Error de autenticación:', error)
        localStorage.removeItem('adminToken')
        router.push('/admin-login')
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Verificando autenticación...</p>
      </div>
    )
  }

  return children
} 