import request from '@/utils/request';
import { stringify } from 'qs'


// 获取路由列表
export function getRoutersList() {
  return request({
    url: `/common/getRouters`,
    method: 'get',
    showLoading: false
  })
}

// 登录
export function login(data) {
  return request({
    url: '/common/login',
    method: 'post',
    data,
    showLoading: false
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/common/getInfo',
    method: 'get',
    showLoading: false
  })
}

// 退出
export function logout() {
  return request({
    url: '/common/logout',
    method: 'post',
    showLoading: false
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/common/captchaImage',
    method: 'get',
    showLoading: false
  })
}

// 获取公钥
export function getPublicKey(data) {
  return request({
    url: `/common/getPublicKey?${stringify(data)}`,
    method: 'get',
    showLoading: false
  })
}

// 获取字典数据
export function getDictInfo() {
  return request({
    url: '/app/assets/sys/datainfo',
    method: 'get',
    showLoading: false
  })
}

// 获取企业下所有机构树
export function getAllOrgOfCompany() {
  return request({
    url: '/sys/system/dept/treeselect',
    method: 'get',
    showLoading: false
  })
}

// 判断当前路径是否有权限访问
export function toCheckRescource(data) {
  return request({
    url: '/sys/system/menu/checkRescource',
    method: 'get',
    params: data,
    showLoading: false
  })
}