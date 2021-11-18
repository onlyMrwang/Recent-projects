import request from '@/utils/request'

// 查询车辆类型
export function getEquipType() {
  return request({
    url:'/app/aiSchedule/getEquipType',
    method: 'post',
  })
}
// / aiSchedule / getCarType
export function getCarType() {
  return request({
    url:'/app/aiSchedule/getCarType',
    method: 'get',
  })
}
// 查询列表
export function getLog(data,params) {
  return request({
    url:'/app/aiSchedule/getLog/'+params.page+"/"+params.limit,
    method: 'post',
    data:data
  })
}
// 人工中断
export function UpdateOneCarStatus(data) {
  return request({
    url:'/app/aiSchedule/UpdateOneCarStatus',
    method: 'post',
    params:data
  })
}
