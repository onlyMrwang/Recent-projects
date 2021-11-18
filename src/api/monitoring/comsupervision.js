import request from '@/utils/request'// 监控中心

//通过ID获取树详情
export function getTreeList(query) {
    return request({
        url: '/app/monitor/website/tree/website',
        method: 'get',
        params: query,
        showLoading: false
    })
}

//获取桩状态
export function getPileDetails(query) {
    return request({
        url: '/app/monitor/website/gun/infos',
        method: 'get',
        params: query
    })
}

//获取实时告警
export function getalarmtrend(query) {
    return request({
        url: '/app/monitor/website/device/gun/alarmtrend1h',
        method: 'get',
        params: query
    })
}

// 获取全景数据
export function getRealcharge(query) {
    return request({
        url: '/app/monitor/website/device/gun/realcharge',
        method: 'get',
        params: query
    })
}

//获取在线情况
export function getOnlineduration1h(query) {
    return request({
        url: '/app/monitor/website/device/gun/onlineduration1h',
        method: 'get',
        params: query
    })
}

// 获取过程数据
export function getChargeprocess(query) {
    return request({
        url: '/app/monitor/website/device/gun/chargeprocess',
        method: 'get',
        params: query
    })
}

// 过程数据导出
export function chargeProcessInfoExport(query) {
    return request({
        url: '/app/monitor/website/device/gun/chargeProcessInfoExport',
        method: 'get',
        params: query,
        responseType: 'blob'
    })
}

//获取历史告警
export function getHisalarm1h(query) {
    return request({
        url: '/app/monitor/website/device/gun/hisalarm1h',
        method: 'get',
        params: query
    })
}

//获取枪上机器人详情
export function getRobot(query) {
    return request({
        url: '/app/monitor/website/device/robot',
        method: 'get',
        params: query
    })
}

//获取枪上机器人详情
export function getProfileInfo(query) {
    return request({
        url: '/app/monitor/website/profileInfo',
        method: 'get',
        params: query
    })
}

//获取驻点地图
export function getWebsiteList(query) {
    return request({
        url: '/app/monitor/org/map/websiteList',
        method: 'get',
        params: query
    })
}


//获取桩详情三个统计图
export function getAlertAnalyze(query,url) {
    return request({
        url: '/app/'+url,
        method: 'get',
        params: query
    })
}

// 获取充电设备过程数据趋势分析折线图
export function getChargeProcessLineData(data) {
    return request({
        url: '/app/monitor/website/device/gun/processStat',
        method: 'get',
        params: data
    })
}

// 获取网点下的充电桩
export function getDetails(data) {
    return request({
        url: '/app/monitor/website/gun/details',
        method: 'get',
        params: data
    })
}

//查询数据库字典表
export function  getTypes(data){
    return request({
        url: '/app/assets/sys/datainfo',
        method: 'get',
        params: data
    })
}
//.......................车辆AJAX调用...........................//
//通过ID获取树详情
export function getCarTreeList(query) {
    return request({
        url: '/app/monitor/car/tree',
        method: 'get',
        params: query,
        showLoading: false
    })
}

// 车辆根据车辆类型取不同的车辆数据
export function getCarAlarms(query,url) {
    return request({
        url:'/app/'+ url,
        // url: '/app/monitor/car/alarms',
        method: 'get',
        params: query,
        showLoading: false
    })
}

// 车辆详情7天充电统计分析接口
export function getCarChargingstat(query) {
    return request({
        url: '/app/monitor/car/chargingstat',
        method: 'get',
        params: query,
        showLoading: false
    })
}

// 地图车辆详情接口
export function getCarInfo(query) {
    return request({
        url: '/app/monitor/car/vevcar/info',
        method: 'get',
        params: query,
        showLoading: false
    })
}

// 车辆详情调度信息接口
export function getCarSchedulingStat(query) {
    return request({
        url: '/app/monitor/car/schedulingStat',
        method: 'get',
        params: query,
        showLoading: false
    })
}

// 车辆详情行驶数据接口
export function getCarRundata(query) {
    return request({
        url: '/app/monitor/car/rundata',
        method: 'get',
        params: query,
        showLoading: false
    })
}

// 车辆详情过程趋势图
export function getCarProcessTrend(query) {
    return request({
        url: '/app/monitor/car/processTrend',
        method: 'get',
        params: query,
        showLoading: false
    })
}

// 根据车辆id获取监控视频
export function getCarVideo(query) {
    return request({
        url: '/app/monitor/video/play',
        method: 'get',
        params: query,
        showLoading: false
    })
}
// 获取企业下所有机构树
export function getStyleJson() {
    return request({
        url: '../../../public/offlinemap/customstyle/mapstyle',
        method: 'get',
    })
}
