import request from '@/utils/request'

export function getStudentNotes(studentId) {
  return request({
    url: `/notes/student/${studentId}`,
    method: 'get'
  })
}

export function getCourseNotes(studentId, courseId) {
  return request({
    url: `/notes/student/${studentId}/course/${courseId}`,
    method: 'get'
  })
}

export function createNote(studentId, data) {
  return request({
    url: `/notes?studentId=${studentId}`,
    method: 'post',
    data
  })
}

export function updateNote(id, data) {
  return request({
    url: `/notes/${id}`,
    method: 'put',
    data
  })
}

export function deleteNote(id) {
  return request({
    url: `/notes/${id}`,
    method: 'delete'
  })
}

export function getNoteDetail(id) {
  return request({
    url: `/notes/${id}`,
    method: 'get'
  })
}
