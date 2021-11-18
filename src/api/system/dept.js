import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
   url: '/sys/system/dept/list',
    method: 'get',
    params: query
  })
}
// 省市区
export function listDepts() {
  return request({
   url: '/app/assets/apparea/manage',
    method: 'get',
  })
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(id) {
  return request({
   url: '/sys/system/dept/list/exclude/' + id,
    method: 'get'
  })
}

// 查询部门详细
export function getDept(id) {
  return request({
   url: '/sys/system/dept/' + id,
    method: 'get'
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
   url: '/sys/system/dept/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return request({
   url: '/sys/system/dept/roleDeptTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增部门
export function addDept(data) {
  return request({
   url: '/sys/system/dept',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
   url: '/sys/system/dept',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delDept(id) {
  return request({
   url: '/sys/system/dept/' + id,
    method: 'delete'
  })
}

// 用户id查询部门
export function userDeptTreeselect(userId) {
  return request({
   url: '/sys/system/dept/user/' + userId,
    method: 'get'
  })
}

// 导出组织机构列表
export function exportDept(query) {
  return request({
   url: '/sys/system/dept/export',
    method: 'get',
    params: query
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
   url: '/sys/system/dept/importTemplate',
    method: 'get'
  })
}
// 获取当前用户的组织机构树
export function getTreeOrg(query) {
  return request({
   url: '/sys/system/dept/treedept',
    method: 'get',
    params: query
  })
}