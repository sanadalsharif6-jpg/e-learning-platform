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
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        {me?.role === 'TEACHER' && (
          <Link to="/courses/new" className="bg-blue-600 text-white px-4 py-2 rounded">
            + New Course
          </Link>
        )}
      </div>
      <div className="grid gap-4">
        {courses.map((c) => (
          <Link
            key={c.id}
            to={`/courses/${c.id}`}
            className="block border rounded-lg p-4 hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold">{c.title}</h2>
            <p className="text-gray-600 text-sm">{c.category}</p>
            <p className="text-gray-500 text-xs mt-1">by {c.teacher_username}</p>
          </Link>
        ))}
        {courses.length === 0 && <p className="text-gray-500">No courses yet.</p>}
      </div>
    </div>
  )
}