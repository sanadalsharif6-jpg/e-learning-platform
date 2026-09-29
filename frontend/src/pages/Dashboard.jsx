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

  if (!user) return <div className="p-8 text-slate-500">Loading...</div>

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {user.username}</h1>
        <p className="text-slate-500 mb-8">{user.role === 'TEACHER' ? 'Teacher dashboard' : 'Student dashboard'}</p>

        {user.role === 'TEACHER' ? (
          <>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-slate-800">My Courses</h2>
              <Link to="/courses/new" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition">
                + New Course
              </Link>
            </div>
            <div className="grid gap-3 mb-10">
              {teacherCourses.map((c) => (
                <Link key={c.id} to={`/courses/${c.id}`} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition">
                  <p className="font-medium text-slate-900">{c.title}</p>
                  <p className="text-sm text-slate-500">{c.category}</p>
                </Link>
              ))}
              {teacherCourses.length === 0 && <p className="text-slate-400 text-sm">No courses yet.</p>}
            </div>

            <h2 className="text-lg font-semibold text-slate-800 mb-3">Pending Grading ({pending.length})</h2>
            <div className="grid gap-3">
              {pending.map((s) => (
                <Link key={s.id} to={`/submissions/${s.id}`} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition flex justify-between items-center">
                  <p className="font-medium text-slate-900">{s.student_username}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.is_late ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {s.is_late ? 'Late' : 'On time'}
                  </span>
                </Link>
              ))}
              {pending.length === 0 && <p className="text-slate-400 text-sm">Nothing to grade right now.</p>}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">My Enrolled Courses</h2>
            <div className="grid gap-3">
              {enrollments.map((e) => (
                <Link key={e.id} to={`/courses/${e.course}`} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition">
                  <p className="font-medium text-slate-900">{e.course_title}</p>
                </Link>
              ))}
              {enrollments.length === 0 && (
                <p className="text-slate-400 text-sm">
                  Not enrolled in any courses yet. <Link to="/courses" className="text-indigo-600 font-medium hover:underline">Browse courses</Link>
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}