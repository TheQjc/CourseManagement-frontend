import request from '@/utils/request'

export function getCourseAssignments(courseId) {
  return request({
    url: `/assignments/course/${courseId}`,
    method: 'get'
  })
}

export function getAssignmentDetail(id) {
  return request({
    url: `/assignments/${id}`,
    method: 'get'
  })
}

export function createAssignment(data) {
  return request({
    url: '/assignments',
    method: 'post',
    data
  })
}

export function updateAssignment(id, data) {
  return request({
    url: `/assignments/${id}`,
    method: 'put',
    data
  })
}

export function deleteAssignment(id) {
  return request({
    url: `/assignments/${id}`,
    method: 'delete'
  })
}

export function submitAssignment(assignmentId, data) {
  return request({
    url: `/assignments/${assignmentId}/submit`,
    method: 'post',
    data
  })
}

export function gradeSubmission(submissionId, data) {
  return request({
    url: `/assignments/submissions/${submissionId}/grade`,
    method: 'put',
    data
  })
}

export function getAssignmentSubmissions(assignmentId) {
  return request({
    url: `/assignments/${assignmentId}/submissions`,
    method: 'get'
  })
}

export function getStudentSubmissions(studentId) {
  return request({
    url: `/assignments/student/${studentId}/submissions`,
    method: 'get'
  })
}
