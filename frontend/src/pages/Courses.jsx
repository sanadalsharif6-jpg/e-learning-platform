import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '../services/courses'

export default function Courses() {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    getCourses().then((res) => setCourses(res.data))
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Courses</h1>
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