import request from '@/utils/request'

// 查询列表
export function list(query) {
  return request({
    url: '/app/remotectrl/getAssetsChargRobotList/' + query.pageNum + "/" + query.pageSize,
    method: 'get',
    params: query
  })
}
// 查询机器人编号
export function getRobotList(query) {
  return request({
    url: '/app/remotectrl/getRobotList',
    method: 'get',
    params: query
  })
}
// 复位
export function resetOperation(data) {
  return request({
    url: '/app/remotectrl/resetOperation',
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
// export function list(query) {
//   return request({
//     url: '/app/remotectrl/getEquipmentVoList',
//     method: 'get',
//     params: query
//   })
// }