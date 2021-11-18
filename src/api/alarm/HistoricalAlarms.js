//告警前转策略
import request from '@/utils/request'

// 查询列表
export function getList(query) {
    return request({
        url: '/app/alarm/pole-hisrecord/getPoleHisrecord',
        method: 'get',
        params: query
    })
}

// 导出EXCEL
export function getExprot(query) {
    return request({
        url: '/app/alarm/pole-hisrecord/exprotPoleHisrecord',
        method: 'get',
        timeout: 120 * 1000,
        responseType: 'blob',
        params: query
    })
}