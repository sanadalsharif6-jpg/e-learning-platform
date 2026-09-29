import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-6 py-8">
        <Link to={`/courses/${id}`} className="text-indigo-600 text-sm font-medium hover:underline">&larr; Back to course</Link>
        <div className="bg-white border border-slate-200 rounded-xl p-6 mt-4">
          <h1 className="text-xl font-bold text-slate-900 mb-5">Add Lesson</h1>
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>}
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <label className="block text-sm font-medium text-slate-700 mb-1">External link (optional)</label>
            <input
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <label className="block text-sm font-medium text-slate-700 mb-1">Attach a file (optional)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4"
            />
            <label className="block text-sm font-medium text-slate-700 mb-1">Order</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              Add Lesson
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}