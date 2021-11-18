import request from '@/utils/request'

// 查询字典归类列表
export function listDataRoute(query) {
  return request({
   url: '/sys/system/dataroute/list',
    method: 'get',
    params: query
  })
}

// 查询字典归类详细
export function getDataRoute(id) {
  return request({
   url: '/sys/system/dataroute/' + id,
    method: 'get'
  })
}

// 新增字典归类
export function addDataRoute(data) {
  return request({
   url: '/sys/system/dataroute',
    method: 'post',
    data: data
  })
}

// 修改字典归类
export function updateDataRoute(data) {
  return request({
   url: '/sys/system/dataroute',
    method: 'put',
    data: data
  })
}

// 删除字典归类
export function delDataRoute(id) {
  return request({
   url: '/sys/system/dataroute/' + id,
    method: 'delete'
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
   url: '/sys/system/dataroute/treeselect',
    method: 'get'
  })
}
