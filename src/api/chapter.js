import request from '@/utils/request'

export function createChapter(data) {
  return request({
    url: '/chapters',
    method: 'post',
    data
  })
}

export function updateChapter(id, data) {
  return request({
    url: `/chapters/${id}`,
    method: 'put',
    data
  })
}

export function deleteChapter(id) {
  return request({
    url: `/chapters/${id}`,
    method: 'delete'
  })
}

export function getChapterDetail(id) {
  return request({
    url: `/chapters/${id}`,
    method: 'get'
  })
}
