import request from '@/utils/request'

//查询图片列表
export function listImage(query) {
  return request({
   url: '/sys/system/image/list',
    method: 'get',
    params: query
  })
}

// 查询图片详细
export function getImage(id) {
  return request({
   url: '/sys/system/image/' + id,
    method: 'get'
  })
}

// 新增图片
export function addImage(data) {
  return request({
   url: '/sys/system/image',
    method: 'post',
    data: data
  })
}

// 修改图片
export function updateImage(data) {
  return request({
   url: '/sys/system/image',
    method: 'put',
    data: data
  })
}

// 删除图片
export function delImage(id) {
  return request({
   url: '/sys/system/image/' + id,
    method: 'delete'
  })
}

// 根据图片名称获取图片内容
export function getName() {
  return request({
   url: '/sys/system/image/nameList/',
    method: 'get'
  })
}
