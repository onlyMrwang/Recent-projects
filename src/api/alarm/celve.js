// 告警监控中心AJAX请求方法
import request from '@/utils/request'
// 修改前转策略
export function upDateList(id) {
    return request({
       url: '/app/alarm/pole-forward-config/updatePoleForwardConfig',
        method: 'put',
        data: id,
    })
}

//新增策略
export function addList(id) {
    return request({
       url: '/app/alarm/pole-filter-config/savePoleFilterConfig',
        method: 'post',
        data: id
    })
}


//修改策略
export function upDateLists(id) {
    return request({
       url: '/app/alarm/pole-filter-config/updatePoleFilterConfig',
        method: 'put',
        data: id
    })
}


//查询告警名称
export function getAlarmTitle(data) {
    return request({
       url: '/app/alarm/knowledge-config/getAlarmTitle',
        method: 'get',
        params: data,
        showLoading: false
    })
}

// 预警列表
export function getPreAlarmList(data) {
    return request({
        url: '/app/alarm/knowledge-config/getAlarmTitle',
        method: 'get',
        params: data
    })
}

// 派单详情
export function getOrderPoleInfo(data) {
    return request({
        url: '/app/alarm/pole-rtrecord/sendOrdersPole',
        method: 'get',
        params: data
    })
}

// 派单确认
export function submitOrderPole(data) {
    return request({
        url: '/app/alarm/pole-rtrecord/sendOrdersPoleClick',
        method: 'post',
        data
    })
}

// 停机日志列表
export function getStoplogs(data) {
    return request({
        url: '/app/alarm/pole-stop-record/getPoleStopRecord',
        method: 'get',
        params: data
    })
}

// 停机日志详情
export function getStoplogsDetail(id) {
    return request({
        url: '/app/alarm/pole-stop-record/getPoleStopRecordDetails',
        method: 'get',
        params: {stopObjId: id}
    })
}

// 充电过程数据列表
export function getProcessData(data) {
    return request({
        url: '/app/alarm/charge-process-data/getChargeProcessData',
        method: 'get',
        params: data
    })
}

// 导出充电过程数据
export function exportProcessData(data) {
    return request({
        url: '/app/alarm/charge-process-data/exprot',
        method: 'get',
        timeout: 120 * 1000,
        responseType: 'blob',
        params: data
    })
}

// 历史报文
export function getHistoryMsg(data) {
    return request({
        url: '/app/alarm/collect-pole-history-message/getCollectPoleHistoryMessage',
        method: 'get',
        params: data
    })
}


// 导出历史报文
export function exportHistoryMsg(data) {
    return request({
        url: '/app/alarm/collect-pole-history-message/exprot',
        method: 'get',
        timeout: 120 * 1000,
        responseType: 'blob',
        params: data
    })
}
