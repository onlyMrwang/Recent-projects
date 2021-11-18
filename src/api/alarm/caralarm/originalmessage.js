//原始报文查询
import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/app/alarm/collect808-history-message/getCarHistoryMessage',
    method: 'get',
    params: query
  })
}
//导出原始报文
export function getExprot(query) {
  return request({
    url: '/app/alarm/collect808-history-message/exprot',
    method: 'get',
    timeout: 120* 1000,
    responseType: 'blob',
    params: query
  })
}

// 查询命令标识
export function getCarCommandCode(query) {
  return request({
    url: '/app/alarm/collect808-history-message/getCarCommandCode',
    method: 'get',
    params: query
  })
}