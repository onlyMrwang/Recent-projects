import { getRoutersList } from '../../api/common'

const state = {
  routersList: [], // 全部菜单
  firstMenuList: [], // 展示顶部一级菜单
  restMenuList: [], // 侧边菜单
  topMenuList: [], // 所有的一级菜单
  topMenuIndex: "/index", // 顶部菜单选中索引
  siderMenuIndex: null, // 侧边菜单选中索引
  siderParentIndex: null, // 侧边多级菜单父级选中索引
  showMenuSetting: false, // 关闭时
}

const actions = {
  async fetchRouter({ commit, rootState }) {
    const rsp = await getRoutersList()
    console.log(rsp);
    const arr = []
    const topArr = []
    const allRouter = []
    if (rsp.data?.length > 0) {
      rsp.data.forEach((item, index) => {
        if ((item.kind === '5' || item.kind === '4') && !item.hidden) {
          arr.push({
            id: `${item.name}${index}`,
            name: item.meta.title,
            path: item.path || item.component,
            icon: item.meta.icon,
            kind: item.kind
          })
          topArr.push({
            id: `${item.name}${index}`,
            name: item.meta.title,
            path: item.path || item.component,
            icon: item.meta.icon,
            kind: item.kind
          })
        }
        if (!item.hidden) {
          allRouter.push(item)
        }
      })
      // arr[0].isChecked = true
      const restArr = rsp.data[0].children
      let defaultMenuArr = []
      let defaultRestArr = []

      // 根据用户id获取存储的顶部菜单
      if (rootState.user && rootState.user.userInfo) {
        if (localStorage.getItem(rootState.user.userInfo.id)) {
          defaultMenuArr = JSON.parse(localStorage.getItem(rootState.user.userInfo.id))
        }
      }

      // 根据存储的顶部菜单获取第一个菜单的子菜单(即侧边菜单栏)
      if (defaultMenuArr.length > 0) {
        let arr = allRouter.filter(item => item.path === defaultMenuArr[0].path)
        if (arr.length > 0 && arr[0].children !== undefined) {
          defaultRestArr = arr[0].children
        }
      }
      // 有默认菜单显示默认菜单，没有显示前四个菜单
      commit('changeFirstMenu', defaultMenuArr.length > 0 ? defaultMenuArr : arr.slice(0, 4))
      commit('changeRouters', allRouter)
      // 接口返回一级菜单
      commit('changeTopMenu', topArr)
    }
    return rsp
  }
}

const mutations = {
  changeFirstMenu(state, payload) {
    state.firstMenuList = payload
  },
  changeRouters(state, payload) {
    state.routersList = payload
  },
  changeRestMenu(state, payload) {
    state.restMenuList = payload
  },
  changeTopMenu(state, payload) {
    state.topMenuList = payload
  },
  changeTopMenuIndex(state, payload) {
    state.topMenuIndex = payload
  },
  changeSiderMenuIndex(state, payload) {
    state.siderMenuIndex = payload
  },
  changeShowMenuSetting(state, payload) {
    state.showMenuSetting = payload
  },
  changeSiderParentIndex(state, payload) {
    state.siderParentIndex = payload
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}

