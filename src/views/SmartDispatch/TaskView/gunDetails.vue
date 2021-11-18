<template>
  <!--机器人详情-->
  <div>
    <!-- <div class="box"> -->
    <div class="carDetails">
      <div class="headerBox">
        <div class="title">&nbsp;&nbsp;充电设备详情</div>
      </div>
      <div class="itemContent">
        <div class="line">
          <div class="item">
            <div class="label">充电设备名称:</div>
            <div class="value">{{ pileDetail.poleName }}</div>
          </div>
          <div class="item">
            <div class="label">枪号:</div>
            <div class="value">{{ infos.gunNo }}</div>
          </div>
          <div class="item">
            <div class="label">所属组织机构:</div>
            <div class="value">{{ pileDetail.orgName }}</div>
          </div>
        </div>
        <div class="line">
          <div class="item">
            <div class="label">所属网点:</div>
            <div class="value">{{ pileDetail.websiteName }}</div>
          </div>
          <div class="item">
            <div class="label">设备类型:</div>
            <div class="value">
              {{ pileDetail.deviceType == 1 ? '直流' : '交流' }}
            </div>
          </div>
          <div class="item">
            <div class="label">桩状态:</div>
            <div class="value">
              <span style="color: #41B8C3" v-if="pileDetail.status == '1'"
                >在线</span
              >
              <span style="color: red" v-else>离线</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="menuContent">
      <el-tabs v-model="activeName">
        <el-tab-pane label="过程数据" name="guocheng">
          <chargingProcess
            :infos="info"
            :pileDetail="pileDetail"
          ></chargingProcess>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
// import qjDetail from './qjDetail' //全景数据
import chargingProcess from './chargingProcess' //过程数据
import { getPileDetails } from '@/api/monitoring/comsupervision.js'
import { mapGetters } from 'vuex'
import moment from 'moment'
import * as echarts from 'echarts'
export default {
  components: {
    // qjDetail,
    chargingProcess
  },
  data() {
    return {
      value1: '',
      pileDetail: {},
      activeName: 'guocheng',
      info: {},
      backImg: require('@/assets/monitoring/type/fanhui.svg'),
      timeList: [
        `${moment()
          .subtract(6, 'days')
          .format('YYYY-MM-DD')}`,
        `${moment().format('yyyy-MM-DD')}`
      ],
      hisAlarmConf: {
        gunNo: null,
        deviceNo: null,
        startTime: null,
        endTime: null
      },
      alarmtrendTotal: {
        1: '0',
        2: '0',
        3: '0'
      },
      hisalarmTotal: {
        1: '0',
        2: '0',
        3: '0'
      }
    }
  },
  props: {
    infos: {
      type: Object,
      required: false
    }
  },
  //监听父组件给的值
  watch: {
    infos: {
      handler(newName, oldName) {
        this.info = newName
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['routersList'])
  },
  created() {
    this.info = this.infos
    this.hisAlarmConf.gunNo = this.infos.gunNo
    this.hisAlarmConf.deviceNo = this.infos.deviceNo
    this.getPileDetails()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    toSearch() {
      this.hisAlarmConf.startTime =
        this.timeList.length > 0 ? this.timeList[0] : null
      this.hisAlarmConf.endTime =
        this.timeList.length > 0 ? this.timeList[1] : null
      // 历史告警
      this.getHisalarm1h()
    },
    resetSearch() {
      this.timeList = []
      this.hisAlarmConf = {
        gunNo: null,
        deviceNo: null,
        startTime: null,
        endTime: null
      }
    },
    // 跳转到告警中心
    toAlarm(type) {
      var back = this.$router.resolve({
        query: {
          type: type
        },
        name: '告警监控中心'
      })
      window.open(back.href, '_blank')
    },
    goBack() {
      this.$emit('changeType')
    },
    //获取桩信息
    async getPileDetails() {
      const res = await getPileDetails({ poleNo: this.info.row.assetsNum })
      if (res.code === 200) {
        this.pileDetail = res.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global.scss';

#myChart {
  width: 100%;
  height: 400px;
}

#myChart1 {
  width: 100%;
  height: 400px;
}

#myChart2 {
  width: 100%;
  height: 400px;
}

.carDetails {
  width: 100%;
  overflow: hidden;
  background-color: #e4f3f5;
  color: #222;
  margin-bottom: 10px;
}
.headerBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 10px 20px 10px 0;
  .title {
    font-size: 16px;
    color: #222222;
    &::before {
      content: '|';
      color: $btnMainColor;
      height: 5px;
      width: 2px;
      background: $btnMainColor;
    }
  }
  .back {
    width: 36px;
    cursor: pointer;
    border: 1px solid #dedede;
    border-radius: 2px;
    text-align: center;
    // margin: -10px 0;
  }
}
.itemContent {
  background-color: #fff;
  padding-bottom: 10px;
  .line {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    .item {
      flex: 1;
      display: flex;
      align-items: center;
      .label {
        font-size: 14px;
        color: #8e8e8e;
        margin-right: 10px;
        width: 140px;
        text-align: right;
      }
      .value {
        font-size: 14px;
        color: #222222;
      }
    }
  }
}

.menuContent {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 15px;
  clear: both;
  // width: calc(100% - 30px);
  .titleHeader {
    .title {
      font-size: 14px;
      .label {
        color: #999;
      }
      .value {
        color: #ff9800;
        cursor: pointer;
      }
      .d {
        color: #999;
      }
    }
  }
  .numBox {
    text-align: center;
    display: flex;
    align-items: center;
    // justify-content: center;
    margin-left: 30px;
    .numItem {
      margin-right: 20px;
      background-color: #f5f5f5;
      padding: 5px 15px;
      border-radius: 2px;
      .name {
        font-size: 14px;
        color: #999;
      }
      .num {
        margin-top: 10px;
        font-size: 16px;
        font-weight: 700;
        color: #666;
      }
    }
  }
}

.searchAccSearch {
  background-color: #fff;
  height: 55px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  // justify-content: space-between;
  // padding: 0 35px 0 30px;
  .inputBox {
    display: flex;
    align-items: center;
    .inputItem {
      display: flex;
      align-items: center;
      margin-right: 38px;
      .label {
        color: $mainTextColor;
        font-size: $fontSize14;
        margin-right: 12px;
      }
    }
  }
}
.box {
  width: 100%;
}
</style>
