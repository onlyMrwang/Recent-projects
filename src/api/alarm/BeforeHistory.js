//告警前转策略
import request from '@/utils/request'

export function getList(query) {
    return request({
       url: '/app/alarm/forwarg-log/getForwargLog',
        method: 'get',
        params: query
    })
}

export function addList(query) {
    return request({
       url: '/app/alarm/pole-forward-config/savePoleForwardConfig',
       method: 'post',
       data: query,
    })
}

// 导出
export function exportHistory(query) {
    return request({
       url: '/app/alarm/forwarg-log/exprot',
        method: 'get',
        timeout: 120 * 1000,
        params: query,
        responseType: 'blob'
    })
}