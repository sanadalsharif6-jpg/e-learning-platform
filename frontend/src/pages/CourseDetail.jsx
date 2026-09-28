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

  if (!course) return <div className="p-8">Loading...</div>

  const isTeacherOwner = me && me.role === 'TEACHER' && course.teacher === me.id
  const isStudent = me && me.role === 'STUDENT'

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link to="/courses" className="text-blue-600 text-sm">&larr; Back to courses</Link>
      <h1 className="text-2xl font-bold mt-2">{course.title}</h1>
      <p className="text-gray-600 mb-4">{course.description}</p>
      <p className="text-sm text-gray-500 mb-4">Taught by {course.teacher_username}</p>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      {isStudent && (
        <button onClick={handleEnroll} className="bg-blue-600 text-white px-4 py-2 rounded mb-6">
          Enroll
        </button>
      )}

      {isTeacherOwner && (
        <div className="flex gap-2 mb-6">
          <Link to={`/courses/${id}/lessons/new`} className="bg-green-600 text-white px-4 py-2 rounded">
            Add Lesson
          </Link>
          <Link to={`/courses/${id}/assignments/new`} className="bg-purple-600 text-white px-4 py-2 rounded">
            Add Assignment
          </Link>
        </div>
      )}

      <h2 className="text-xl font-semibold mt-6 mb-2">Lessons</h2>
      <div className="space-y-2">
            {lessons.map((l) => (
          <Link key={l.id} to={`/courses/${id}/lessons/${l.id}`} className="block border rounded p-3 hover:shadow-md">
            <h3 className="font-medium">{l.title}</h3>
            <p className="text-sm text-gray-600 truncate">{l.content}</p>
          </Link>
        ))}
        {lessons.length === 0 && <p className="text-gray-500 text-sm">No lessons available.</p>}
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Assignments</h2>
      <div className="space-y-2">
        {assignments.map((a) => (
          <Link key={a.id} to={`/assignments/${a.id}`} className="block border rounded p-3 hover:shadow-md">
            <h3 className="font-medium">{a.title}</h3>
            <p className="text-sm text-gray-600">Due: {new Date(a.due_date).toLocaleString()}</p>
          </Link>
        ))}
        {assignments.length === 0 && <p className="text-gray-500 text-sm">No assignments available.</p>}
      </div>
    </div>
  )
}