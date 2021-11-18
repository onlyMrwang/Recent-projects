import request from '@/utils/request';

// 机构网点资费配置列表
export function getNetworkList(data) {
    return request({
      url: '/app/finance/site/config/siteOrgRelList',
      method: 'get',
      params: data
    })
}
  
// 网点资费配置列表
export function getNetFeeList(data) {
    return request({
      url: '/app/finance/site/config/siteFeeList',
      method: 'get',
      params: data
    })
}

// 新增网点资费配置
export function addSiteFee(data) {
  return request({
    url: '/app/finance/site/config/addSiteFee',
    method: 'post',
    data
  })
}

// 获取当前组织机构下的网点列表
export function getCurOrgList(data) {
  return request({
    url: '/app/financeCommon/netPoints',
    method: 'get',
    params: data
  })
}

// 删除网点资费配置
export function delSiteFeeSetting(id) {
  return request({
    url: '/app/finance/site/config/delSiteFee',
    method: 'get',
    params: { yearId: id }
  })
}

// 获取月份资费配置详情
export function getMonthSeetingDetail(id) {
  return request({
    url: '/app/finance/site/config/monthSiteFeeInfo',
    method: 'get',
    params: { yearId: id}
  })
}

// 新增具体年日资费配置
export function addMonthSiteFee(data) {
  return request({
    url: '/app/finance/site/config/addMonthSiteFee',
    method: 'post',
    data
  })
}

// 资费配置拷贝
export function siteFeeCopy(data) {
  return request({
    url: '/app/finance/site/config/siteFeeCopy',
    method: 'post',
    data
  })
}

// 配置网点机构关联数据
export function addSiteOrgRel(data) {
  return request({
    url: '/app/finance/site/config/addSiteOrgRel?orgId=' + data.id,
    method: 'post',
    data:data.info
  })
}

// 未配置-已配置网点机构下拉列表
export function getOrgSiteList(data) {
  return request({
    url: '/app/finance/site/config/siteList',
    method: 'get',
    params: data
  })
}

// 批量修改机构资费系数
export function batchUpdateFeeRate(data) {
  return request({
    url: '/app/finance/site/config/batchUpdateFeeRate',
    method: 'post',
    data
  })
}

// 删除机构网点资费系数
export function delOrgSiteFee(id) {
  return request({
    url: '/app/finance/site/config/delSiteFeeRel',
    method: 'get',
    params: { cIds: id }
  })
}

// 组织机构树(资费未配置, 已配置)
export function getSettingOrgTree() {
  return request({
    url: '/app/financeCommon/subDeptTree',
    method: 'get',
  })
}