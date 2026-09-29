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

  if (!submission || !me) return <div className="p-8 text-slate-500">Loading...</div>

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-xl font-bold text-slate-900">Submission by {submission.student_username}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full ${submission.is_late ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {submission.is_late ? 'Late' : 'On time'}
            </span>
          </div>
          <p className="text-sm text-slate-400 mb-4">Submitted {new Date(submission.submitted_at).toLocaleString()}</p>
          <p className="text-slate-700 break-words whitespace-pre-wrap">{submission.content}</p>
          {submission.file_url && (
            <a href={submission.file_url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline block mt-3 break-words">
              {submission.file_url}
            </a>
          )}
          {submission.file && (
            <a href={submission.file} target="_blank" rel="noreferrer" className="inline-block mt-3 text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition">
              📎 Download attached file
            </a>
          )}
        </div>

        {submission.grade !== null && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
            <p className="font-semibold text-emerald-800">Grade: {submission.grade} / 100</p>
            <p className="text-sm text-emerald-700 mt-1">{submission.feedback}</p>
          </div>
        )}

        {me.role === 'TEACHER' && (
          <form onSubmit={handleGrade} className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="font-semibold text-slate-800 mb-3">Grade this submission</h2>
            {message && <p className="text-indigo-600 text-sm bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 mb-3">{message}</p>}
            <label className="block text-sm font-medium text-slate-700 mb-1">Grade (0-100)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <label className="block text-sm font-medium text-slate-700 mb-1">Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              Submit Grade
            </button>
          </form>
        )}
      </div>
    </div>
  )
}