import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import AssignmentDetail from './pages/AssignmentDetail'
import SubmissionDetail from './pages/SubmissionDetail'
import NewCourse from './pages/NewCourse'
import NewLesson from './pages/NewLesson'
import NewAssignment from './pages/NewAssignment'
import LessonDetail from './pages/LessonDetail'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/new" element={<NewCourse />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/courses/:id/lessons/new" element={<NewLesson />} />
        <Route path="/courses/:id/assignments/new" element={<NewAssignment />} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonDetail />} />
        <Route path="/assignments/:id" element={<AssignmentDetail />} />
        <Route path="/submissions/:id" element={<SubmissionDetail />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App