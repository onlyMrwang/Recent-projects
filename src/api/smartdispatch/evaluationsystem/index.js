import request from '@/utils/request'

// 充电时长接口
export function getTime(params) {
  return request({
    url: '/app/aiSchedule/getTime',
    method: 'post',
    params: params
  })
}
// 充电费用接口
export function getCost(params) {
  return request({
    url: '/app/aiSchedule/getCost',
    method: 'post',
    params: params
  })
}
// 充电桩利用率接口
export function getCharg(params) {
  return request({
    url: '/app/aiSchedule/getCharg',
    method: 'post',
    params: params
  })
}
// 概况数据展示查询接口
export function getAnalysis(params) {
  return request({
    url: '/app/aiSchedule/getAnalysis',
    method: 'post',
    params: params
  })
}