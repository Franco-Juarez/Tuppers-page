import fs from 'fs'
import path from 'path'
import { createClient } from '@libsql/client'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

// Crear cliente de base de datos
const db = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN
})

async function initializeDatabase() {
  try {
    console.log('Inicializando base de datos...')
    
    // Leer el archivo de esquema SQL
    const schemaPath = path.join(process.cwd(), 'src', 'data', 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Dividir el esquema en instrucciones individuales
    const statements = schema
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0)
    
    // Ejecutar cada instrucción
    for (const statement of statements) {
      try {
        await db.execute(statement + ';')
        console.log(`Ejecutado: ${statement.substring(0, 50)}...`)
      } catch (error) {
        // Ignorar errores específicos
        if (
          error.message.includes('duplicate column name') || 
          error.message.includes('table already exists') ||
          statement.includes('PRAGMA') ||
          statement.includes('ALTER TABLE')
        ) {
          console.warn(`Advertencia (ignorada): ${error.message}`)
        } else {
          console.error(`Error al ejecutar: ${statement}`)
          console.error(error.message)
          // Solo lanzar error para errores críticos
          if (!statement.includes('INSERT OR IGNORE')) {
            throw error
          }
        }
      }
    }
    
    // Verificar que el usuario administrador existe
    const adminUser = await db.execute({
      sql: "SELECT * FROM users WHERE email = ? AND role = 'admin'",
      args: ['franjuaache@gmail.com']
    })
    
    if (adminUser.rows.length > 0) {
      console.log('Usuario administrador verificado correctamente')
    } else {
      console.log('No se pudo verificar el usuario administrador')
    }
    
    console.log('Base de datos inicializada correctamente')
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error)
  } finally {
    process.exit(0)
  }
}

// Ejecutar la inicialización
initializeDatabase() 