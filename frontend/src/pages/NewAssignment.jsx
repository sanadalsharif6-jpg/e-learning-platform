import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Assignment</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          name="title"
          placeholder="Assignment title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
        />
        <textarea
          name="instructions"
          placeholder="Instructions"
          value={form.instructions}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4 h-32"
        />
        <label className="block text-sm text-gray-600 mb-1">Due date</label>
        <input
          name="due_date"
          type="datetime-local"
          value={form.due_date}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
        />
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
          Add Assignment
        </button>
      </form>
    </div>
  )
}