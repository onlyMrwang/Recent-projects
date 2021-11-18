import request from '@/utils/request';

// 查询网点
export function getchargGrou(params) {
  return request({
    url: `/app/assets/dept/chargGroup`,
    method: 'get',
    params
  })
}

// 查询卡号
export function getCardCode(params) {
  return request({
    url: `/app/assets/card/detailinfo`,
    method: 'get',
    params
  })
}

// 查询车牌号
export function getCarinfo(params) {
  return request({
    url: `/app/assets/carinfo/CarStaReport`,
    method: 'get',
    params
  })
}

// 根据组织机构查询车牌号
export function getCarNumberByOrg(params) {
  return request({
    url: `/app/assets/dept/car`,
    method: 'get',
    params
  })
}