import request from '@/utils/request'

// 电池健康度评估
export function queryReportBmsCodeListData(pageNo, pageSize, query) {
    return request({
       url: `/bms/battery/queryReportBmsCodeListData/${pageNo}/${pageSize}`,
        method: 'post',
        data: query
    })
}

// 电池健康度评估查看报告
export function queryBatteryDataReport(query) {
    return request({
       url: '/bms/battery/queryBatteryDataReport',
        method: 'post',
        data: query
    })
}
