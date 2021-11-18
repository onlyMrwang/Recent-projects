import request from '@/utils/request'


// 查询故障工单
export function getFaults(data, params) {
  return request({
    url: '/app/maintenance/workOrder/getFaults/' + params.page + '/' + params.limit,
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
    url: '/app/remotectrl/getSyncConfigList',
    method: 'get',
    params: query
  })
}
// 详情
export function getDetail(id) {
  return request({
    url: '/app/maintenance/workOrder/getOneFault/' + id,
    method: 'post',
    // params: JSON.stringify(id-0)
  })
}
//maintenance/workOrder/getTypeList
export function getTypeList() {
  return request({
    url: '/app/maintenance/workOrder/getTypeList',
    method: 'post',
  })
}