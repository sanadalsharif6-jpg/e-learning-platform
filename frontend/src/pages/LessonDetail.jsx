import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getLesson, updateLesson } from '../services/courses'
import api from '../services/api'

export default function LessonDetail() {
  const { courseId, lessonId } = useParams()
  const [form, setForm] = useState(null)
  const [me, setMe] = useState(null)
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [newFile, setNewFile] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/auth/me/').then((res) => setMe(res.data))
    getLesson(courseId, lessonId).then((res) => setForm(res.data))
  }, [courseId, lessonId])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
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

  if (!form || !me) return <div className="p-8">Loading...</div>

  const isOwner = me.role === 'TEACHER'

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link to={`/courses/${courseId}`} className="text-blue-600 text-sm">&larr; Back to course</Link>

      {!editing ? (
        <>
          <div className="flex justify-between items-center mt-2 mb-4">
            <h1 className="text-2xl font-bold">{form.title}</h1>
            {isOwner && (
              <button onClick={() => setEditing(true)} className="bg-gray-600 text-white px-3 py-1 rounded text-sm">
                Edit
              </button>
            )}
          </div>
          <p className="whitespace-pre-wrap">{form.content}</p>
         {form.external_url && (
            <a href={form.external_url} target="_blank" rel="noreferrer" className="text-blue-600 block mt-2">
              {form.external_url}
            </a>
          )}
          {form.file && (
            <a href={form.file} target="_blank" rel="noreferrer" className="text-blue-600 block mt-2">
              Download attached file
            </a>
          )}
        </>
      ) : (
        <form onSubmit={handleSave} className="mt-4">
          {message && <p className="text-green-600 mb-2">{message}</p>}
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4"
          />
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-4 h-32"
          />
                   <input
            name="external_url"
            value={form.external_url || ''}
            onChange={handleChange}
            className="w-full border rounded p-2 mb-2"
          />
          <label className="block text-sm text-gray-600 mb-1">
            Replace attached file (leave empty to keep current)
          </label>
          <input
            type="file"
            onChange={(e) => setNewFile(e.target.files[0])}
            className="w-full border rounded p-2 mb-4"
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            <button type="button" onClick={() => setEditing(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      )}
    </div>
  )
}