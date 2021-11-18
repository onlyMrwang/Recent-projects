//平台登录日志
import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/app/alarm/platform-operation/getPlatformOperationInfo',
    method: 'get',
    params: query
  })
}