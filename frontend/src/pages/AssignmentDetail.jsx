import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getAssignment, submitAssignment, getAssignmentSubmissions, deleteAssignment } from '../services/submissions'
import { updateAssignment } from '../services/courses'
import api from '../services/api'

export default function AssignmentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [assignment, setAssignment] = useState(null)
  const [me, setMe] = useState(null)
  const [content, setContent] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [submissions, setSubmissions] = useState([])
  const [existingSubmission, setExistingSubmission] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState(null)

  useEffect(() => {
    api.get('/auth/me/').then((res) => setMe(res.data))
    getAssignment(id).then((res) => {
      setAssignment(res.data)
      setEditForm(res.data)
    })
  }, [id])

  useEffect(() => {
    if (me && me.role === 'TEACHER') {
      getAssignmentSubmissions(id).then((res) => setSubmissions(res.data))
    }
    if (me && me.role === 'STUDENT') {
      api.get(`/assignments/${id}/submit/`)
        .then((res) => {
          setExistingSubmission(res.data)
          setContent(res.data.content || '')
          setFileUrl(res.data.file_url || '')
        })
        .catch(() => setExistingSubmission(null))
    }
  }, [me, id])

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value })

  const handleEditSave = async (e) => {
    e.preventDefault()
    try {
      const res = await updateAssignment(id, editForm)
      setAssignment(res.data)
      setEditing(false)
    } catch (err) {
      setMessage('Failed to update.')
    }
  }
  const handleDelete = async () => {
    if (!window.confirm('Delete this assignment? This cannot be undone.')) return
    try {
      await deleteAssignment(id)
      navigate(`/courses/${assignment.course}`)
    } catch (err) {
      setMessage('Failed to delete assignment.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('content', content)
    formData.append('file_url', fileUrl)
    if (file) formData.append('file', file)

    try {
      const res = await submitAssignment(id, formData)
      setExistingSubmission(res.data)
      setMessage(existingSubmission ? 'Resubmitted successfully!' : 'Submitted successfully!')
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Submission failed.')
    }
  }

  if (!assignment || !me) return <div className="p-8 text-slate-500">Loading...</div>

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Link to={`/courses/${assignment.course}`} className="text-indigo-600 text-sm font-medium hover:underline">&larr; Back to course</Link>

        <div className="bg-white border border-slate-200 rounded-xl p-6 mt-4 mb-6">
           {me.role === 'TEACHER' && !editing && (
            <div className="float-right flex gap-2">
              <button onClick={() => setEditing(true)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm px-3 py-1.5 rounded-lg transition">
                Edit
              </button>
              <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-lg transition">
                Delete
              </button>
            </div>
          )}
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{assignment.title}</h1>

          {editing ? (
            <form onSubmit={handleEditSave} className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <label className="block text-sm font-medium text-slate-700 mb-1">Instructions</label>
              <textarea
                name="instructions"
                value={editForm.instructions}
                onChange={handleEditChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-3 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <label className="block text-sm font-medium text-slate-700 mb-1">Due date</label>
              <input
                name="due_date"
                type="datetime-local"
                value={editForm.due_date?.slice(0, 16)}
                onChange={handleEditChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">Save</button>
                <button type="button" onClick={() => setEditing(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm px-4 py-2 rounded-lg transition">Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <p className="text-slate-700 break-words whitespace-pre-wrap">{assignment.instructions}</p>
              <p className="text-sm text-slate-400 mt-3">Due: {new Date(assignment.due_date).toLocaleString()}</p>
            </>
          )}
        </div>

        {me.role === 'STUDENT' && (
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="font-semibold text-slate-800 mb-3">Your submission</h2>
            {existingSubmission && (
              <p className="text-amber-700 text-sm bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
                You already submitted this{existingSubmission.is_late ? ' (late)' : ''}. Submitting again will replace your answer.
              </p>
            )}
            {message && <p className="text-emerald-600 text-sm bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-3">{message}</p>}
            {existingSubmission?.grade !== null && existingSubmission?.grade !== undefined && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                <p className="font-semibold text-emerald-800">Grade: {existingSubmission.grade} / 100</p>
                <p className="text-sm text-emerald-700 mt-1">{existingSubmission.feedback}</p>
              </div>
            )}
            <label className="block text-sm font-medium text-slate-700 mb-1">Your answer</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your answer..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-3 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <label className="block text-sm font-medium text-slate-700 mb-1">File link (optional)</label>
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="Google Drive/Dropbox link"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <label className="block text-sm font-medium text-slate-700 mb-1">Or attach a file directly</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              {existingSubmission ? 'Resubmit' : 'Submit'}
            </button>
          </form>
        )}

        {me.role === 'TEACHER' && (
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Submissions</h2>
            <div className="grid gap-2">
              {submissions.map((s) => (
                <Link key={s.id} to={`/submissions/${s.id}`} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition flex justify-between items-center">
                  <p className="font-medium text-slate-900">{s.student_username}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.is_late ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {s.is_late ? 'Late' : 'On time'}
                    </span>
                    <span className="text-xs text-slate-500">{s.grade !== null ? `Grade: ${s.grade}` : 'Not graded'}</span>
                  </div>
                </Link>
              ))}
              {submissions.length === 0 && <p className="text-slate-400 text-sm">No submissions yet.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}