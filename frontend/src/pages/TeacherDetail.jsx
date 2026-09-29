import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTeacher, getCoursesByTeacher } from '../services/courses'

export default function TeacherDetail() {
  const { id } = useParams()
  const [teacher, setTeacher] = useState(null)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    getTeacher(id).then((res) => setTeacher(res.data))
    getCoursesByTeacher(Number(id)).then((res) => setCourses(res.data))
  }, [id])

  if (!teacher) return <div className="p-8 text-slate-500">Loading...</div>

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Link to="/teachers" className="text-indigo-600 text-sm font-medium hover:underline">&larr; Back to teachers</Link>
        <div className="bg-white border border-slate-200 rounded-xl p-6 mt-4 mb-6">
          <h1 className="text-2xl font-bold text-slate-900">{teacher.username}</h1>
          {teacher.subject_or_expertise && <p className="text-indigo-600 text-sm mt-1">{teacher.subject_or_expertise}</p>}
          {teacher.bio && <p className="text-slate-600 mt-3">{teacher.bio}</p>}
        </div>

        <h2 className="text-lg font-semibold text-slate-800 mb-3">Courses</h2>
        <div className="grid gap-2">
          {courses.map((c) => (
            <Link key={c.id} to={`/courses/${c.id}`} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition">
              <p className="font-medium text-slate-900">{c.title}</p>
              <p className="text-sm text-slate-500">{c.category}</p>
            </Link>
          ))}
          {courses.length === 0 && <p className="text-slate-400 text-sm">No courses yet.</p>}
        </div>
      </div>
    </div>
  )
}