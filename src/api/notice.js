import request from '@/utils/request'

export function getAllNotices() {
  return request({
    url: '/notices',
    method: 'get'
  })
}

export function getNoticeDetail(id) {
  return request({
    url: `/notices/${id}`,
    method: 'get'
  })
}

export function createNotice(data) {
  return request({
    url: '/notices',
    method: 'post',
    data
  })
}

export function updateNotice(id, data) {
  return request({
    url: `/notices/${id}`,
    method: 'put',
    data
  })
}

export function deleteNotice(id) {
  return request({
    url: `/notices/${id}`,
    method: 'delete'
  })
}
