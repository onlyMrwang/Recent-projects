const state = {
  isCollapse: false, // 侧边菜单栏是否关闭
  isHiddenHeader: false, // 是否隐藏顶部菜单
}

const actions = {
 
}

const mutations = {
  changeIsCollapse(state, payload) {
    state.isCollapse = payload
  },
  changeIsHiddenHeader(state, payload) {
    state.isHiddenHeader = payload
  },
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}

