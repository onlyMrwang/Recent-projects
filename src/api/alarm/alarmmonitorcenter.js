// 告警监控中心AJAX请求方法
import request from '@/utils/request'

// 网点列表
export function listChargGroupCode(id) {
    return request({
       url: '/app/alarm/pole-rtrecord/getChargGroupCode',
        method: 'get',
        params: id
    })
}

// 查询实时告警列表
export function listPoleRtrecord(query) {
    return request({
       url: '/app/alarm/pole-rtrecord/getPoleRtrecord',
        method: 'get',
        params: query
    })
}

// 告警清楚
export function clearClearAway(data) {
    return request({
       url: '/app/alarm/pole-rtrecord/doClearAway',
        method: 'PUT',
        data: data
    })
}

// 生成EXCEL
export function getExprot(query) {
    return request({
       url: '/app/alarm/pole-rtrecord/exprot',
        method: 'get',
        timeout: 120 * 1000,
        responseType: 'blob',
        params: query
    })
}