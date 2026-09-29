import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getLesson, updateLesson, deleteLesson } from '../services/courses'
import api from '../services/api'

export default function LessonDetail() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [me, setMe] = useState(null)
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [newFile, setNewFile] = useState(null)

  useEffect(() => {
    api.get('/auth/me/').then((res) => setMe(res.data))
    getLesson(courseId, lessonId).then((res) => setForm(res.data))
  }, [courseId, lessonId])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleDelete = async () => {
    if (!window.confirm('Delete this lesson? This cannot be undone.')) return
    try {
      await deleteLesson(courseId, lessonId)
      navigate(`/courses/${courseId}`)
    } catch (err) {
      setMessage('Failed to delete lesson.')
    }
  }
  const handleSave = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('content', form.content)
    formData.append('external_url', form.external_url || '')
    formData.append('order', form.order)
    if (newFile) formData.append('file', newFile)

    try {
      const res = await updateLesson(courseId, lessonId, formData)
      setForm(res.data)
      setMessage('Saved!')
      setEditing(false)
    } catch (err) {
      setMessage('Failed to save.')
    }
  }

  if (!form || !me) return <div className="p-8 text-slate-500">Loading...</div>

  const isOwner = me.role === 'TEACHER'

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Link to={`/courses/${courseId}`} className="text-indigo-600 text-sm font-medium hover:underline">&larr; Back to course</Link>

        {!editing ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 mt-4">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-slate-900">{form.title}</h1>
               {isOwner && (
                <div className="flex gap-2">
                  <button onClick={() => setEditing(true)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm px-3 py-1.5 rounded-lg transition">
                    Edit
                  </button>
                  <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-lg transition">
                    Delete
                  </button>
                </div>
              )}
            </div>
            <p className="whitespace-pre-wrap break-words text-slate-700">{form.content}</p>
            {form.external_url && (
              <a href={form.external_url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline block mt-4 break-words">
                {form.external_url}
              </a>
            )}
            {form.file && (
              <a href={form.file} target="_blank" rel="noreferrer" className="inline-block mt-4 text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition">
                📎 Download attached file
              </a>
            )}
          </div>
        ) : (
          <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <label className="block text-sm font-medium text-slate-700 mb-1">External link</label>
            <input
              name="external_url"
              value={form.external_url || ''}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <label className="block text-sm font-medium text-slate-700 mb-1">Replace attached file</label>
            <input
              type="file"
              onChange={(e) => setNewFile(e.target.files[0])}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-6"
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">Save</button>
              <button type="button" onClick={() => setEditing(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm px-4 py-2 rounded-lg transition">Cancel</button>
            </div>
            {message && <p className="text-emerald-600 text-sm mt-3">{message}</p>}
          </form>
        )}
      </div>
    </div>
  )
}