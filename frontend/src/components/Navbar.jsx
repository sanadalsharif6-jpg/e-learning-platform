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
    <nav className="bg-white border-b px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="font-bold text-lg">E-Learning</Link>
        <Link to="/dashboard" className="text-gray-600 hover:text-black">Dashboard</Link>
        <Link to="/courses" className="text-gray-600 hover:text-black">Courses</Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{me.username} ({me.role})</span>
        <button onClick={handleLogout} className="text-sm bg-red-600 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </nav>
  )
}