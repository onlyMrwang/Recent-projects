//状态上报上报
import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/app/alarm/car-process-data/getCarProcessDataInfo',
    method: 'get',
    params: query
  })
}