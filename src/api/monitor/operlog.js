import request from '@/utils/request'

// 查询操作日志列表
export function list(query) {
  return request({
    url: '/sys/system/operlog/list',
    method: 'get',
    params: query
  })
}

// 删除操作日志
export function delLog(id) {
  return request({
    url: '/sys/system/operlog/' + id,
    method: 'delete'
  })
}

// 清空操作日志
export function cleanLog() {
  return request({
    url: '/sys/system/operlog/clean',
    method: 'delete'
  })
}

// 导出操作日志
export function exportLog(query) {
  return request({
    url: '/sys/system/operlog/export',
    method: 'get',
    params: query
  })
}
