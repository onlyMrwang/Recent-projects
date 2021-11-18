import request from '@/utils/request'

// 电池数据跟踪分析
export function queryBmsCodeListData(pageNo, pageSize, query) {
    return request({
       url: `/bms/battery/queryBmsCodeListData/${pageNo}/${pageSize}`,
        method: 'post',
        data: query
    })
}

// 获取充电网点名称列表
export function getChargGroupCode() {
    return request({
       url: '/bms/battery/getSiteList',
        method: 'get'
    })
}

// 获取充电设备列表根据网点编码
export function getChargCode(query) {
    return request({
       url: '/bms/battery/getEquipmenList',
        method: 'get',
        params: query
    })
}

// 第一次钻取
export function queryFirstLevelData(query) {
    return request({
       url: '/bms/battery/normal/queryFirstLevelData',
        method: 'post',
        data: query
    })
}

// 第二次钻取
export function querySecondLevelData(pageNo, pageSize, query) {
    return request({
       url: `/bms/battery/normal/querySecondLevelData/${pageNo}/${pageSize}`,
        method: 'post',
        data: query
    })
}

// 第三级钻取（查看充电过程）
export function queryThirdLevelData(pageNo, pageSize, query) {
    return request({
       url: `/bms/battery/normal/queryThirdLevelData/${pageNo}/${pageSize}`,
        method: 'post',
        data: query
    })
}
