import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAssignment, submitAssignment, getAssignmentSubmissions } from '../services/submissions'
import api from '../services/api'

export default function AssignmentDetail() {
  const { id } = useParams()
  const [assignment, setAssignment] = useState(null)
  const [me, setMe] = useState(null)
  const [content, setContent] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [message, setMessage] = useState('')
  const [submissions, setSubmissions] = useState([])
  const [existingSubmission, setExistingSubmission] = useState(null)

  useEffect(() => {
    api.get('/auth/me/').then((res) => setMe(res.data))
    getAssignment(id).then((res) => setAssignment(res.data))
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await submitAssignment(id, { content, file_url: fileUrl })
      setExistingSubmission(res.data)
      setMessage(existingSubmission ? 'Resubmitted successfully!' : 'Submitted successfully!')
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Submission failed.')
    }
  }

  if (!assignment || !me) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link to={`/courses/${assignment.course}`} className="text-blue-600 text-sm">&larr; Back to course</Link>
      <h1 className="text-2xl font-bold mt-2">{assignment.title}</h1>
      <p className="text-gray-600 mb-2">{assignment.instructions}</p>
      <p className="text-sm text-gray-500 mb-6">Due: {new Date(assignment.due_date).toLocaleString()}</p>

      {me.role === 'STUDENT' && (
        <form onSubmit={handleSubmit}>
          {existingSubmission && (
            <p className="text-amber-600 text-sm mb-2">
              You already submitted this{existingSubmission.is_late ? ' (late)' : ''}. Submitting again will replace your answer.
            </p>
          )}
          {message && <p className="text-green-600 mb-2">{message}</p>}
          {existingSubmission?.grade !== null && existingSubmission?.grade !== undefined && (
            <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
              <p className="font-semibold">Grade: {existingSubmission.grade} / 100</p>
              <p className="text-sm">{existingSubmission.feedback}</p>
            </div>
          )}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your answer..."
            className="w-full border rounded p-2 mb-2 h-32"
          />
          <input
            type="url"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="File link (optional) - e.g. Google Drive/Dropbox link"
            className="w-full border rounded p-2 mb-4"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {existingSubmission ? 'Resubmit' : 'Submit'}
          </button>
        </form>
      )}

      {me.role === 'TEACHER' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Submissions</h2>
          {submissions.map((s) => (
            <Link key={s.id} to={`/submissions/${s.id}`} className="block border rounded p-3 mb-2 hover:shadow-md">
              <p className="font-medium">{s.student_username}</p>
              <p className="text-sm text-gray-500">
                {s.is_late ? 'Late' : 'On time'} {s.grade !== null ? `- Grade: ${s.grade}` : '- Not graded'}
              </p>
            </Link>
          ))}
          {submissions.length === 0 && <p className="text-gray-500 text-sm">No submissions yet.</p>}
        </div>
      )}
    </div>
  )
}