import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '../services/courses'
import api from '../services/api'

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [me, setMe] = useState(null)

  useEffect(() => {
    getCourses().then((res) => setCourses(res.data))
    api.get('/auth/me/').then((res) => setMe(res.data))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Courses</h1>
          {me?.role === 'TEACHER' && (
            <Link to="/courses/new" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              + New Course
            </Link>
          )}
        </div>
        <div className="grid gap-3">
          {courses.map((c) => (
            <Link
              key={c.id}
              to={`/courses/${c.id}`}
              className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition"
            >
              <h2 className="font-semibold text-slate-900">{c.title}</h2>
              <p className="text-slate-500 text-sm">{c.category}</p>
              <p className="text-slate-400 text-xs mt-1">by {c.teacher_username}</p>
            </Link>
          ))}
          {courses.length === 0 && <p className="text-slate-400">No courses yet.</p>}
        </div>
      </div>
    </div>
  )
}