import request from '@/utils/request'

// 查询车辆类型
export function getCarType() {
  return request({
    url: '/app/aiSchedule/getCarType',
    method: 'post',
  })
}
// 查询列表
export function getCarRule(data, params) {
  return request({
    url: '/app/aiSchedule/getCarRule/' + params.page + "/" + params.limit,
    method: 'post',
    data: data
  })
}
// 新增、编辑
export function AddOrUpdateCarRule(data) {
  return request({
    url: '/app/aiSchedule/AddOrUpdateCarRule',
    method: 'post',
    data: data
  })
}
// 删除
export function delOneCarRule(id) {
  return request({
    url: '/app/aiSchedule/delOneCarRule/' + id,
    method: 'post',
  })
}
// 状态修改
export function updateOneCarRule(params) {
  return request({
    url: '/app/aiSchedule/updateOneCarRule/' + params.id + "/" + params.effectType,
    method: 'post',
  })
}
// 去重

export function getCarTypeByCondition(params) {
  return request({
    url: '/app/aiSchedule/getCarTypeByCondition',
    method: 'get',
    params: params
  })
}