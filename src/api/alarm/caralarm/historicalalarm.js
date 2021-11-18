//历史告警
import request from '@/utils/request'

// 查询列表
export function getList(query) {
  return request({
    url: '/app/alarm/car-hisrecord/getCarHisrecordInfo',
    method: 'get',
    params: query
  })
}
//导出实时列表
export function getExprot(query) {
  return request({
    url: '/app/alarm/car-hisrecord/exprot',
    method: 'get',
    timeout: 120 * 1000,
    responseType: 'blob',
    params: query
  })
}