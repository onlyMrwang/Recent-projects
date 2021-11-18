import request from '@/utils/request'

//租户信息增加
export function addTenant(data){
  return request({
   url: '/sys/system/tenant',
    method: 'post',
    data: data
  })
}
//租户信息删除
export function deleteTenant(ids) {
  return request({
   url: '/sys/system/tenant/' + ids,
    method: 'delete'
  })
}
//租户信息修改
export function editTenant(data) {
  return request({
   url: '/sys/system/tenant',
    method: 'put',
    data: data
  })
}
//租户查询列表
export function listTenant(query) {
  return request({
   url: '/sys/system/tenant/list',
    method: 'get',
    params: query
  })
}

// 查询租户界面详细
  export function getTenant(id) {
    return request({
     url: '/sys/system/tenant/' + id,
      method: 'get'
    })
}
// 所有租户信息查询
export function allTenant(data) {
  return request({
   url: '/sys/system/tenant/all',
    method: 'get'
  })
}
