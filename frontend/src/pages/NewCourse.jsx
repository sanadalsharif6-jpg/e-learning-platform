import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Course</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          name="title"
          placeholder="Course title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4 h-24"
        />
        <input
          name="category"
          placeholder="Category (e.g. Programming)"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>
    </div>
  )
}