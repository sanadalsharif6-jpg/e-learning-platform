import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'STUDENT' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/auth/register/', form)
      localStorage.setItem('access_token', res.data.access)
      localStorage.setItem('refresh_token', res.data.refresh)
      navigate('/dashboard')
    } catch (err) {
      setError('Registration failed. Check your details.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Create an account</h1>
        <p className="text-slate-500 text-sm mb-6">Join as a teacher or student</p>
        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>}

        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <label className="block text-sm font-medium text-slate-700 mb-1">I am a...</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="STUDENT">Student</option>
          <option value="TEACHER">Teacher</option>
        </select>
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg py-2 transition">
          Create account
        </button>
        <p className="mt-5 text-sm text-slate-500 text-center">
          Have an account? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  )
}