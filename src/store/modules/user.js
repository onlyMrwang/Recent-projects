import { getInfo, logout } from '../../api/common'

const state = {
    userInfo: null,
    roles: null,
    permissions: [],
    deptList: [] // 用户当前组织机构以及下属组织机构tree
}
const actions = {
    async getUserInfo({commit}) {
        const rsp = await getInfo()
        if (rsp.roles && rsp.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('changeRoles', rsp.roles)
            commit('changePermissions', rsp.permissions)
          } else {
            commit('changeRoles', ['ROLE_DEFAULT'])
          }
        if(rsp?.code === 200) {
            commit('changeUserInfo', rsp.user)
            if(rsp.user.dept) {
               commit('changeDeptList', [rsp.user.dept])  
            }
        }
        return rsp
    },
    async logout() {
        const rsp = await logout()
        if(rsp) {
            localStorage.removeItem('token')
            sessionStorage.clear();
        }
        return rsp
    }
}

const mutations = {
    changeUserInfo(state, payload) {
        state.userInfo = payload
    },
    changeRoles(state, payload) {
        state.roles = payload
    },
    changePermissions(state, payload) {
        state.permissions = payload
    },
    changeDeptList(state, payload) {
        state.deptList = payload
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}