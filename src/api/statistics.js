import request from '@/utils/request'

export function getPlatformStatistics() {
  return request({
    url: '/statistics/platform',
    method: 'get'
  })
}

export function getCourseStatistics(courseId) {
  return request({
    url: `/statistics/course/${courseId}`,
    method: 'get'
  })
}

export function getStudentProgressReport(studentId) {
  return request({
    url: `/reports/student/${studentId}/progress`,
    method: 'get'
  })
}

export function getCourseLearningReport(courseId) {
  return request({
    url: `/reports/course/${courseId}/learning`,
    method: 'get'
  })
}
