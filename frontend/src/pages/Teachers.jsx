import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTeachers } from '../services/courses'

export default function Teachers() {
  const [teachers, setTeachers] = useState([])

  useEffect(() => {
    getTeachers().then((res) => setTeachers(res.data))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Teachers</h1>
        <div className="grid gap-3">
          {teachers.map((t) => (
            <Link key={t.id} to={`/teachers/${t.id}`} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition">
              <h2 className="font-semibold text-slate-900">{t.username}</h2>
              {t.subject_or_expertise && <p className="text-sm text-slate-500">{t.subject_or_expertise}</p>}
              {t.bio && <p className="text-sm text-slate-400 mt-1">{t.bio}</p>}
            </Link>
          ))}
          {teachers.length === 0 && <p className="text-slate-400">No teachers yet.</p>}
        </div>
      </div>
    </div>
  )
}