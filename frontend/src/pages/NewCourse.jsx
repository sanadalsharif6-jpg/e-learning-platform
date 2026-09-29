import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createCourse } from '../services/courses'

export default function NewCourse() {
  const [form, setForm] = useState({ title: '', description: '', category: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await createCourse(form)
      navigate(`/courses/${res.data.id}`)
    } catch (err) {
      setError('Failed to create course. Check your details.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-6 py-8">
        <Link to="/courses" className="text-indigo-600 text-sm font-medium hover:underline">&larr; Back to courses</Link>
        <div className="bg-white border border-slate-200 rounded-xl p-6 mt-4">
          <h1 className="text-xl font-bold text-slate-900 mb-5">Create Course</h1>
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>}
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <input
              name="category"
              placeholder="e.g. Programming"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              Create Course
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}