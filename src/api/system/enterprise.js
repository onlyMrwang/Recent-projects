import request from '@/utils/request'

// 添加企业
export function addArray(data) {
    return request({
     url: '/sys/system/tenant',
      method: 'post',
      data: data
    })
}
// 修改企业信息
export function upDate(data) {
    return request({
       url: '/sys/system/tenant',
        method: 'put',
        data: data
    })
}
// 获取回显数据
export function getData(){
    return request({
        url:"/sys/system/tenant/listId",
        method:"get"
    })
}