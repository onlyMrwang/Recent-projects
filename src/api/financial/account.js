import request from '@/utils/request';

// 查询当前机构账户信息
export function getCurrentOrgAccountInfo(data) {
    return request({
      url: '/app/finance/account/manager/queryAccountInfo',
      method: 'get',
      params: data
    })
}

// 查询账户人员
export function getAccountPersons(data) {
    return request({
      url: '/app/finance/account/manager/queryAccountByPersons',
      method: 'get',
      params: data
    })
}

// 查询账户车辆
export function getAccountCars(data) {
    return request({
      url: '/app/finance/account/manager/queryAccountByCars',
      method: 'get',
      params: data
    })
}

// 查询账户实体卡
export function getAccountCards(data) {
    return request({
      url: '/app/finance/account/manager/queryAccountByCards',
      method: 'get',
      params: data
    })
}

// 查询账户私人
export function getAccountPrivate(data) {
    return request({
      url: '/app/finance/account/manager/queryAccountByPrivate',
      method: 'get',
      params: data
    })
}

// 创建账户
export function addAccount(data) {
    return request({
      url: '/app/finance/account/manager/addAccount',
      method: 'post',
      data
    })
}  

// 编辑账户
export function editAccount(data) {
    return request({
      url: '/app/finance/account/manager/editAccount',
      method: 'post',
      data
    })
}  

// 查询账户卡
export function getAccCardList(data) {
    return request({
      url: '/app/finance/account/manager/queryAccountByCards',
      method: 'get',
      params: data
    })
}

// 查询账户人
export function getAccPersonList(data) {
    return request({
      url: '/app/finance/account/manager/queryAccountByPersons',
      method: 'get',
      params: data
    })
}

// 查询账户车
export function getAccCarList(data) {
    return request({
      url: '/app/finance/account/manager/queryAccountByCars',
      method: 'get',
      params: data
    })
}

// 未开卡的车列表(添加车辆)
export function getNoOpenCarList(id) {
    return request({
      url: '/app/financeCommon/cars',
      method: 'get',
      params: { orgId: id }
    })
}

// 未开卡的车列表(添加实体卡)
export function getNoOpenCarOfCard(id) {
  return request({
    url: '/app/financeCommon/cards/cars',
    method: 'get',
    params: {orgId: id}
  })
}

// 账户新增车
export function addCars(data) {
    return request({
      url: '/app/finance/account/manager/addCar',
      method: 'post',
      data
    })
}

// 账户新增卡
export function addCards(data) {
    return request({
      url: '/app/finance/account/manager/addCard',
      method: 'post',
      data
    })
}

// 账户新增人
export function addPersons(data) {
    return request({
      url: '/app/finance/account/manager/addPerson',
      method: 'post',
      data
    })
}

// 账户新增私人对象
export function addPrivate(data) {
  return request({
    url: '/app/finance/account/manager/addPrivate',
    method: 'post',
    data
  })
}

//删除充电对象(人-车-卡)
export function delAccountObj(id) {
    return request({
      url: '/app/finance/account/manager/delAccountObj',
      method: 'get',
      params: {cardId: id}
    })
}

// 新增账户人-私人对象--当前用户权限下的未开卡的职工
export function getStaffs(data) {
  return request({
    url: '/app/financeCommon/cards/staffs',
    method: 'get',
    params: data
  })
}

// 新增账户人-私人对象--当前用户权限下的未开卡的职工 (企业下)
export function getStaffsAll(data) {
  return request({
    url: '/app/financeCommon/cards/staffsAll',
    method: 'get',
    params: data
  })
}

// 新增账户人-司机对象--当前用户权限下的未开卡的职工
export function getStaffsPerson(data) {
  return request({
    url: '/app/financeCommon/staffs',
    method: 'get',
    params: data
  })
}

// 查询账户列表,当前机构及其下属机构所所有账户
export function getAccountList(data) {
  return request({
    url: '/app/finance/account/manager/accountList',
    method: 'get',
    params: data
  })
}

// 账户停启用
export function updateAccountState(data) {
  return request({
    url: '/app/finance/account/manager/updateAccountState',
    method: 'post',
    data
  })
}

// 充值金额
export function reChargeMoney(data) {
  return request({
    url: '/app/finance/recharge/manager/batchRecharge',
    method: 'post',
    data
  })
}

// 获取充值记录列表
export function getRechargeList(data) {
  return request({
    url: '/app/finance/recharge/manager/rechargeList',
    method: 'get',
    params: data
  })
}

// 充值撤销
export function toCancelRecharge(data) {
  return request({
    url: '/app/finance/recharge/manager/revokeRecharge',
    method: 'post',
    params: data
  })
}

// 检验卡段
export function checkCards(data) {
  return request({
    url: '/app/finance/account/manager/checkCards',
    method: 'get',
    params: data
  })
}

// 挂失，解挂实体卡
export function updateCardState(data) {
  return request({
    url: '/app/finance/account/manager/batchUpdateCardState',
    method: 'post',
    data
  })
}

// 补卡/换卡
export function replaceCard(data) {
  return request({
    url: '/app/finance/account/manager/batchReplaceCard',
    method: 'post',
    params: data
  })
}

// 退卡
export function retreatCard(data) {
  return request({
    url: '/app/finance/account/manager/batchCheckOutCard',
    method: 'post',
    data
  })
}

// 修改卡密码
export function updateCardPassword(data) {
  return request({
    url: '/app/finance/account/manager/batchUpdateCardPassword',
    method: 'post',
    data
  })
}


// 企业卡列表
export function getCardList() {
  return request({
    url: '/app/financeCommon/cardList',
    method: 'get',
  })
}