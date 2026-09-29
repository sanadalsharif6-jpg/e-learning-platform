import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { getMyCourses, getPendingGrading, getMyEnrollments } from '../services/courses'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [teacherCourses, setTeacherCourses] = useState([])
  const [pending, setPending] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/auth/me/')
      .then((res) => setUser(res.data))
      .catch(() => navigate('/login'))
  }, [])

  useEffect(() => {
    if (!user) return
    if (user.role === 'TEACHER') {
      getMyCourses().then((res) => setTeacherCourses(res.data))
      getPendingGrading().then((res) => setPending(res.data))
    } else {
      getMyEnrollments().then((res) => setEnrollments(res.data))
    }
  }, [user])

  if (!user) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Welcome, {user.username}</h1>
      <p className="text-gray-500 mb-6">{user.role}</p>

      {user.role === 'TEACHER' ? (
        <>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">My Courses</h2>
            <Link to="/courses/new" className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
              + New Course
            </Link>
          </div>
          <div className="grid gap-3 mb-8">
            {teacherCourses.map((c) => (
              <Link key={c.id} to={`/courses/${c.id}`} className="block border rounded p-3 hover:shadow-md">
                <p className="font-medium">{c.title}</p>
                <p className="text-sm text-gray-500">{c.category}</p>
              </Link>
            ))}
            {teacherCourses.length === 0 && <p className="text-gray-500 text-sm">No courses yet.</p>}
          </div>

          <h2 className="text-xl font-semibold mb-3">Pending Grading ({pending.length})</h2>
          <div className="grid gap-3">
            {pending.map((s) => (
              <Link key={s.id} to={`/submissions/${s.id}`} className="block border rounded p-3 hover:shadow-md">
                <p className="font-medium">{s.student_username}</p>
                <p className="text-sm text-gray-500">{s.is_late ? 'Late' : 'On time'} - Not graded</p>
              </Link>
            ))}
            {pending.length === 0 && <p className="text-gray-500 text-sm">Nothing to grade right now.</p>}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-3">My Enrolled Courses</h2>
          <div className="grid gap-3 mb-8">
            {enrollments.map((e) => (
              <Link key={e.id} to={`/courses/${e.course}`} className="block border rounded p-3 hover:shadow-md">
                <p className="font-medium">{e.course_title}</p>
              </Link>
            ))}
            {enrollments.length === 0 && (
              <p className="text-gray-500 text-sm">
                Not enrolled in any courses yet. <Link to="/courses" className="text-blue-600">Browse courses</Link>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}