import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
  return request({
   url: '/sys/system/role/list',
    method: 'get',
    params: query
  })
}

// 查询角色详细
export function getRole(id) {
  return request({
   url: '/sys/system/role/' + id,
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request({
   url: '/sys/system/role',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
   url: '/sys/system/role',
    method: 'put',
    data: data
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
   url: '/sys/system/role/dataScope',
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changeRoleStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
   url: '/sys/system/role/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole(id) {
  return request({
   url: '/sys/system/role/' + id,
    method: 'delete'
  })
}

// 导出角色
export function exportRole(query) {
  return request({
   url: '/sys/system/role/export',
    method: 'get',
    params: query
  })
}

// 下载角色导入模板
export function importTemplate() {
  return request({
   url: '/sys/system/role/importTemplate',
    method: 'get'
  })
}
