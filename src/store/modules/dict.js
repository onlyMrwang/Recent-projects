import { getDictInfo } from '@/api/common'
import { arrToObj } from '@/utils/utils'

const state = {
  dictInfo: {
    chargEquipType: [], // 充电设备类型
    facturerType: [], // 厂商类型
    chargManu: [], // 充电设备厂家
    chargGroupNature: [], // 充电网点属性
    paymentMeth: [], // 支付方式
    cardStatus: [], // 卡状态
    carType: [], // 能源类型
    cardPurpose: [], // 卡用途
    usebroaHead: [], // 车辆类型
    usesubcHead: [], // 车辆用途
    equiModel: [], // 充电设备型号
    installMeth: [], // 安装方式
    coopPartner: [], // 合作伙伴
    operFlow: [], // 充电业务流程类型
    idenAuthen: [], // 身份认证方式
    serviceTypeOne: [], // 接口服务类型1
    serviceStandOne: [], //接口标准1
    protocolOne: [], // 接口通讯协议版本1
    chargInterNum: [], // 充电口数量
    serviceTypeTwo: [], // 接口服务类型2
    serviceStandTwo: [], // 接口标准2
    protocolTwo: [], // 接口通讯协议版本2
    openRange: [], // 开放范围
    robotMark: [], // 机器人类型
    eleModel: [], // 电机型号(旧, 不用)
    elecFacturerModel: [], // 电机型号(新)
    carPurp: [], // 车辆用途
    mapList: [],//驻地地图
    alarmType: [], // 告警类型(桩)
    robotAlarmType: [], // 机器人告警类型
    protType: [], // 通讯协议版本
    orderStatus: [], // 订单状态
    errorMessage: [], // 错误信息
    preAlarmList: [], // 预警类型
    commandCode34: [], // 3.4
    commandCode34a1: [], // 3.4a1
    commandCode34a: [], // 3.4a
    commandCodeRobot: [], // 机器人报文命令码
    msgCode: [], // 相关故障代码
    ratedPow: [], // 功率列表
    commProtocol: [], // 通讯协议
    accessCommProtocol: [],//平台通信协议
    cameraLocation: [], // 车载摄像头位置
    carAlarmType: [],//车辆警告类型
    alarmRobotType: [], // 机器人告警设备类型
    accessPlatform: [],//接入平台
    carStatusMon: [],//车辆状态
    chargingStatus: [],//充电状态
    mapObj: {},//地图Obj
    chargEquipTypeObj: {}, // 充电设备类型obj
    facturerTypeObj: {}, // 厂商类型Obj
    chargManuObj: {}, // 充电设备厂家Obj
    chargGroupNatureObj: {}, // 充电网点属性Obj
    paymentMethObj: {}, // 支付方式Obj
    cardStatusObj: {}, // 卡状态Obj
    carTypeObj: {}, // 能源类型Obj
    cardPurposeObj: {}, // 卡用途Obj
    usebroaHeadObj: {}, // 车辆类型Obj
    usesubcHeadObj: {}, // 车辆用途Obj
    equiModelObj: {}, // 充电设备型号Obj
    installMethObj: {}, // 安装方式Obj
    coopPartnerObj: {}, // 合作伙伴Obj
    operFlowObj: {}, // 充电业务流程类型Obj
    idenAuthenObj: {}, // 身份认证方式Obj
    serviceTypeOneObj: {}, // 接口服务类型1 Obj
    serviceStandOneObj: {}, //接口标准1 Obj
    protocolOneObj: {}, // 接口通讯协议版本1 Obj
    chargInterNumObj: {}, // 充电口数量Obj
    serviceTypeTwoObj: {}, // 接口服务类型2 Obj
    serviceStandTwoObj: {}, // 接口标准2 Obj
    protocolTwoObj: {}, // 接口通讯协议版本2 Obj
    openRangeObj: {}, // 开放范围 obj
    robotMarkObj: {}, // 机器人类型Obj
    eleModelObj: {}, // 电机型号Obj
    elecFacturerModelObj: {}, // 电机型号Obj(新)
    carPurpObj: {}, // 车辆用途Obj
    alarmTypeObj: {}, // 告警类型
    robotAlarmTypeObj: {}, // 机器人告警类型
    protTypeObj: {}, // 通讯协议版本
    orderStatusObj: {}, // 订单状态 Obj
    errorMessageObj: {}, // 错误信息 Obj
    preAlarmListObj: {}, // 预警类型 Obj
    commandCode34Obj: {}, // 3.4
    commandCode34a1Obj: {}, // 3.4a1
    commandCode34aObj: {}, // 3.4a
    commandCodeRobotObj: {}, // 机器人报文命令码
    msgCodeObj: {}, // 相关故障代码
    ratedPowObj: {},  // 功率
    commProtocolObj: {}, // 通讯协议
    accessCommProtocolObj: {},//平台通信协议
    cameraLocationObj: {}, // 车载摄像头位置Obj
    carAlarmTypeObj: {},//车辆警告类型Obj
    alarmRobotTypeObj: {}, // 机器人告警设备类型Obj
    accessPlatformObj: {},//接入平台
    carStatusMonObj: {},//车辆状态Obj
    chargingStatusObj: {},//充电状态Obj
  }
}

const actions = {
  async fetchDictInfo({ commit }) {
    const rsp = await getDictInfo()
    if (rsp.code === 200) {
      const dict = rsp.data.result
      const filterDict = key => {
        return dict.filter(item => item.key === key)
      }
      if (dict.length > 0) {
        const data = {
          // map
          chargEquipType: filterDict('charg_equip_type'),
          facturerType: filterDict('facturer_type'),
          chargManu: filterDict('charg_manu'),
          chargGroupNature: filterDict('charg_group_nature'),
          paymentMeth: filterDict('payment_meth'),
          cardStatus: filterDict('card_status'),
          carType: filterDict('car_type'),
          cardPurpose: filterDict('card_purpose'),
          usebroaHead: filterDict('user_broa_head'),
          usesubcHead: filterDict('user_subc_head'),
          equiModel: filterDict('equi_model'),
          installMeth: filterDict('install_meth'),
          coopPartner: filterDict('coop_partner'),
          operFlow: filterDict('oper_flow'),
          idenAuthen: filterDict('iden_authen'),
          serviceTypeOne: filterDict('service_type_one'),
          serviceStandOne: filterDict('service_stand_one'),
          protocolOne: filterDict('protocol_one'),
          charg_inter_num: filterDict('charg_inter_num'),
          serviceTypeTwo: filterDict('service_type_two'),
          serviceStandTwo: filterDict('service_stand_two'),
          protocolTwo: filterDict('protocol_two'),
          openRange: filterDict('open_range'),
          robotMark: filterDict('robot_mark'),
          eleModel: filterDict('model'),
          elecFacturerModel: filterDict('elec_facturer_model'),
          carPurp: filterDict('car_purp'),
          mapList: filterDict('map'),
          alarmType: filterDict('alarm_type'),
          robotAlarmType: filterDict('robot_alarm_type'),
          protType: filterDict('prot_version'),
          orderStatus: filterDict('order_status'),
          errorMessage: filterDict('error_message'),
          preAlarmList: filterDict('object_no'),
          commandCode34: filterDict('command_code_3.4'), // 3.4
          commandCode34a1: filterDict('command_code_3.4a1'), // 3.4a1
          commandCode34a: filterDict('command_code_3.4a'), // 3.4a  
          commandCodeRobot: filterDict('command_code_robot'), // 机器人报文命令码
          msgCode: filterDict('msg_code'), // 相关故障代码
          ratedPow: filterDict('rated_pow'), // 功率
          commProtocol: filterDict('comm_protocol'), // 通讯协议
          accessCommProtocol: filterDict('access_comm_protocol'), // 平台通讯协议
          cameraLocation: filterDict('camera_location'), // 车载摄像头
          carAlarmType: filterDict('car_alarm_type'),//车辆警告类型
          alarmRobotType: filterDict('alarm_robot_type'), // 机器人告警设备类型
          accessPlatform: filterDict('access_platform'),//接入平台
          carStatusMon: filterDict('car_status_mon'),//车辆状态
          chargingStatus: filterDict('charging_status'),//充电状态
          chargEquipTypeObj: arrToObj(filterDict('charg_equip_type')), // 充电设备类型obj
          facturerTypeObj: arrToObj(filterDict('facturer_type')), // 厂商类型Obj
          chargManuObj: arrToObj(filterDict('charg_manu')), // 充电设备厂家Obj
          chargGroupNatureObj: arrToObj(filterDict('charg_group_nature')), // 充电网点属性Obj
          paymentMethObj: arrToObj(filterDict('payment_meth')), // 支付方式Obj
          cardStatusObj: arrToObj(filterDict('card_status')), // 卡状态Obj
          carTypeObj: arrToObj(filterDict('car_type')), // 车辆类型Obj
          cardPurposeObj: arrToObj(filterDict('card_purpose')), // 卡用途Obj
          usebroaHeadObj: arrToObj(filterDict('user_broa_head')), // 使用大类Obj
          usesubcHeadObj: arrToObj(filterDict('user_subc_head')), // 使用小类Obj
          equiModelObj: arrToObj(filterDict('equi_model')), // 充电设备型号Obj
          installMethObj: arrToObj(filterDict('install_meth')), // 安装方式Obj
          coopPartnerObj: arrToObj(filterDict('coop_partner')), // 合作伙伴Obj
          operFlowObj: arrToObj(filterDict('oper_flow')), // 充电业务流程类型Obj
          idenAuthenObj: arrToObj(filterDict('iden_authen')), // 身份认证方式Obj
          serviceTypeOneObj: arrToObj(filterDict('service_type_one')), // 接口服务类型1 Obj
          serviceStandOneObj: arrToObj(filterDict('service_stand_one')), //接口标准1 Obj
          protocolOneObj: arrToObj(filterDict('protocol_one')), // 接口通讯协议版本1 Obj
          chargInterNumObj: arrToObj(filterDict('charg_inter_num')), // 充电口数量Obj
          serviceTypeTwoObj: arrToObj(filterDict('service_type_two')), // 接口服务类型2 Obj
          serviceStandTwoObj: arrToObj(filterDict('service_stand_two')), // 接口标准2 Obj
          protocolTwoObj: arrToObj(filterDict('protocol_two')), // 接口通讯协议版本2 Obj
          openRangeObj: arrToObj(filterDict('open_range')), // 开放范围 bj
          robotMarkObj: arrToObj(filterDict('robot_mark')), // 机器人类型Obj
          eleModelObj: arrToObj(filterDict('model')), // 电机型号Obj(旧)
          elecFacturerModelObj: arrToObj(filterDict('elec_facturer_model')), // 电机型号Obj(新)
          carPurpObj: arrToObj(filterDict('car_purp')), // 车辆用途Obj
          mapObj: arrToObj(filterDict('map')), // 地图Obj
          alarmTypeObj: arrToObj(filterDict('alarm_type')), // 告警类型(桩)
          robotAlarmTypeObj: arrToObj(filterDict('robot_alarm_type')), // 机器人告警类型
          protTypeObj: arrToObj(filterDict('prot_version')), //
          orderStatusObj: arrToObj(filterDict('order_status')), // 订单状态
          errorMessageObj: arrToObj(filterDict('error_message')), // 错误信息
          preAlarmListObj: arrToObj(filterDict('object_no')), // 预警类型Obj
          commandCode34Obj: arrToObj(filterDict('command_code_3.4')), // 3.4
          commandCode34a1Obj: arrToObj(filterDict('command_code_3.4a1')), // 3.4a1
          commandCode34aObj: arrToObj(filterDict('command_code_3.4a')), // 3.4a
          commandCodeRobotObj: arrToObj(filterDict('command_code_robot')), // 3.4a
          msgCodeObj: arrToObj(filterDict('msg_code')), // 相关故障代码
          ratedPowObj: arrToObj(filterDict('rated_pow')),
          commProtocolObj: arrToObj(filterDict('comm_protocol')), // 通讯协议
          accessCommProtocolObj: arrToObj(filterDict('access_comm_protocol')), // 平台通讯协议
          cameraLocationObj: arrToObj(filterDict('camera_location')), // 车载摄像头
          carAlarmTypeObj: arrToObj(filterDict('car_alarm_type')),//车辆警告类型
          alarmRobotTypeObj: arrToObj(filterDict('alarm_robot_type')), // 机器人告警设备类型
          accessPlatformObj: arrToObj(filterDict('access_platform')),//接入平台
          carStatusMonObj: arrToObj(filterDict('car_status_mon')),//车辆状态
          chargingStatusObj: arrToObj(filterDict('charging_status')),//充电状态
        }
        commit('changeDictInfo', data)
      }
    }
  }
}

const mutations = {
  changeDictInfo(state, payload) {
    state.dictInfo = payload
  },
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}

