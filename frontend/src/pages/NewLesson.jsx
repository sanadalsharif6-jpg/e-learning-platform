import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createLesson } from '../services/courses'

export default function NewLesson() {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [externalUrl, setExternalUrl] = useState('')
  const [file, setFile] = useState(null)
  const [order, setOrder] = useState(1)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    formData.append('external_url', externalUrl)
    formData.append('order', order)
    if (file) formData.append('file', file)

    try {
      await createLesson(id, formData)
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
          placeholder="Lesson title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />
        <textarea
          placeholder="Lesson content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded p-2 mb-4 h-32"
        />
        <input
          placeholder="External link (optional)"
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />
        <label className="block text-sm text-gray-600 mb-1">Attach a file (PDF, Word, etc. - optional)</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full border rounded p-2 mb-4"
        />
        <input
          type="number"
          placeholder="Order"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Add Lesson
        </button>
      </form>
    </div>
  )
}