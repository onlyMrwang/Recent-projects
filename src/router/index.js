import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout'
import { sysTitle } from '../../config/defaultSetting'
const Login = () => import('@/views/Login')
const Index = () => import('@/views/Index')
const Page401 = () => import('@/views/ErrorPage/401')
const Page404 = () => import('@/views/ErrorPage/404')
// 系统管理模块
const System = () => import('@/views/System')
// 组织机构
const OrginztionManage = () => import('@/views/System/OrganizationManage')
// 角色管理
const RoleManage = () => import('@/views/System/RoleManage')
// 用户管理
const UserManage = () => import('@/views/System/UserManage')
// 菜单管理
const MenuManage = () => import('@/views/System/MenuManage')
// 日志管理
const LogsManage = () => import('@/views/System/LogsManage')
// 操作日志
const OperationLog = () => import('@/views/System/LogsManage/OperationLog')
// 登录日志
const LoginLog = () => import('@/views/System/LogsManage/LoginLog')
// 个人信息
const UserInfo = () => import('@/views/System/UserInfo')
// 字典管理
const Dict = () => import('@/views/System/BaseManage/Dict')
// 字典归属
const DictOf = () => import('@/views/System/BaseManage/DictOf')
// 图标管理
const ImageManage = () => import('@/views/System/BaseManage/ImgManage')
// 通知公告
const Notice = () => import('@/views/System/BaseManage/Notice')
// 系统配置
const SysSetting = () => import('@/views/System/BaseManage/SysSetting')
// 企业配置
const Business = () => import('@/views/System/Business')
// app更新
const AppUpdate = () => import('@/views/System/AppUpdate')

// 统计报表
const Statistical = () => import('@/views/Statistical')
// 充电终端运营服务表
const Cdzdyyfwb = () => import('@/views/Statistical/Cdzdyyfwb')
// 车辆充电记录表
const Clcdjlb = () => import('@/views/Statistical/Clcdjlb')
// 充电终端运营服务报表汇总
const Cdzdyyfwbbhz = () => import('@/views/Statistical/Cdzdyyfwbbhz')
// 车辆充电记录报表汇总
const Clcdjlbbhz = () => import('@/views/Statistical/Clcdjlbbhz')
// 充电终端运营服务汇总表
const Cdzdyyfwhzb = () => import('@/views/Statistical/Cdzdyyfwhzb')


// 财务管理模块
const Financial = () => import('@/views/Financial')
// 充值交易
const RechargeTran = () => import('@/views/Financial/Recharge/RechargeTran')
// 充值取消
const RechargeCancel = () => import('@/views/Financial/Recharge/RechargeCancel')
// 网点资费配置
const NetTariffSetting = () => import('@/views/Financial/TariffSetting/NetTariffSetting')
// 机构网点资费配置
const OrgTariffSetting = () => import('@/views/Financial/TariffSetting/OrgTariffSetting')
// 账户查询
const AccSearch = () => import('@/views/Financial/AccountManage/AccSearch')
// 账户配置
const AccSetting = () => import('@/views/Financial/AccountManage/AccSetting')
// 卡密码修改
const CardPwdChange = () => import('@/views/Financial/AccountManage/CardPwdChange')
// 卡挂失/解挂
const CardLoss = () => import('@/views/Financial/AccountManage/CardLoss')
// 补卡/换卡
const RepairCard = () => import('@/views/Financial/AccountManage/RepairCard')
// 退卡
const RetreatCard = () => import('@/views/Financial/AccountManage/RetreatCard')
// 充值订单查询
const ReChrOrdSea = () => import('@/views/Financial/BillInquiry/ReChrOrdSea')
// 充电订单查询
const ChrOrderSea = () => import('@/views/Financial/BillInquiry/ChrOrderSea')
// 订单状态查询
const OrdStaSea = () => import('@/views/Financial/BillInquiry/OrdStaSea')
// 异常订单查询
const UnNorOrdSea = () => import('@/views/Financial/BillInquiry/UnNorOrdSea')
// 充电记录补录
const ChrRecSup = () => import('@/views/Financial/BillInquiry/ChrRecSup')
// 白名单管理
const WhiteList = () => import('@/views/Financial/WhiteList')

// 告警中心
const Alarm = () => import('@/views/Alarm')
// 告警监控中心
const AlarmMonitorCenter = () => import('@/views/Alarm/ChargEquipAlarm/AlarmMonitorCenter')
// 故障告警知识库
const FaultAlarmBase = () => import('@/views/Alarm/ChargEquipAlarm/FaultAlarmBase')
//告警策略详细信息
const FilteringStrategy = () => import('@/views/Alarm/ChargEquipAlarm/FilteringStrategy')
//告警通知策略详细信息
const BeforeFiltering = () => import('@/views/Alarm/ChargEquipAlarm/BeforeFiltering')
// 告警预配置
const AlarmSetting = () => import('@/views/Alarm/ChargEquipAlarm/AlarmSetting')
//告警历史记录
const HistoricalAlarms = () => import('@/views/Alarm/ChargEquipAlarm/HistoricalAlarms')
//历史报文
// const MessageHistory = () => import('@/views/Alarm/ChargEquipAlarm/MessageHistory')
//充电过程数据
// const Charging = () => import('@/views/Alarm/ChargEquipAlarm/Charging')
//停机日志
// const StopLog = () => import('@/views/Alarm/ChargEquipAlarm/StopLog')

// 充电机器人告警

// 告警监控中心
const RobotAlarmCenter = () => import('@/views/Alarm/RobotAlarm/AlarmCenter')
// 过滤策略 
const RobotFilterStrategy = () => import('@/views/Alarm/RobotAlarm/FilterStrategy')
// 历史告警
const RobotHistoryAlarm = () => import('@/views/Alarm/RobotAlarm/HistoryAlarm')
// 告警知识库
const RobotKnowdgeBase = () => import('@/views/Alarm/RobotAlarm/KnowledgeBase')
// 告警通知策略
const RobotNoticeStrategy = () => import('@/views/Alarm/RobotAlarm/NoticeStrategy')


const DataAnalysis = () => import('@/views/DataAnalysis')
// 资产
const Assets = () => import('@/views/AssetsManage')
// 充电网点
const ChargGroupInfo = () => import('@/views/AssetsManage/chargGroupInfo/index')
// 充电设备
const ChargGroup = () => import('@/views/AssetsManage/chargGroup/index')
// 充点卡
const ChargeCard = () => import('@/views/AssetsManage/chargeCard/index')
// 厂商
const Manufacturer = () => import('@/views/AssetsManage/manufacturer/index')
// 车辆档案
const VehicleFiles = () => import('@/views/AssetsManage/vehicleFiles/index')
// 充电机器人
const ChargingRobot = () => import('@/views/AssetsManage/chargingRobot/index')
// 职工
const EmployeeInfo = () => import('@/views/AssetsManage/employeeInfo/index')

// 平台管理
const PlatformManage = () => import('@/views/PlatformManage')
// 企业配置
const Enterprise = () => import('@/views/PlatformManage/Enterprise')
// 企业管理员配置
const EnterpriseAdmin = () => import('@/views/PlatformManage/EnterpriseAdmin')

//远程控制
const Remotecontrol = () => import('@/views/Remotecontrol')
//设备参数管理
const parameter = () => import('@/views/Remotecontrol/ChargingPile/parameter/index')
//充电设备时间同步
const TimeSync = () => import('@/views/Remotecontrol/ChargingPile/TimeSync/index')
//工作参数设置
const WokeParams = () => import('@/views/Remotecontrol/ChargingPile/WokeParams/index')
//心跳包信息设置
const HeartInformation = () => import('@/views/Remotecontrol/ChargingPile/HeartInformation/index')
//刷卡流程参数设置
const CardProcess = () => import('@/views/Remotecontrol/ChargingPile/CardProcess/index')
//运营参数管理
const OperationParams = () => import('@/views/Remotecontrol/ChargingPile/OperationParams/index')
//通信参数管理
const CommunicationParameter = () => import('@/views/Remotecontrol/ChargingPile/CommunicationParameter/index')
//充电设备重启
const restart = () => import('@/views/Remotecontrol/ChargingPile/restart/index')
//充电设备远程控制
const RemoteControl = () => import('@/views/Remotecontrol/ChargingPile/RemoteControl/index')
//定时时间同步配置
const TimingTime = () => import('@/views/Remotecontrol/OthersConfig/TimingTime/index')
//充电设备配置日志查询
const LogSearch = () => import('@/views/Remotecontrol/OthersConfig/LogSearch/index')
//车辆参数管理
const CarParams = () => import('@/views/Remotecontrol/CarsControl/CarParams/index')
//车辆行驶记录查询
const DrivingRecord = () => import('@/views/Remotecontrol/CarsControl/DrivingRecord/index')
//自动充电机器人复位日志查询
const ResetLogs = () => import('@/views/Remotecontrol/RobotControl/ResetLogs/index')
//自动充电机器人复位
const RobotReset = () => import('@/views/Remotecontrol/RobotControl/RobotReset/index')
// 维修保养
const Maintenance = () => import('@/views/Maintenance')
// 故障上报工单
const FaultReporting = () => import('@/views/Maintenance/FaultReporting/index')
// 故障上报工单详情
const FaultDetail = () => import('@/views/Maintenance/FaultReporting/faultdetail.vue')
// 维修工单
const RepairOrder = () => import('@/views/Maintenance/RepairOrder/index')
// 维修工单详情
const RepairDetail = () => import('@/views/Maintenance/RepairOrder/repairdetail.vue')
// 巡检工单
const InspectionOrder = () => import('@/views/Maintenance/InspectionOrder/index')
// 巡检工单详情
const InspectDetail = () => import('@/views/Maintenance/InspectionOrder/inspectdetail.vue')
//监控中心
const comsupervision = () => import('@/views/monitoring/comsupervision/index')

// 智慧调度
// 充电桩配置
const ChargingPileConfig = () => import('@/views/SmartDispatch/ChargingPileConfig/index')
// 规则配置
const RuleConfig = () => import('@/views/SmartDispatch/RuleConfig/index')
// 任务视图
const TaskView = () => import('@/views/SmartDispatch/TaskView/index')
// 评价体系
const EvaluationSystem = () => import('@/views/SmartDispatch/EvaluationSystem/index')

// 电池管理
const Battery = () => import('@/views/Battery')
// 电池数据跟踪分析
const BatteryDataAnalysis = () => import('@/views/Battery/BatteryDataAnalysis')
// 电池健康度评估
const BatteryHealthAssess = () => import('@/views/Battery/BatteryHealthAssess')


// 车辆告警
// 告警过滤策略
const AlarmFilter = () => import('@/views/Alarm/CarAlarm/AlarmFilter/index')
// 告警通知策略
const AlarmNotification = () => import('@/views/Alarm/CarAlarm/AlarmNotification/index')
// 故障告警知识库
const FaultAlarm = () => import('@/views/Alarm/CarAlarm/FaultAlarm/index')
// 历史告警查询
const HistoricalAlarm = () => import('@/views/Alarm/CarAlarm/HistoricalAlarm/index')
// 告警监控中心
const MonitoringCenter = () => import('@/views/Alarm/CarAlarm/MonitoringCenter/index')

// 日志查询

// 充电设备日志
// 充电过程日志
const ProcessLog = () => import('@/views/LogsManage/ChargeLogs/Charging')
// 原始报文日志
const OriginMsgLog = () => import('@/views/LogsManage/ChargeLogs/MessageHistory')
// 告警通知日志
const NoticeLog = () => import('@/views/LogsManage/ChargeLogs/BeforeHistory')
// 停机日志
const ChargeStopLog = () => import('@/views/LogsManage/ChargeLogs/StopLog')
// 充电预警日志
const PreAlarmLog = () => import('@/views/LogsManage/ChargeLogs/PreAlarmLog')

// 充电机器人日志
// 原始报文日志
const RobotHisMsg = () => import('@/views/LogsManage/RobotLogs/HistoryMsg')
// 告警通知日志
const NoticeAlarmLog = () => import('@/views/LogsManage/RobotLogs/NoticeLog')

// 车辆告警
// 车辆登录日志
const OptionLog = () => import('@/views/LogsManage/CarLogs/CarLoginLogs')
// 平台操作日志查询
const PlatformLog = () => import('@/views/LogsManage/CarLogs//PlatformOperationLogs')
// 告警通知策略日志
const AlarmLog = () => import('@/views/LogsManage/CarLogs/AlarmNotificationLogs')
// 原始报文查询日志
const OriginLog = () => import('@/views/LogsManage/CarLogs/OriginalMessage')
// 状态上报查询日志
const StatusLog = () => import('@/views/LogsManage/CarLogs/StatusReporting')
// 电池预警日志
const BatteryLog = () => import('@/views/LogsManage/CarLogs/BatteryLog')



Vue.use(Router)

// 公共路由
export const constantRoutes = [
    {
       path: '/airweb/login',
        component: Login,
    },
    {
       path: '/',
       redirect: '/airweb',
        // name: 'Layout',
        component: Layout,
        children: [
            {
                path: '/airweb',
                component: Index,
                meta: {
                    title: '首页'
                }
            },
            {
               path: '/airweb/system',
                component: System,
                meta: {
                    title: '系统管理'
                }
            },
            {
               path: '/airweb/system/dept',
                component: OrginztionManage,
                meta: {
                    title: '组织机构管理'
                }
            },
            {
               path: '/airweb/system/role',
                component: RoleManage,
                meta: {
                    title: '角色管理'
                }
            },
            {
               path: '/airweb/system/menu',
                component: MenuManage,
                meta: {
                    title: '菜单管理'
                }
            },
            {
               path: '/airweb/system/user',
                component: UserManage,
                meta: {
                    title: '用户管理'
                }
            },

            {
               path: '/airweb/system/LogsManage',
                component: LogsManage,
                meta: {
                    title: '日志管理'
                }
            },
            {
               path: '/airweb/system/operlog',
                component: OperationLog,
                meta: {
                    title: '操作日志'
                }
            },
            {
               path: '/airweb/system/loginFor',
                component: LoginLog,
                meta: {
                    title: '登录日志'
                }
            },
            {
               path: '/airweb/user/profile',
                component: UserInfo,
                meta: {
                    title: '个人信息'
                }
            },
            {
               path: '/airweb/system/dict',
                component: Dict,
                meta: {
                    title: '字典管理'
                }
            },
            {
               path: '/airweb/system/image',
                component: ImageManage,
                meta: {
                    title: '图标管理'
                }
            },
            {
               path: '/airweb/system/notice',
                component: Notice,
                meta: {
                    title: '通知公告'
                }
            },
            {
               path: '/airweb/system/config',
                component: SysSetting,
                meta: {
                    title: '系统配置'
                }
            },
            {
               path: '/airweb/system/business',
                component: Business,
                meta: {
                    title: '企业配置'
                }
            },
            {
               path: '/airweb/system/dataroute',
                component: DictOf,
                meta: {
                    title: '字典归属'
                }
            },
            {
               path: '/airweb/platformmanage',
                component: PlatformManage,
                meta: {
                    title: '平台管理'
                }
            },
            {
               path: '/airweb/platformmanage/Enterprise',
                component: Enterprise,
                meta: {
                    title: '企业配置'
                }
            },
            {
               path: '/airweb/platformmanage/EnterpriseAdmin',
                component: EnterpriseAdmin,
                meta: {
                    title: '企业管理员配置'
                }
            },
            {
               path: '/airweb/system/appUpdate',
                component: AppUpdate,
                meta: {
                    title: 'APP更新'
                }
            },
            // 统计报表
            {
               path: '/airweb/statistical',
                component: Statistical,
                meta: {
                    title: '统计报表'
                }
            },
            {
               path: '/airweb/statistical/cdzdyyfwb',
                component: Cdzdyyfwb,
                meta: {
                    title: '充电终端运营服务表'
                }
            },
            {
               path: '/airweb/statistical/Clcdjlb',
                component: Clcdjlb,
                meta: {
                    title: '车辆充电记录表'
                }
            },
            {
               path: '/airweb/statistical/Cdzdyyfwbbhz',
                component: Cdzdyyfwbbhz,
                meta: {
                    title: '充电终端运营服务报表汇总'
                }
            },
            {
               path: '/airweb/statistical/Clcdjlbbhz',
                component: Clcdjlbbhz,
                meta: {
                    title: '车辆充电记录报表汇总'
                }
            },
            {
               path: '/airweb/statistical/Cdzdyyfwhzb',
                component: Cdzdyyfwhzb,
                meta: {
                    title: '充电终端运营服务汇总表'
                }
            },
            // 账务管理
            {
               path: '/airweb/financial',
                component: Financial,
                meta: {
                    title: '账务管理'
                }
            },
            {
               path: '/airweb/tariff/stationCharges',
                component: NetTariffSetting,
                meta: {
                    title: '网点资费配置'
                }
            },
            {
               path: '/airweb/tariff/mechanismStation',
                component: OrgTariffSetting,
                meta: {
                    title: '机构网点配置'
                }
            },
            {
               path: '/airweb/recharge/rechargeTran',
                component: RechargeTran,
                meta: {
                    title: '充值交易'
                }
            },
            {
               path: '/airweb/recharge/rechargeCancel',
                component: RechargeCancel,
                meta: {
                    title: '充值撤销'
                }
            },
            {
               path: '/airweb/accountManage/accountSearch',
                component: AccSearch,
                meta: {
                    title: '账户查询'
                }
            },
            {
               path: '/airweb/accountManage/accountSetting',
                component: AccSetting,
                meta: {
                    title: '账户设置'
                }
            },
            {
               path: '/airweb/accountManage/cardPwdChange',
                component: CardPwdChange,
                meta: {
                    title: '卡密码修改'
                }
            },
            {
               path: '/airweb/accountManage/cardLoss',
                component: CardLoss,
                meta: {
                    title: '卡挂失/解挂'
                }
            },
            {
               path: '/airweb/accountManage/repairCard',
                component: RepairCard,
                meta: {
                    title: '补卡/换卡'
                }
            },
            {
               path: '/airweb/accountManage/retreatCard',
                component: RetreatCard,
                meta: {
                    title: '退卡'
                }
            },
            {
               path: '/airweb/billInquiry/reChrOrdSea',
                component: ReChrOrdSea,
                meta: {
                    title: '充值订单查询'
                }
            },
            {
               path: '/airweb/billInquiry/chrOrderSea',
                component: ChrOrderSea,
                meta: {
                    title: '充电订单查询'
                }
            },
            {
               path: '/airweb/billInquiry/ordStaSea',
                component: OrdStaSea,
                meta: {
                    title: '订单状态查询'
                }
            },
            {
               path: '/airweb/billInquiry/unNorOrdSea',
                component: UnNorOrdSea,
                meta: {
                    title: '异常订单查询'
                }
            },
            {
               path: '/airweb/billInquiry/chrRecSup',
                component: ChrRecSup,
                meta: {
                    title: '充电记录补录'
                }
            },
            {
               path: '/airweb/whiteList',
                component: WhiteList,
                meta: {
                    title: '白名单管理'
                }
            },
            {
               path: '/airweb/alarm',
                component: Alarm,
                meta: {
                    title: '告警中心'
                }
            },
            {
               path: '/airweb/alarm/alarmmonitorcenter',
                component: AlarmMonitorCenter,
                name: '告警监控中心',
                meta: {
                    title: '告警监控中心'
                }
            },
            {
               path: '/airweb/alarm/faultalarmbase',
                component: FaultAlarmBase,
                meta: {
                    title: '故障告警知识库'
                }
            },
            {
               path: '/airweb/alarm/filteringstrategy',
                component: FilteringStrategy,
                meta: {
                    title: '告警过滤策略'
                }
            },
            {
               path: '/airweb/alarm/BeforeFiltering',
                component: BeforeFiltering,
                meta: {
                    title: '告警通知策略'
                }
            },
            {
               path: '/airweb/alarm/alarmSetting',
                component: AlarmSetting,
                meta: {
                    title: '告警预警门限配置'
                }
            },
            {
               path: '/airweb/alarm/historicalAlarms',
                component: HistoricalAlarms,
                name:'历史告警',
                meta: {
                    title: '历史告警查询'
                }
            },
            {
               path: '/airweb/alarm/robotAlarmCenter',
                component: RobotAlarmCenter,
                name:'充电机器人告警',
                meta: {
                    title: '充电机器人-告警监控中心'
                }
            },
            {
               path: '/airweb/alarm/robotKnowledgeBase',
                component: RobotKnowdgeBase,
                meta: {
                    title: '充电机器人-故障告警知识库'
                }
            },
            {
               path: '/airweb/alarm/robotNoticeStrategy',
                component: RobotNoticeStrategy,
                meta: {
                    title: '充电机器人-告警通知策略'
                }
            },
            {
               path: '/airweb/alarm/robotFilterStrategy',
                component: RobotFilterStrategy,
                meta: {
                    title: '充电机器人-告警过滤策略'
                }
            },
            {
               path: '/airweb/alarm/robotHistoryAlarm',
                component: RobotHistoryAlarm,
                meta: {
                    title: '充电机器人-历史告警'
                }
            },
            {
               path: '/airweb/dataAnalysis',
                component: DataAnalysis,
                meta: {
                    title: '数据分析'
                }
            },
            {
               path: '/airweb/asset',
                component: Assets,
                meta: {
                    title: '资产管理'
                }
            },
            {
               path: '/airweb/asset/chargGroupInfo',
                component: ChargGroupInfo,
                meta: {
                    title: '充电网点管理'
                }
            },
            {
               path: '/airweb/asset/chargGroup',
                component: ChargGroup,
                meta: {
                    title: '充电设备管理'
                }
            },
            {
               path: '/airweb/asset/chargeCard',
                component: ChargeCard,
                meta: {
                    title: '充电卡管理'
                }
            },
            {
               path: '/airweb/asset/manufacturer',
                component: Manufacturer,
                meta: {
                    title: '厂商管理'
                }
            },
            {
               path: '/airweb/asset/vehicleFiles',
                component: VehicleFiles,
                meta: {
                    title: '车辆档案管理'
                }
            },
            {
               path: '/airweb/asset/chargingRobot',
                component: ChargingRobot,
                meta: {
                    title: '充电机器人管理'
                }
            },
            {
               path: '/airweb/asset/employeeInfo',
                component: EmployeeInfo,
                meta: {
                    title: '职工信息管理'
                }
            },
            {
               path: '/airweb/remotecontrol',
                component: Remotecontrol,
                meta: {
                    title: '远程控制'
                },
            },
            {
               path: '/airweb/remotecontrol/parameter',
                component: parameter,
                meta: {
                    title: '设备参数'
                }
            },
            {
               path: '/airweb/remotecontrol/TimeSync',
                component: TimeSync,
                meta: {
                    title: '充电设备时间同步'
                }
            },
            {
               path: '/airweb/remotecontrol/WokeParams',
                component: WokeParams,
                meta: {
                    title: '工作参数设置'
                }
            },
            {
               path: '/airweb/remotecontrol/HeartInformation',
                component: HeartInformation,
                meta: {
                    title: '心跳包信息设置'
                }
            },
            {
               path: '/airweb/remotecontrol/CardProcess',
                component: CardProcess,
                meta: {
                    title: '刷卡流程参数设置'
                }
            },
            {
               path: '/airweb/remotecontrol/OperationParams',
                component: OperationParams,
                meta: {
                    title: '运营参数管理'
                }
            },
            {
               path: '/airweb/remotecontrol/CommunicationParameter',
                component: CommunicationParameter,
                meta: {
                    title: '通信参数管理'
                }
            },
            {
               path: '/airweb/remotecontrol/restart',
                component: restart,
                meta: {
                    title: '充电设备重启'
                }
            },
            {
               path: '/airweb/remotecontrol/RemoteControl',
                component: RemoteControl,
                meta: {
                    title: '充电设备远程控制'
                }
            },
            {
               path: '/airweb/remotecontrol/TimingTime',
                component: TimingTime,
                meta: {
                    title: '定时时间同步配置'
                }
            },
            {
               path: '/airweb/remotecontrol/LogSearch',
                component: LogSearch,
                meta: {
                    title: '充电设备配置日志查询'
                }
            },
            {
               path: '/airweb/remotecontrol/CarParams',
                component: CarParams,
                meta: {
                    title: '车辆参数管理'
                }
            },
            {
               path: '/airweb/remotecontrol/DrivingRecord',
                component: DrivingRecord,
                meta: {
                    title: '车辆行驶记录查询'
                }
            },
            {
               path: '/airweb/remotecontrol/ResetLogs',
                component: ResetLogs,
                meta: {
                    title: '自动充电机器人复位日志查询'
                }
            },
            {
               path: '/airweb/remotecontrol/RobotReset',
                component: RobotReset,
                meta: {
                    title: '自动充电机器人复位'
                }
            },
            {
               path: '/airweb/maintenance',
                component: Maintenance,
                meta: {
                    title: '维修保养'
                }
            },
            {
               path: '/airweb/maintenance/faultreporting',
                component: FaultReporting,
                meta: {
                    title: '故障上报工单'
                }
            },
            {
               path: '/airweb/maintenance/faultdetail/:id',
                component: FaultDetail,
                meta: {
                    title: '故障上报工单详情'
                }
            },
            {
               path: '/airweb/maintenance/repairorder',
                component: RepairOrder,
                meta: {
                    title: '维修工单'
                }
            },
            {
               path: '/airweb/maintenance/repairdetail/:id',
                component: RepairDetail,
                meta: {
                    title: '维修工单详情'
                }
            },
            {
               path: '/airweb/maintenance/inspectionorder',
                component: InspectionOrder,
                meta: {
                    title: '巡检工单'
                }
            },
            {
               path: '/airweb/maintenance/inspectdetail/:id',
                component: InspectDetail,
                meta: {
                    title: '巡检工单详情'
                }
            },
            {
               path: '/airweb/monitoring',
                component: comsupervision,
                meta: {
                    title: '监控中心'
                }
            },

            {
               path: '/airweb/SmartDispatch/ChargingPileConfig',
                component: ChargingPileConfig,
                meta: {
                    title: '可充电车辆/桩配置'
                }
            },
            {
               path: '/airweb/SmartDispatch/EvaluationSystem',
                component: EvaluationSystem,
                meta: {
                    title: '评价体系'
                }
            },
            {
               path: '/airweb/SmartDispatch/RuleConfig',
                component: RuleConfig,
                meta: {
                    title: '智慧调度规则配置'
                }
            },
            {
               path: '/airweb/SmartDispatch/TaskView',
                component: TaskView,
                meta: {
                    title: '充电任务视图'
                }
            },

            {
               path: '/airweb/battery',
                component: Battery,
                meta: {
                    title: '电池管理'
                }
            },
            {
               path: '/airweb/battery/batteryDataAnalysis',
                component: BatteryDataAnalysis,
                meta: {
                    title: '电池数据跟踪分析'
                }
            },
            {
               path: '/airweb/battery/batteryHealthAssess',
                component: BatteryHealthAssess,
                meta: {
                    title: '电池健康度评估'
                }
            },
            // 车辆告警
            {
               path: '/airweb/CarAlarm/AlarmFilter',
                component: AlarmFilter,
                meta: {
                    title: '告警过滤策略'
                }
            },
            {
               path: '/airweb/CarAlarm/AlarmNotification',
                component: AlarmNotification,
                meta: {
                    title: '告警通知策略'
                }
            },
            {
               path: '/airweb/CarAlarm/FaultAlarm',
                component: FaultAlarm,
                meta: {
                    title: '故障告警知识库'
                }
            },
            {
               path: '/airweb/CarAlarm/HistoricalAlarm',
                component: HistoricalAlarm,
                meta: {
                    title: '历史告警查询'
                }
            },
            {
               path: '/airweb/CarAlarm/MonitoringCenter',
                component: MonitoringCenter,
                name:"车辆告警详情",
                meta: {
                    title: '告警监控中心'
                }
            },
            // 日志查询模块
            {
               path: '/airweb/chargeLogs/processLog',
                component: ProcessLog,
                meta: {
                    title: '充电过程日志'
                }
            },
            {
               path: '/airweb/chargeLogs/originMsgLog',
                component: OriginMsgLog,
                meta: {
                    title: '原始报文日志'
                }
            },
            {
               path: '/airweb/chargeLogs/noticeLog',
                component: NoticeLog,
                meta: {
                    title: '告警通知日志'
                }
            },
            {
               path: '/airweb/chargeLogs/stopLog',
                component: ChargeStopLog,
                meta: {
                    title: '停机日志'
                }
            },
            {
               path: '/airweb/chargeLogs/preAlarmLog',
                component: PreAlarmLog,
                meta: {
                    title: '充电预警日志'
                }
            },
            {
               path: '/airweb/robotLogs/robotOriginLog',
                component: RobotHisMsg,
                meta: {
                    title: '原始报文日志'
                }
            },
            {
               path: '/airweb/robotLogs/noticeAlarmLog',
                component: NoticeAlarmLog,
                meta: {
                    title: '告警通知日志'
                }
            },
            {
               path: '/airweb/carLogs/optionLog',
                component: OptionLog,
                meta: {
                    title: '车辆操作日志'
                }
            },
            {
               path: '/airweb/carLogs/platformLog',
                component: PlatformLog,
                meta: {
                    title: '平台操作日志查询'
                }
            },
            {
               path: '/airweb/carLogs/alarmLog',
                component: AlarmLog,
                meta: {
                    title: '告警通知策略日志'
                }
            },
            {
               path: '/airweb/carLogs/originLog',
                component: OriginLog,
                meta: {
                    title: '原始报文查询日志'
                }
            },
            {
               path: '/airweb/carLogs/statusLog',
                component: StatusLog,
                meta: {
                    title: '状态上报查询日志'
                }
            },
            {
               path: '/airweb/carLogs/batteryLog',
                component: BatteryLog,
                meta: {
                    title: '电池预警日志'
                }
            },
            {
               path: '/airweb/401',
                component: Page401,
                meta: {
                    title: '401'
                }
            },
            {
               path: '/airweb/404',
                component: Page404,
                meta: {
                    title: '404'
                }
            },
        ]
    },

]

const router = new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        // document.title = `${sysTitle} - ${to.meta.title}`;
        document.title = sysTitle
    } else {
        document.title = sysTitle
    }
    next()
})

// eslint-disable-next-line no-irregular-whitespace
const VueRouterPush = Router.prototype.push
// eslint-disable-next-line no-irregular-whitespace
Router.prototype.push = function push(to) {
    // eslint-disable-next-line no-irregular-whitespace
    return VueRouterPush.call(this, to).catch(err => err)
}

export default router