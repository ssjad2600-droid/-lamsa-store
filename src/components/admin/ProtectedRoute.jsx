import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../hooks/useAdminAuth'

export default function ProtectedRoute({ children }) {
  const user = useAdminAuth()

  // لا يزال يتحقق
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-[#C9956C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  if (!user) return <Navigate to="/admin/login" replace />

  return children
}
