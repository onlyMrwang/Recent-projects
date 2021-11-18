import request from '@/utils/request'
// 获取充电卡表单数据
export function chargeCard(query) {
    return request({
      url: '/app/assets/card/detailinfo',
      method: 'get',
      params: query
    })
}
// 充电卡入库
export function addChargeCard(data) {
  return request({
    url: '/app/assets/card/detailinfo',
    method: 'post',
    data: data
  })
}