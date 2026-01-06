import request from '@/utils/request'

export function getCourseQuestions(courseId) {
  return request({
    url: `/questions/course/${courseId}`,
    method: 'get'
  })
}

export function getPendingQuestions(courseId) {
  return request({
    url: `/questions/course/${courseId}/pending`,
    method: 'get'
  })
}

export function askQuestion(data) {
  return request({
    url: '/questions/ask',
    method: 'post',
    data
  })
}

export function answerQuestion(questionId, data) {
  return request({
    url: `/questions/${questionId}/answer`,
    method: 'put',
    data
  })
}

export function getStudentQuestions(studentId) {
  return request({
    url: `/questions/student/${studentId}`,
    method: 'get'
  })
}

export function getTeacherQuestions(teacherId) {
  return request({
    url: `/questions/teacher/${teacherId}`,
    method: 'get'
  })
}
