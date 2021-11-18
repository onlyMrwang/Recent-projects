import request from '@/utils/request'
// 获取车辆信息数据
export function getCarInfo(query) {
    return request({
      url: '/app/assets/carinfo/groupinfo',
      method: 'get',
      params: query
    })
}
// 添加车辆信息数据
export function addCarInfo(base,elec,battery, terminal) {
  return request({
    url: '/app/assets/carinfo/groupinfo',
    method: 'post',
    data: {
      carInfo:base,
      carPartsMotor: elec,
      carPartsBattery:battery,
      carTerminal: terminal
    }
  })
}
// 修改车辆信息数据
export function editCarInfo(base,elec,battery, terminal) {
  return request({
    url: '/app/assets/carinfo/groupinfo',
    method: 'put',
    data: {
      carInfo: base,
      carPartsMotor: elec,
      carPartsBattery:battery,
      carTerminal: terminal
    }
  })
}
// 导出车辆信息表单数据
export function exportCarInfo(query) {
  return request({
    url: '/app/assets/carinfo/export',
    method: 'get',
    params: query,
    responseType:'blob'
  })
}

//车辆启用禁用得方法
export function upDateStopCarInfo(data) {
    return request({
        url: '/app/assets/carinfo/openOrStopCarInfo',
        method: 'POST',
        data: data,
    })
}
