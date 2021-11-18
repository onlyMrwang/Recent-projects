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
// 查询列表
export function list(query) {
  return request({
    url: '/app/remotectrl/getSyncConfigList/'+query.pageNum + "/"+query.pageSize,
    method: 'get',
    params: query
  })
}
// 下发
export function addOne(data) {
  return request({
    url: '/app/remotectrl/add',
    method: 'post',
    data: data
  })
}
// 修改
export function updateOne(params) {
  return request({
    url: '/app/remotectrl/update',
    method: 'post',
    params: params
  })
}
// 删除
export function deleteOne(params) {
  return request({
    url: '/app/remotectrl/remove?jobId='+params.jobId,
    method: 'post',
    // params: params
  })
}