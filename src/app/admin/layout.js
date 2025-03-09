import AdminProtected from '@/components/custom/AdminProtected'

export default function AdminLayout({ children }) {
  return (
    <AdminProtected>
      {children}
    </AdminProtected>
  )
} 