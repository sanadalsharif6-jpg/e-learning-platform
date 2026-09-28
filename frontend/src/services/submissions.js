import api from './api'

export const getAssignment = (id) => api.get(`/assignments/${id}/`)
export const submitAssignment = (assignmentId, data) => api.post(`/assignments/${assignmentId}/submit/`, data)
export const getAssignmentSubmissions = (assignmentId) => api.get(`/assignments/${assignmentId}/submissions/`)
export const getSubmission = (id) => api.get(`/submissions/${id}/`)
export const gradeSubmission = (id, data) => api.patch(`/submissions/${id}/grade/`, data)