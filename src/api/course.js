import request from '@/utils/request'

export function getPublicCourses() {
  return request({
    url: '/courses/public',
    method: 'get'
  })
}

export function getCourseDetail(id) {
  return request({
    url: `/courses/${id}`,
    method: 'get'
  })
}

export function createCourse(data, teacherId) {
  return request({
    url: `/courses?teacherId=${teacherId}`,
    method: 'post',
    data
  })
}

export function getTeacherCourses(teacherId) {
  return request({
    url: `/courses/teacher/${teacherId}`,
    method: 'get'
  })
}

export function enrollCourse(data) {
  return request({
    url: '/student-courses/enroll',
    method: 'post',
    data
  })
}

export function getStudentCourses(studentId) {
  return request({
    url: `/student-courses/student/${studentId}`,
    method: 'get'
  })
}

export function getCourseChapters(courseId) {
  return request({
    url: `/chapters/course/${courseId}`,
    method: 'get'
  })
}

export function updateCourseStatus(id, status) {
  return request({
    url: `/courses/${id}/status`,
    method: 'put',
    data: { status }
  })
}
