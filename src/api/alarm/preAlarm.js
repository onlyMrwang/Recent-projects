import request from '@/utils/request'

// 查询预警门限列表
export function getPreAlarmList(data) {
    return request({
        url: '/app/alarm/warning-configuration/getWarningInfo',
        method: 'get',
        params: data
    })
}

// 新增预警门限
export function addPreAlarm(data) {
    return request({
        url: '/app/alarm/warning-configuration/postWarningInfo',
        method: 'post',
        data
    })
}

// 修改预警门限
export function updatePreAlarm(data) {
    return request({
        url: '/app/alarm/warning-configuration/putWarningInfo',
        method: 'post',
        data
    })
}

// 查询预警门限车辆列表
export function getPreCarList(data) {
    return request({
        url: '/app/alarm/warning-configuration/getWarningCarInfo',
        method: 'get',
        params: data
    })
}

// 查询预警门限桩列表
export function getPreChargeList(data) {
    return request({
        url: '/app/alarm/warning-configuration/getWarningChargInfo',
        method: 'get',
        params: data
    })
}

// 删除预警门限
export function deletePreAlarm(id) {
    return request({
        url: '/app/alarm/warning-configuration/deleteWarningInfo',
        method: 'post',
        data: { id }
    })
}

// 预警停启用
export function updateStatusPreAlarm(data) {
    return request({
        url: '/app/alarm/warning-configuration/openOrStopWarningInfo',
        method: 'post',
        data
    })
}