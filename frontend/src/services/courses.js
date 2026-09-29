import api from './api'

export const getCourses = () => api.get('/courses/')
export const getCourse = (id) => api.get(`/courses/${id}/`)
export const createCourse = (data) => api.post('/courses/', data)
export const enrollInCourse = (id) => api.post(`/courses/${id}/enroll/`)
export const getMyEnrollments = () => api.get('/my-courses/')
export const getLessons = (courseId) => api.get(`/courses/${courseId}/lessons/`)
export const createLesson = (courseId, data) => api.post(`/courses/${courseId}/lessons/`, data, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
export const getAssignments = (courseId) => api.get(`/courses/${courseId}/assignments/`)
export const createAssignment = (courseId, data) => api.post(`/courses/${courseId}/assignments/`, data)
export const getLesson = (courseId, lessonId) => api.get(`/courses/${courseId}/lessons/${lessonId}/`)
export const updateLesson = (courseId, lessonId, data) => api.put(`/courses/${courseId}/lessons/${lessonId}/`, data, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
export const updateAssignment = (id, data) => api.put(`/assignments/${id}/`, data)
export const getMyCourses = () => api.get('/courses/mine/')
export const getPendingGrading = () => api.get('/submissions/pending-grading/')
export const getTeachers = () => api.get('/auth/teachers/')
export const getTeacher = (id) => api.get(`/auth/teachers/${id}/`)
export const getCoursesByTeacher = (teacherId) => api.get('/courses/').then(res => ({
  ...res,
  data: res.data.filter(c => c.teacher === teacherId)
}))
export const deleteCourse = (id) => api.delete(`/courses/${id}/`)
export const deleteLesson = (courseId, lessonId) => api.delete(`/courses/${courseId}/lessons/${lessonId}/`)