import request from '@/utils/request'

// 获取充电网点表单数据
export function chargGroup(query) {
    return request({
      url: '/app/assets/charging/chargingInfo',
      method: 'get',
      params: query
    })
}
// 新增充电网点表单数据
export function addChargGroup(data) {
  return request({
    url: '/app/assets/charging/chargingInfo',
    method: 'post',
    data:data
  })
}
// 修改充电网点表单数据
export function editChargGroup(data) {
  return request({
    url: '/app/assets/charging/chargingInfo',
    method: 'put',
    data:data
  })
}
// 导出充电网点表单数据
export function exportChargGroup(query) {
  return request({
    url: '/app/assets/charging/export',
    method: 'get',
    params: query,
    responseType:'blob'
  })
}

// 导出充电网点表单数据
export function upDateStopChargingInfo(data) {
    return request({
        url: '/app/assets/charging/openOrStopChargingInfo',
        method: 'post',
        data: data
    })
}

// 根据网点获取充电设备
export function getChargeBySite(query) {
  return request({
    url: '/app/alarm/pole-rtrecord/getChargCode',
    method: 'get',
    params: query
  })
}

// 验证充电枪是否绑定充电机器人
export function getValidGunNum(query) {
  return request({
    url: '/app/assets/charging/validGunNum',
    method: 'get',
    params: query
  })
}