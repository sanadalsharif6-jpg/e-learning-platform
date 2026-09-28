import api from './api'

export const getCourses = () => api.get('/courses/')
export const getCourse = (id) => api.get(`/courses/${id}/`)
export const createCourse = (data) => api.post('/courses/', data)
export const enrollInCourse = (id) => api.post(`/courses/${id}/enroll/`)
export const getMyEnrollments = () => api.get('/my-courses/')
export const getLessons = (courseId) => api.get(`/courses/${courseId}/lessons/`)
export const createLesson = (courseId, data) => api.post(`/courses/${courseId}/lessons/`, data)
export const getAssignments = (courseId) => api.get(`/courses/${courseId}/assignments/`)
export const createAssignment = (courseId, data) => api.post(`/courses/${courseId}/assignments/`, data)