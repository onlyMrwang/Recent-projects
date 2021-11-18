import request from '@/utils/request'

// 下发
export function toIssue(data) {
  return request({
    url: '/app/remotectrl/synchronizeTime',
    method: 'post',
    data: data
  })
}
// 查询网点
export function getChargGroupCode(query) {
  return request({
    url: '/app/remotectrl/getChargGroupCode',
    method: 'get',
    params: query
  })
}
// 查询设备及编号
export function getEquipment(query) {
  return request({
    url: '/app/remotectrl/getEquipment',
    method: 'get',
    params: query
  })
}
// 查询列表
export function list(query) {
  return request({
    url: '/app/remotectrl/getEquipmentVoList',
    method: 'get',
    params: query
  })
}