import request from '@/utils/request'

export function getCourseDiscussions(courseId) {
  return request({
    url: `/discussions/course/${courseId}`,
    method: 'get'
  })
}

export function createDiscussion(data) {
  return request({
    url: '/discussions',
    method: 'post',
    data
  })
}

export function replyDiscussion(discussionId, data) {
  return request({
    url: `/discussions/${discussionId}/reply`,
    method: 'post',
    data
  })
}

export function getDiscussionReplies(discussionId) {
  return request({
    url: `/discussions/${discussionId}/replies`,
    method: 'get'
  })
}
