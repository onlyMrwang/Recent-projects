import request from '@/utils/request'

// 查询字典数据列表
export function listData(query) {
  return request({
   url: '/sys/system/dict/data/list',
    method: 'get',
    params: query
  })
}

// 查询字典数据详细
export function getData(id) {
  return request({
   url: '/sys/system/dict/data/' + id,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(key) {
  return request({
   url: '/sys/system/dict/data/type/' + key,
    method: 'get'
  })
}

// 新增字典数据
export function addData(data) {
  return request({
   url: '/sys/system/dict/data',
    method: 'post',
    data: data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
   url: '/sys/system/dict/data',
    method: 'put',
    data: data
  })
}

// 删除字典数据
export function delData(id) {
  return request({
   url: '/sys/system/dict/data/' + id,
    method: 'delete'
  })
}

// 导出字典数据
export function exportData(query) {
  return request({
   url: '/sys/system/dict/data/export',
    method: 'get',
    params: query
  })
}