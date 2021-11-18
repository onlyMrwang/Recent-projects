import request from '@/utils/request'

// 上传app
export function addAppUpdateInfo(data) {
    return request({
      url: '/app/app/renew/record',
      method: 'post',
      timeout: 120 * 1000,
      data
    })
  }

// app更新列表
export function appUpdateList() {
  return request({
    url: '/app/app/renew/record',
    method: 'get',
  })
}