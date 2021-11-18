import request from '@/utils/request'

// 充电机器人实时告警列表
export function getRobotAlarmList(data) {
    return request({
       url: '/app/alarm/robot-rtrecord/getRobotRtrecord',
        method: 'get',
        params: data
    })
}

// 导出充电机器人实时告警
export function exportRobotAlarmList(data) {
    return request({
       url: '/app/alarm/robot-rtrecord/exprot',
        method: 'get',
        responseType: 'blob',
        params: data
    })
}

// 删除实时告警
export function deleteAlarmById(id) {
    return request({
       url: '/app/alarm/knowledge-config/deleteKnowledgeConfigById',
        method: 'post',
        data: {alarmCode: id}
    })
}

// 机器人告警知识库列表
export function getRobotAlarmBase(data) {
    return request({
       url: '/app/alarm/knowledge-config/getRobotKnowledgeConfig',
        method: 'get',
        params: data
    })
}

// 机器人型号列表
export function getRobotTypeList() {
    return request({
       url: '/app/assets/chargrobot/robotMarkInfo',
       method: 'get',
    })
}

// 机器人软件版本号列表
export function getRobotSoftList() {
    return request({
       url: '/app/assets/chargrobot/robotVersionNumInfo',
        method: 'get',
    })
}

// 机器人列表
export function getRobotList(data) {
    return request({
       url: '/app/assets/chargrobot/robotNameInfo',
        method: 'get',
        params: data
    })
}

// 机器人历史告警
export function getRobotHistoryAlarm(data) {
    return request({
        url: '/app/alarm/robot-hisrecord/getRobotHisrecord',
        method: 'get',
        params: data
    })
}

// 导出机器人历史告警
export function exportHistoryAlarm(data) {
    return request({
        url: '/app/alarm/robot-hisrecord/exprotRobotHisrecord',
        method: 'get',
        responseType: 'blob',
        params: data
    })
}



// 机器人派单详情
export function getOrderPoleInfo(data) {
    return request({
        url: '/app/alarm/robot-rtrecord/sendOrdersRobot',
        method: 'get',
        params: data
    })
}

// 机器人派单确认
export function submitOrderPole(data) {
    return request({
        url: '/app/alarm/robot-rtrecord/sendOrdersRobotClick',
        method: 'post',
        data
    })
}

// 机器人历史报文
export function getHistoryMsg(data) {
    return request({
        url: '/app/alarm/robot-history-message/getRobotHistoryMessage',
        method: 'get',
        params: data
    })
}


// 导出机器人历史报文
export function exportHistoryMsg(data) {
    return request({
        url: '/app/alarm/robot-history-message/exprot',
        method: 'get',
        timeout: 120 * 1000,
        responseType: 'blob',
        params: data
    })
}

// 充电机器人复位
export function robotReset(data) {
    return request({
        url: '/app/remotectrl/resetOperation',
        method: 'post',
        data
    })
}

// 充电机器人告警清除
export function clearRobotAlarm(data) {
    return request({
        url: '/app/alarm/robot-rtrecord/doClearAway',
        method: 'put',
        data
    })
}

// 新增机器人告警知识库
export function addRobotBase(data) {
    return request({
        url: '/app/alarm/knowledge-config/saveKnowledgeConfig',
        method: 'post',
        data
    })
}

// 修改机器人告警知识库
export function editRobotBase(data) {
    return request({
        url: '/app/alarm/knowledge-config/updateKnowledgeConfigById',
        method: 'put',
        data
    })
}

