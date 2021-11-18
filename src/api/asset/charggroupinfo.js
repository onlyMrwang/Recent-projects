import request from '@/utils/request'

// 获取充电网点表单数据
export function chargGroupInfo(query) {
    return request({
      url: '/app/assets/charggroup/groupinfo',
      method: 'get',
      params: query
    })
}
// 新增网点
export function addchargGroupInfo(data) {
  return request({
    url: '/app/assets/charggroup/groupinfo',
    method: 'post',
    data: data
  })
}
// 修改网点
export function editchargGroupInfo(data) {
  return request({
    url: '/app/assets/charggroup/groupinfo',
    method: 'put',
    data: data
  })
}
// 删除网点
export function delchargGroupInfo(id) {
  return request({
    url: '/app/assets/charggroup/groupinfo/' + id,
    method: 'delete',
  })
}
// 地市经纬度获取
export function getAreaId(data) {
  return request({
    url: `/app/assets/apparea/manage`,
    method: 'get',
    params: data
  })
}
// 片区获取
export function getArea(areaId) {
  return request({
    url: `/app/assets/appregion/code?cityCode=${areaId}`,
    method: 'get',
  })
}
// 充电网点属性获取
export function getType() {
  return request({
    url: '/app/assets/charggroup/type',
    method: 'get'
  })
}
// 导出方法
export function exportFile(query) {
  return request({
    url: '/app/assets/charggroup/export',
    method: 'get',
    params: query,
    responseType:'blob'
  })
}
// 导入方法
export function importFile(query) {
  return request({
    url: '/app/assets/charggroup/importData',
    method: 'get',
    params: query,
    responseType:'arraybuffer'
  })
}
// 所属组织机构获取
export function getOrganization() {
  return request({
    url: '/sys/system/dept/treedept',
    method: 'get'
  })
}
// 获取组织机构信息
export function getOrgInfo(query) {
  return request({
    url: '/app/assets/deparment/list?id='+query,
    method: 'get'
  })
}
// 多数下拉框数据获取
export function getDropDown(name,id) {
  return request({
    url: '/app/assets/sys/datainfo',
    method: 'get',
    params: {
      key: name,
      parentValue:id
    }
  })
}
// 集团名称下拉框
export function getGroup(query) {
  return request({
    url: '/app/assets/sys/tenant',
    method: 'get',
    params: query,
  })
}