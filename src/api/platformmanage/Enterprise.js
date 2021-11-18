import request from "@/utils/request";

// 获取平台企业列表
export function getOrgList(query) {
  return request({
    url: "/sys/system/tenant/list",
    method: "get",
    params: query,
  });
}

// 获取平台企业列表
export function getCity(query) {
  return request({
    url: "/app/assets/apparea/manage",
    method: "get",
    params: query,
  });
}
// 用户密码重置
export function resetUserPwd(id, password) {
  const data = {
    id,
    password
  }
  return request({
    url: '/sys/system/user/resetPwd',
    method: 'put',
    data: data
  })
}
// 修改
export function uplatetenant(data) {
  return request({
    url: '/sys/system/tenant',
    method: 'put',
    data: data
  })
}
// 新增
export function addtenant(data) {
  return request({
    url: '/sys/system/tenant',
    method: 'post',
    data: data
  })
}
// 启用停用
export function toStop(data) {
  return request({
    url: '/sys/system/tenant/storpOrStart',
    method: 'put',
    params: data
  })
}