import request from '@/utils/request'
// 获取充电机器人表单数据
export function getRobot(query) {
    return request({
      url: '/app/assets/chargrobot/robotInfo',
      method: 'get',
      params: query
    })
}
// 添加充电机器人表单数据
export function addRobot(data) {
  return request({
    url: '/app/assets/chargrobot/robotInfo',
    method: 'post',
    data: data
  })
}
// 修改充电机器人表单数据
export function editRobot(data) {
  return request({
    url: '/app/assets/chargrobot/robotInfo',
    method: 'put',
    data: data
  })
}
// 导出充电机器人信息表单数据
export function exportRobot(query) {
  return request({
    url: '/app/assets/chargrobot/export',
    method: 'get',
    params: query,
    responseType:'blob'
  })
}

// 充电机器人启用禁用
export function upDateOrStopRobotInfo(data) {
    return request({
        url: '/app/assets/chargrobot/openOrStopRobotInfo',
        method: 'POST',
        data: data,
    })
}

// 获取枪号
export function getGunNum(data) {
    return request({
        url: '/app/assets/charging/getGunNum',
        method: 'get',
        params: data,
    })
}

//获取充电机器人名称
export function getNameInfos(data) {
    return request({
        url: '/app/assets/chargrobot/robotNameInfo',
        method: 'get',
        params: data,
    })
}

