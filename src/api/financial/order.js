import request from '@/utils/request';

// 充电订单状态列表
export function getOrderStatusList(data) {
    return request({
      url: '/app/finance/order/manager/orderList',
      method: 'get',
      params: data
    })
}

// 充值订单列表
export function getRechargeOrderList(data) {
    return request({
      url: '/app/finance/recharge/manager/rechargeList',
      method: 'get',
      params: data
    })
}

// 充电订单列表
export function getEleOrderList(data) {
    return request({
      url: '/app/finance/order/manager/chargingOrderRecordList',
      method: 'get',
      params: data
    })
}

// 订单查询--当前用户权限下的设备列表
export function getSelectDeviceList(id) {
    return request({
      url: '/app/financeCommon/devices',
      method: 'get',
      params: { orgId: id }
    })
}

// 订单查询--根据设备code获取枪号列表
export function getSelectGunList(code) {
    return request({
      url: '/app/financeCommon/guns',
      method: 'get',
      params: {deviceCode: code}
    })
}

// 充电记录补录列表
export function getRecordSupplementList(data) {
  return request({
    url: '/app/finance/order/manager/chargingRecordSupplementList',
    method: 'get',
    params: data
  })
}

// 异常订单查询
export function getErrorOrderList(data) {
  return request({
    url: '/app/finance/order/manager/errorOrderList',
    method: 'get',
    params: data
  })
}

// 异常订单导出
export function errorOrderDownload(data) {
  return request({
    url: '/app/finance/order/manager/errorOrderExport',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 订单详情
export function getErrorOrderInfo(id) {
  return request({
    url: '/app/finance/order/manager/errorOrderInfo',
    method: 'get',
    params: {id}
  })
}

// 编辑异常订单
export function editErrorOrder(data) {
  return request({
    url: '/app/finance/order/manager/editErrorOrder',
    method: 'post',
    data
  })
}

// 充电记录导出
export function getChargingExcel(data) {
  return request({
    url: '/app/finance/order/manager/chargingOrderRecordExport',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 订单结算
export function orderSettle(data) {
  return request({
    url: '/app/finance/order/manager/orderSettle',
    method: 'post',
    params: data
  })
}

// 订单结算(新，单个或者批量)
export function mulitOrderSettle(data) {
  return request({
    url: '/app/finance/order/manager/handleBatchSettle',
    method: 'post',
    data
  })
}


// 充电记录补录模板下载
export function templateDownload(data) {
  return request({
    url: '/app/financeCommon/templateDownload',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 充电记录补录导入列表
export function chargingRecordImportList(data) {
  return request({
    url: '/app/finance/order/manager/chargingRecordSupplementImportList',
    method: 'post',
    data
  })
}

// 充电记录补录导入提交
export function submitRecordImportList(data) {
  return request({
    url: '/app/finance/order/manager/chargingRecordSupplementImport',
    method: 'post',
    data
  })
}

// 充电记录补录导入提交V2
export function submitRecordImportList2(data) {
  return request({
    url: '/app/finance/order/manager/chargingRecordSupplementImport2',
    method: 'post',
    data
  })
}
