import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createLesson } from '../services/courses'

export default function NewLesson() {
  const { id } = useParams()
  const [form, setForm] = useState({ title: '', content: '', external_url: '', order: 1 })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createLesson(id, form)
      navigate(`/courses/${id}`)
    } catch (err) {
      setError('Failed to create lesson.')
    }
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Lesson</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          name="title"
          placeholder="Lesson title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
        />
        <textarea
          name="content"
          placeholder="Lesson content"
          value={form.content}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4 h-32"
        />
        <input
          name="external_url"
          placeholder="External link (optional)"
          value={form.external_url}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
        />
        <input
          name="order"
          type="number"
          placeholder="Order"
          value={form.order}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Add Lesson
        </button>
      </form>
    </div>
  )
}