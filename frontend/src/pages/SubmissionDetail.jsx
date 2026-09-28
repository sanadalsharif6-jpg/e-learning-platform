import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getSubmission, gradeSubmission } from '../services/submissions'
import api from '../services/api'

export default function SubmissionDetail() {
  const { id } = useParams()
  const [submission, setSubmission] = useState(null)
  const [me, setMe] = useState(null)
  const [grade, setGrade] = useState('')
  const [feedback, setFeedback] = useState('')
  const [message, setMessage] = useState('')

  const load = () => getSubmission(id).then((res) => setSubmission(res.data))

  useEffect(() => {
    api.get('/auth/me/').then((res) => setMe(res.data))
    load()
  }, [id])

  const handleGrade = async (e) => {
    e.preventDefault()
    try {
      await gradeSubmission(id, { grade: Number(grade), feedback })
      setMessage('Graded successfully!')
      load()
    } catch (err) {
      setMessage('Grading failed. Grade must be 0-100.')
    }
  }

  if (!submission || !me) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Submission by {submission.student_username}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {submission.is_late ? 'Late' : 'On time'} - Submitted {new Date(submission.submitted_at).toLocaleString()}
      </p>
      <div className="border rounded p-4 mb-6">
        <p>{submission.content}</p>
      </div>

      {submission.grade !== null && (
        <div className="bg-green-50 border border-green-200 rounded p-4 mb-6">
          <p className="font-semibold">Grade: {submission.grade} / 100</p>
          <p className="text-sm mt-1">{submission.feedback}</p>
        </div>
      )}

      {me.role === 'TEACHER' && (
        <form onSubmit={handleGrade}>
          <h2 className="text-lg font-semibold mb-2">Grade this submission</h2>
          {message && <p className="text-blue-600 mb-2">{message}</p>}
          <input
            type="number"
            min="0"
            max="100"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="Grade (0-100)"
            className="w-full border rounded p-2 mb-2"
          />
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Feedback"
            className="w-full border rounded p-2 mb-4 h-24"
          />
          <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
            Submit Grade
          </button>
        </form>
      )}
    </div>
  )
}