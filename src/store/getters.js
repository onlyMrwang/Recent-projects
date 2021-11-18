/*
 * @Description: 
 * @Autor: mengtao wang
 * @Date: 2021-09-06 20:32:41
 * @LastEditTime: 2021-09-12 14:17:13
 */
const getters = {
    firstMenuList: state => state.settings.firstMenuList, // 实际展示的一级菜单
    routersList: state => state.settings.routersList,
    restMenuList: state => state.settings.restMenuList,
    topMenuIndex: state => state.settings.topMenuIndex,
    siderMenuIndex: state => state.settings.siderMenuIndex,
    siderParentIndex: state => state.settings.siderParentIndex,
    topMenuList: state => state.settings.topMenuList, // 所有的一级菜单
    showMenuSetting: state => state.settings.showMenuSetting, // 是否展示菜单设置  
    isCollapse: state => state.common.isCollapse, // 侧边栏是否收缩
    dictInfo: state => state.dict.dictInfo.chargEquipType.length > 0 ? state.dict.dictInfo : JSON.parse(sessionStorage.getItem("vuex")).dict.dictInfo, // 字典数据
    isHiddenHeader: state => state.common.isHiddenHeader, // 是否隐藏顶部菜单
    deptList: state => state.user.deptList, // 当前组织机构以及下属组织机构
    userInfo: state => state.user.userInfo,
    roles: state => state.user.roles,
    permissions: state => state.user.permissions,
    accSettingTab: state => state.account.accSettingTab, // 账户配置 人车卡 tab
    accRechargeTab: state => state.account.accRechargeTab, // 充值交易 人车卡 tab
    poleType: state => state.monitoring.poleType, // 查询网点对象
    carPleType: state => state.monitoring.carPleType, // 查询车辆对象
}

export default getters