import request from '@/utils/request'
// 获取职工表单数据
export function getEmployeeInfo(query) {
    return request({
      url: '/app/assets/basic/userInfo',
      method: 'get',
      params: query
    })
}

// 职工下拉框列表
export function getEmployeeList(query) {
  return request({
    url: '/app/assets/basic/staffinfo',
    method: 'get',
    params: query
  })
}

// 添加职工表单数据
export function addEmployeeInfo(data) {
  return request({
    url: '/app/assets/basic/userInfo',
    method: 'post',
    data
  })
}
// 修改职工表单数据
export function editEmployeeInfo(data) {
  return request({
    url: '/app/assets/basic/userInfo',
    method: 'put',
    data
  })
}
// 导出职工信息表单数据
export function upDate(query) {
  return request({
    url: '/app/assets/basic/export',
      method: 'get',
      params: query,
      responseType:'blob'
  })
}

// 重置员工密码
export function changePass(query) {
    return request({
        url: '/app/assets/basic/resetPassword',
        method: 'POST',
        data: query
    })
}

// 职工启用禁用
export function upDateList(query) {
    return request({
        url: '/app/assets/basic/openOrStopUserInfo',
        method: 'post',
        data: query
    })
}

// 职工导出
export function exportEmployeeInfo(query) {
    return request({
        url: '/app/assets/basic/export',
        method: 'get',
        params: query,
        responseType:'blob'
    })
}

// 职工详情
export function getUserDetail(query) {
  return request({
      url: '/app/assets/basic/getUserInfoById',
      method: 'get',
      params: query,
  })
}