import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import api from '../services/api'

export default function Navbar() {
  const [me, setMe] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      api.get('/auth/me/').then((res) => setMe(res.data)).catch(() => setMe(null))
    } else {
      setMe(null)
    }
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setMe(null)
    navigate('/login')
  }

  if (!me) return null

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="font-bold text-lg text-indigo-600">EduPlatform</Link>
        <Link to="/dashboard" className="text-sm text-slate-600 hover:text-indigo-600 font-medium">Dashboard</Link>
        <Link to="/courses" className="text-sm text-slate-600 hover:text-indigo-600 font-medium">Courses</Link>
        <Link to="/teachers" className="text-sm text-slate-600 hover:text-indigo-600 font-medium">Teachers</Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">{me.username} <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full ml-1">{me.role}</span></span>
        <button onClick={handleLogout} className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition">
          Logout
        </button>
      </div>
    </nav>
  )
}