import request from '@/utils/request'

//获取设备厂商
export function getChargManu(query) {
    return request({
        url: '/app/alarm/pole-filter-config/getChargManu',
        method: 'get',
        params: query
    })
}


// 获取列表
export function getList(id) {
    return request({
        url: '/app/alarm/knowledge-config/getKnowledgeConfig',
        method: 'get',
        params: id
    })
}

// 充电设备查询
export function getChargingInfo(data) {
    return request({
        url: '/app/alarm/pole-filter-config/getChargingInfo',
        method: 'get',
        params: data
    })
}

// 设备类型查询
export function getDataInfo(id) {
    return request({
        url: '/app/alarm/pole-filter-config/getDataInfo',
        method: 'get',
        params: id
    })
}
// 查询实时告警列表
export function listPoleRtrecord(query) {
    return request({
        url: '/app/alarm/pole-filter-config/getPoleFilterConfig',
        method: 'get',
        params: query
    })
}

//查询告警类型下拉框
export function getAlarmType(query) {
    return request({
        url: '/app/alarm/knowledge-config/getAlarmType',
        method: 'get',
        params: query
    })
}


// 新增告警通知策略
export function addList(query) {
    return request({
        // url: '/app/alarm/pole-filter-config/savePoleFilterConfig',
        url: '/app/alarm/pole-forward-config/savePoleForwardConfig',
        method: 'post',
        data: query
    })
}

// 修改告警通知策略
export function upDateList(query) {
    return request({
        url: '/app/alarm/knowledge-config/updateKnowledgeConfigById',
        method: 'put',
        data: query
    })
}

// 启用告警知识库
export function doStartKnowledgeConfig(query) {
    return request({
        url: '/app/alarm/knowledge-config/doStartKnowledgeConfig',
        method: 'put',
        params: query
    })
}


export function listAlarmTitle(id) {
    return request({
        url: '/app/alarm/knowledge-config/getAlarmTitle',
        method: 'get',
        params: id
    })
}

// 修改告警知识库
export function stopWledgeConfig(query) {
    return request({
        url: '/app/alarm/knowledge-config/updateKnowledgeConfigById',
        method: 'put',
        data: query
    })
}


// 删除告警知识库
export function clertList(data) {
    return request({
        url: '/app/alarm/knowledge-config/deleteKnowledgeConfigById',
        method: 'post',
        data
    })
}

// 根据网点查设备列表
export function getChargeBySite(query) {
    return request({
        url: '/app/assets/charggroup/getGroupAndChargAndRobot',
        method: 'get',
        params: query
    })
}


// 告警详情
export function getAlarmDetail(query) {
    return request({
        url: '/app/alarm/pole-rtrecord/getKnowledgeConfigDetails',
        method: 'get',
        params: query
    })
}