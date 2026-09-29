import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { createAssignment } from '../services/courses'

export default function NewAssignment() {
  const { id } = useParams()
  const [form, setForm] = useState({ title: '', instructions: '', due_date: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createAssignment(id, { ...form, due_date: new Date(form.due_date).toISOString() })
      navigate(`/courses/${id}`)
    } catch (err) {
      setError('Failed to create assignment.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-6 py-8">
        <Link to={`/courses/${id}`} className="text-indigo-600 text-sm font-medium hover:underline">&larr; Back to course</Link>
        <div className="bg-white border border-slate-200 rounded-xl p-6 mt-4">
          <h1 className="text-xl font-bold text-slate-900 mb-5">Add Assignment</h1>
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>}
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <label className="block text-sm font-medium text-slate-700 mb-1">Instructions</label>
            <textarea
              name="instructions"
              value={form.instructions}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <label className="block text-sm font-medium text-slate-700 mb-1">Due date</label>
            <input
              name="due_date"
              type="datetime-local"
              value={form.due_date}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              Add Assignment
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}