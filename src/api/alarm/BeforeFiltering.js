//告警前转策略
import request from '@/utils/request'

//获取列表
export function getList(query) {
    return request({
        url: '/app/alarm/pole-forward-config/getPoleForwardConfig',
        method: 'get',
        params: query
    })
}


// 新增实时告警列表
export function addList(query) {
    return request({
        // url: '/app/alarm/knowledge-config/saveKnowledgeConfig',
        url: '/app/alarm/pole-forward-config/savePoleForwardConfig',
        method: 'post',
        data: query
    })
}

// 修改实时告警列表
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
        url: '/app/alarm/pole-forward-config/doStartPoleForwardConfig',
        method: 'put',
        data: query
    })
}

// 停用告警知识库
export function stopWledgeConfig(query) {
    return request({
        url: '/app/alarm/pole-forward-config/doStopPoleForwardConfig',
        method: 'put',
        data: query
    })
}


// 删除告警知识库
export function clertList(query) {
    return request({
        url: '/app/alarm/pole-forward-config/deletePoleForwardConfig',
        method: 'post',
        data: query
    })
}

