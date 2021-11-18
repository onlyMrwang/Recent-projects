import request from '@/utils/request'
// 获取厂商表单数据
export function getFacturer(query) {
    return request({
      url: '/app/assets/facturer/info',
      method: 'get',
      params: query
    })
}
// 新添厂商表单数据
export function addFacturer(data) {
  return request({
    url: '/app/assets/facturer/info',
    method: 'post',
    data:data
  })
}
// 修改厂商表单数据
export function editFacturer(data) {
  return request({
    url: '/app/assets/facturer/info',
    method: 'put',
    data: data
  })
}
// 导出厂商表单数据
export function exportFacturer(query) {
  return request({
    url: '/app/assets/facturer/export',
    method: 'get',
    params: query,
    responseType:'blob'
  })
}


// 停用启用
export function upDateList(query) {
    return request({
        url: '/app/assets/facturer/openOrStopFacturerInfo',
        method: 'post',
        data: query,
    })
}