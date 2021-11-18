import request from '@/utils/request'

// 查询维修工单
export function getRepairs(data, params) {
  return request({
    url: '/app/maintenance/workOrder/getRepairs/' + params.page + '/' + params.limit,
    method: 'post',
    data: data
  })
}
// 维修详情
export function getOneRepair(code) {
  return request({
    url: '/app/maintenance/workOrder/getOneRepair/' + code,
    method: 'post',
    // params: JSON.stringify(id-0)
  })
}
// 接收
export function updateOrder(jobCode, jobState) {
  return request({
    url: '/app/maintenance/workOrder/updateOrder/' + jobCode + '/' + jobState,
    method: 'post',
  })
}

// 处理
export function updateRepair(data, params) {
  return request({
    url: '/app/maintenance/workOrder/updateRepair/' + params.jobState + '/' + params.jobCode,
    method: 'post',
    data: data
  })
}
// 删除图片
export function delUrl(data) {
  return request({
    url: '/app/maintenance/workOrder/delUrl',
    method: 'post',
    params: data
  })
}