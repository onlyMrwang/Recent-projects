const state = {
    accSettingTab: 'car',
    accRechargeTab: 'car'
}

const mutations = {
    changeAccSettingTab(state, payload) {
        state.accSettingTab = payload
    },
    changeAccRechargeTab(state, payload) {
        state.accRechargeTab = payload
    },
}

const actions = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}