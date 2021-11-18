import request from '@/utils/request'

// 查询日志
export function seachLogs(query) {
  return request({
    url: '/app/remotectrl/getRobotLogs/' + query.pageNum + "/" + query.pageSize,
    method: 'get',
    params: query
  })
}
// 查询日志
export function getRobotName(query) {
  return request({
    url: '/app/remotectrl/getRobotName',
    method: 'get',
    params: query
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
    url: '/app/remotectrl/getEquipmentVoList/' + query.pageNum + "/" + query.pageSize,
    method: 'get',
    params: query
  })
}