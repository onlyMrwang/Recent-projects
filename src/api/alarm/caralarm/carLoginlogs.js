//车辆登录日志
import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/app/alarm/vehicle-login/getVehicleLoginInfo',
    method: 'get',
    params: query
  })
}
// 获取车牌号
export function getCarNumberByOrgName(query) {
  return request({
    url: '/app/alarm/knowledge-config/getCarNumberByOrgName',
    method: 'get',
    params: query
  })
}