import request from '@/utils/request';

// 白名单列表
export function getWhiteList(data) {
    return request({
      url: '/app/finance/whitelist/manager/list',
      method: 'get',
      params: data
    })
  }
  
  // 白名单停启用
  export function whiteUpdateStatus(data) {
    return request({
      url: '/app/finance/whitelist/manager/updateStatus',
      method: 'post',
      data
    })
  }
  
  // 白名单详情
  export function getWhiteInfo(data) {
    return request({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url: '/app/finance/whitelist/manager/whiteInfo',
      method: 'get',
      params: data
    })
  }
  
  // 白名单配置
  export function whiteSetting(data) {
    return request({
      url: '/app/finance/whitelist/manager/addWhitelist',
      method: 'post',
      data
    })
  }