import request from '@/utils/request'


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
// 查询巡检工单
export function getInspections(data,params) {
  return request({
    url: '/app/maintenance/workOrder/getInspections/'+params.page +'/'+params.limit,
    method: 'post',
    data: data
  })
}
// 巡检详情
export function getDetail(id) {
  return request({
    url: '/app/maintenance/workOrder/getOneInspection/'+id,
    method: 'post',
    // params: JSON.stringify(id-0)
  })
}
// // 查询列表
// export function list(query) {
//   return request({
//     url: '/app /maintenance/workOrder/getInspections',
//     method: 'get',
//     params: query
//   })
// }
// 下发
export function addOne(data) {
  return request({
    url: '/app/remotectrl/add',
    method: 'post',
    data: data
  })
}