const state = {
    poleType:{
        terminalType:['0','1'],//终端类型
        terminalOnlineType:['1','0'],//终端在线类型
        statisticalType:['1','2'],//统计显示
    },
    carPleType:{
        carType1:['1','2','3'],//车辆类型
        carStatus:['1','0'],//车辆在线状态
        carEnergyType:['1','2'],//能源类型
        carRadio:"1",//单选框选中的值
        carStatistical:["1","2","3"],//车辆显示统计
        carType1:[],//一级数组
        carType2:[],//二级数组
        carIndex:[],
        carTypeObj:{0:[],1:[],2:[]},
        usebroaHead:[],//缓存一级数组
    }
}

const mutations = {
    changePoleType(state, payload) {
        state.poleType = payload
    },
    changeCarPleType(state, payload){
        state.carPleType = payload
    }
}

const actions = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}