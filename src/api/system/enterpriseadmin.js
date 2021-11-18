import request from '@/utils/request'

// 查询企业管理员
export function getTableList(id) {
    return request({
       url: '/sys/system/enterprise/user',
        method: 'get',
        params: id
    })
}
// 新增企业
export function addList(query) {
    return request({
       url: '/sys/system/enterprise/user',
        method: 'post',
        data: query
    })
}

// 修改企业
export function upDateList(query) {
    return request({
       url: '/sys/system/enterprise/user',
        method: 'put',
        data: query
    })
}