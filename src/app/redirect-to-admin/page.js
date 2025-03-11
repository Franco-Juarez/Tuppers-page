'use client'

import { useEffect, useState } from 'react'

export default function RedirectToAdmin() {
  const [status, setStatus] = useState('Preparando acceso...')
  const [error, setError] = useState(null)
  
  useEffect(() => {
    // Usar un pequeño retraso para asegurarse de que todo esté cargado
    const timer = setTimeout(() => {
      window.location.href = '/admin';
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Preparando acceso al panel de administración</h1>
        <p className="mb-4">{status}</p>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}
        
        <button 
          onClick={() => window.location.href = '/admin'} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Intentar acceder al panel de administración
        </button>
      </div>
    </div>
  )
} 