import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCourse, getLessons, getAssignments, enrollInCourse } from '../services/courses'
import api from '../services/api'

export default function CourseDetail() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [assignments, setAssignments] = useState([])
  const [me, setMe] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get('/auth/me/').then((res) => setMe(res.data))
    getCourse(id).then((res) => setCourse(res.data))
    getLessons(id).then((res) => setLessons(res.data)).catch(() => setLessons([]))
    getAssignments(id).then((res) => setAssignments(res.data)).catch(() => setAssignments([]))
  }, [id])

  const handleEnroll = async () => {
    try {
      await enrollInCourse(id)
      setMessage('Enrolled successfully!')
      getLessons(id).then((res) => setLessons(res.data))
      getAssignments(id).then((res) => setAssignments(res.data))
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Enrollment failed.')
    }
  }

  if (!course) return <div className="p-8 text-slate-500">Loading...</div>

  const isTeacherOwner = me && me.role === 'TEACHER' && course.teacher === me.id
  const isStudent = me && me.role === 'STUDENT'

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <Link to="/courses" className="text-indigo-600 text-sm font-medium hover:underline">&larr; Back to courses</Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">{course.title}</h1>
        <p className="text-slate-600 mb-1">{course.description}</p>
        <p className="text-sm text-slate-400 mb-5">Taught by {course.teacher_username}</p>

        {message && <p className="text-emerald-600 text-sm bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-4">{message}</p>}

        {isStudent && (
          <button onClick={handleEnroll} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg mb-8 transition">
            Enroll in this course
          </button>
        )}

        {isTeacherOwner && (
          <div className="flex gap-2 mb-8">
            <Link to={`/courses/${id}/lessons/new`} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              + Add Lesson
            </Link>
            <Link to={`/courses/${id}/assignments/new`} className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              + Add Assignment
            </Link>
          </div>
        )}

        <h2 className="text-lg font-semibold text-slate-800 mb-3">Lessons</h2>
        <div className="grid gap-2 mb-8">
          {lessons.map((l) => (
            <Link key={l.id} to={`/courses/${id}/lessons/${l.id}`} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition">
              <h3 className="font-medium text-slate-900">{l.title}</h3>
              <p className="text-sm text-slate-500 truncate">{l.content}</p>
            </Link>
          ))}
          {lessons.length === 0 && <p className="text-slate-400 text-sm">No lessons available.</p>}
        </div>

        <h2 className="text-lg font-semibold text-slate-800 mb-3">Assignments</h2>
        <div className="grid gap-2">
          {assignments.map((a) => (
            <Link key={a.id} to={`/assignments/${a.id}`} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition">
              <h3 className="font-medium text-slate-900">{a.title}</h3>
              <p className="text-sm text-slate-500">Due: {new Date(a.due_date).toLocaleString()}</p>
            </Link>
          ))}
          {assignments.length === 0 && <p className="text-slate-400 text-sm">No assignments available.</p>}
        </div>
      </div>
    </div>
  )
}