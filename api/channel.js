import request from '@/api/request'

export function createChannel(data) {
  return request({
    url: '/channels',
    method: 'post',
    data
  })
}
