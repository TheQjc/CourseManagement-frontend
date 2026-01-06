import request from '@/utils/request'

export function getCourseExams(courseId) {
  return request({
    url: `/exams/course/${courseId}`,
    method: 'get'
  })
}

export function createExam(data) {
  return request({
    url: '/exams',
    method: 'post',
    data
  })
}

export function addExamQuestion(examId, data) {
  return request({
    url: `/exams/${examId}/questions`,
    method: 'post',
    data
  })
}

export function getExamQuestions(examId) {
  return request({
    url: `/exams/${examId}/questions`,
    method: 'get'
  })
}

export function startExam(examId, data) {
  return request({
    url: `/exams/${examId}/start`,
    method: 'post',
    data
  })
}

export function submitExam(submissionId, data) {
  return request({
    url: `/exams/submissions/${submissionId}/submit`,
    method: 'post',
    data
  })
}

export function getExamSubmissions(examId) {
  return request({
    url: `/exams/${examId}/submissions`,
    method: 'get'
  })
}

export function getStudentExamSubmissions(studentId) {
  return request({
    url: `/exams/student/${studentId}/submissions`,
    method: 'get'
  })
}
