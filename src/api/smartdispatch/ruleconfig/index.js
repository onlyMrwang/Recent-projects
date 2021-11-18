import request from '@/utils/request'

// 查询车辆类型
export function getHardRule(data,params) {
  return request({
    url:'/app/aiSchedule/getHardRule/'+params.page+"/"+params.limit,
    method: 'post',
    data:data
  })
}
// 新增，修改
export function AddOrUpdateHardRule(data) {
  return request({
    url:'/app/aiSchedule/AddOrUpdateHardRule',
    method: 'post',
    data:data
  })
}
// 停用
export function updateOneHardRule(params) {
  return request({
    url:'/app/aiSchedule/updateOneHardRule/'+params.id+"/"+params.effectType,
    method: 'post',
  })
}
// 删除
export function delOneHardRule(id) {
  return request({
    url:'/app/aiSchedule/delOneHardRule/'+id,
    method: 'post',
  })
}