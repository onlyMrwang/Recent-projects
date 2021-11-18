//车辆告警中心
import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/app/alarm/car-rtrecord/getCarRtrecordInfo',
    method: 'get',
    params: query
  })
}
//获取告警类型
export function getAlarmTypeByComm(query) {
  return request({
    url: '/app/alarm/knowledge-config/getAlarmTypeByComm',
    method: 'get',
    params: query
  })
}
//获取告警名称
export function getAlarmTitleByType(query) {
  return request({
    url: '/app/alarm/knowledge-config/getAlarmTitleByType',
    method: 'get',
    params: query
  })
}
//获取车牌号
export function getCarNumberByOrg(query) {
  return request({
    url: '/app/alarm/knowledge-config/getCarNumberByOrg',
    method: 'get',
    params: query
  })
}

//导出实时列表
export function getExprot(query) {
  return request({
    url: '/app/alarm/car-rtrecord/exprot',
    method: 'get',
    timeout: 120 * 1000,
    responseType: 'blob',
    params: query
  })
}
// 告警清楚
export function clearClearAway(data) {
  return request({
    url: '/app/alarm/car-rtrecord/doClearAway',
    method: 'PUT',
    data: data
  })
}