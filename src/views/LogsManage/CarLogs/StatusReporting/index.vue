<template>
  <div class="chrOrderSea">
    <!-- search box -->
    <div class="card">
      <el-form
        ref="searchInfo"
        :model="searchInfo"
        size="small"
        label-width="98px"
      >
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item label="所属组织机构">
              <treeselect
                v-model="searchInfo.oriDepartId"
                :default-expand-level="1"
                :options="deptOptions"
                :normalizer="normalizer"
                placeholder="选择所属组织机构"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车牌号">
              <el-select
                v-model="searchInfo.plateNo"
                filterable
                clearable
                placeholder="请选择车牌号"
              >
                <el-option
                  v-for="(item, index) in levelList"
                  :key="index"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报时间">
              <el-date-picker
                popper-class="dateRange"
                v-model="timeList"
                type="datetimerange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-form-item
            ><el-col :span="24" align="right">
              <el-button type="primary" @click="searClick">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </el-col></el-form-item
          >
        </el-row>
      </el-form>
    </div>
    <!-- table box-->
    <div class="tableBox">
      <div class="top">
        <div class="title">
          <!-- <div class="sign"></div> -->
          <div class="name">状态上报日志</div>
        </div>
        <!--<div class="options">-->
        <!--<el-button size="mini" icon="el-icon-plus" @click="upDateEdit(1)" class="btn">新增</el-button>-->
        <!--</div>-->
      </div>
      <div class="table">
        <el-table
          :data="tableList"
          border
          :header-cell-style="tableHeaderStyle"
          style="width: 100%"
        >
          <el-table-column
            align="center"
            label="序号"
            type="index"
            fixed
          ></el-table-column>
          <el-table-column
            fixed
            prop="carNumber"
            label="车牌号"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            fixed
            prop="nameCn"
            label="所属组织机构"
            width="150"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column
            prop="time"
            label="时间"
            width="180"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="carSoc"
            label="车辆SOC"
            width="120"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="bmsVoltage"
            label="车辆电池单体电压"
            width="180"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="bmsTemp"
            label="车辆电池温度"
            width="180"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="carAccVoltage"
            label="车辆总电压"
            width="200"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="carAccElectric"
            label="车辆总电流"
            width="180"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="driverTemp"
            label="车辆驱动机温度"
            width="180"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="驱动机控制器温度"
            prop="driverControllerTemp"
            width="120"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="carCsumFuel"
            label="油耗"
            width="120"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="驾驶员(签登)"
            prop="driverDyna"
            width="120"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="SIM卡"
            prop="sim"
            width="120"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="经度"
            prop="longitude"
            width="120"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="纬度"
            prop="latitude"
            width="120"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="行驶方向"
            prop="travelDirection"
            width="120"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="休眠状态"
            prop="dormancyStatus"
            width="120"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="通信信号"
            prop="commSignal"
            width="120"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="累计里程"
            prop="totalMileage"
            width="120"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="充电状态"
            prop="chargingStatus"
            width="120"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ getChargingStatus(scope.row.chargingStatus) }}
            </template>
          </el-table-column>
          <el-table-column
            label="车辆状态"
            prop="carStatus"
            width="120"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ getCarStatus(scope.row.carStatus) }}
            </template>
          </el-table-column>
          <el-table-column
            label="行驶速度"
            prop="travelSpeed"
            width="120"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="tableList.length > 0">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="searchInfo.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size.sync="searchInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 所属组织机构
import { getOrganization } from '@/api/asset/charggroupinfo'
import {
  getCarNumberByOrg //车牌号
} from '@/api/alarm/caralarm/monitoringcenter'
import { stopWledgeConfig, clertList } from '@/api/alarm/faultalarmBase'
import { getList } from '@/api/alarm/caralarm/statusreporting'
import { getAlarmTitle } from '@/api/alarm/celve'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      titles: '',
      total: 0,
      subType: 1,
      searchInfo: {
        oriDepartId: null,
        plateNo: null,
        pageNo: 1,
        pageSize: 10
      },
      alarmList: [],
      levelList: [],
      tableList: [], //table表格列表数组
      showSetting: false, //弹出框得显示隐藏
      rowInfo: null,
      timeList: [],
      deptOptions: [], //所属组织机构
      carStatusMon: [],
      chargingStatus: []
    }
  },
  computed: {
    ...mapGetters(['dictInfo']),
    getChargingStatus() {
      return function(val) {
        if (val === null) {
          return ''
        } else {
          return this.chargingStatus.filter((item) => {
            return item.value == val
          })[0].label
        }
      }
    },
    getCarStatus() {
      console.log(1)
      return function(val) {
        if (val === null) {
          return ''
        } else {
          return this.carStatusMon.filter((item) => {
            return item.value == val
          })[0].label
        }
      }
    }
  },
  watch: {
    timeList() {
      if (this.timeList === null) {
        this.timeList = []
      }
    },
    'searchInfo.oriDepartId'(newVal, oldVal) {
      if (newVal === null || newVal === undefined) {
        return false
      } else {
        getCarNumberByOrg({
          id: this.searchInfo.oriDepartId
        }).then((res) => {
          this.levelList = res.data
        })
      }
    }
  },
  created() {
    // 车辆状态
    this.carStatusMon = this.dictInfo.carStatusMon
    // 充电状态
    this.chargingStatus = this.dictInfo.chargingStatus
    console.log('------------carStatusMon', this.carStatusMon)
    console.log('------------chargingStatus', this.chargingStatus)
    this.getList()
    this.getOrganization()
  },
  methods: {
    handleSizeChange(pageSize) {
      this.searchInfo.pageNo = 1
      this.searchInfo.pageSize = pageSize
      this.getList()
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children
      }
    },
    // 获取组织机构数据
    getOrganization() {
      getOrganization().then((response) => {
        if (response.code === 200) {
          this.deptOptions = response.data
        }
      })
    },
    // 修改确定
    submit() {
      this.cancel()
    },
    // 取消
    cancel() {
      this.showSetting = false
    },
    severityClick(val) {
      this.alarmList = []
      this.searchInfo.alarmTitle = null
      if (val) {
        this.fetchAlarmTitle(val)
      }
    },

    // 获取告警名称
    async fetchAlarmTitle(val) {
      const res = await getAlarmTitle({ alarmSeverity: val })
      if (res.code == 200) {
        this.alarmList = res.data
      }
    },
    searClick() {
      this.searchInfo.pageNo = 1
      this.getList()
    },
    reset() {
      this.timeList = []
      this.searchInfo = {
        alarmSeverity: null,
        alarmTitle: null,
        pageNo: 1,
        pageSize: 10
      }
    },
    //打开弹出框新增修改公用
    upDateEdit(num, val) {
      //通过sybType状态去控制当前时新增还是修改
      if (num == 1) {
        this.ruleForm = {}
        this.rowInfo = null
        this.titles = '新增告警知识库'
      } else {
        this.rowInfo = JSON.parse(JSON.stringify(val))
        this.rowInfo.stopTag = this.rowInfo.stopTag == 1 ? true : false
        this.rowInfo.operationService =
          this.rowInfo.operationService == 1 ? true : false
        this.titles = '修改告警知识库'
      }
      this.subType = num
      this.showSetting = true
    },

    deleteBase(val) {
      this.$confirm('是否删除当前所选告警知识库', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.toDelete(val)
      })
    },

    //删除列表得方法
    async toDelete(val) {
      const res = await clertList({ id: val.id })
      if (res.code == 200) {
        if (this.tableList.length <= 1 && this.searchInfo.pageNo > 1) {
          this.searchInfo.pageNo -= 1
        }
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getList()
      }
    },
    //获取列表
    async getList() {
      this.searchInfo.startTime =
        this.timeList.length > 0 ? this.timeList[0] : null
      this.searchInfo.lastTime =
        this.timeList.length > 0 ? this.timeList[1] : null
      const res = await getList(this.searchInfo)
      if (res.code === 200) {
        this.tableList = res.data.list
        this.total = res.data.total
      }
    },

    handleCurrentChange(page) {
      this.searchInfo.pageNo = page
      this.getList()
    },

    closeSetting(val) {
      if (val) {
        if (val[0] === 1) {
          this.getList()
        }
        this.showSetting = false
        this.rowInfo = null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dateRange {
  .el-time-panel {
    // width: 9.8125rem;
    background: red !important;
  }
}
</style>
<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.chrOrderSea {
  .tableBox {
    background-color: #fff;
    border-radius: 4px;
    min-height: calc(100vh - 150px);
    margin: 10px 0;
    overflow: auto;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 20px;
      padding: 15px 20px;
      .title {
        display: flex;
        align-items: center;

        .name {
          font-size: 16px;
          color: $mainTextColor;
        }
      }
      .options {
        margin-top: -10px;
      }
    }
    .table {
      padding: 0 15px 15px 15px;
      .pagination {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
      }
    }
    .box {
      display: inline-block;
      width: 25px;
      height: 10px;
      background-color: #999;
      margin-right: 2px;
    }
    .flexbox {
      height: 110px;
      display: flex;
      /* align-items: center; */
      flex-direction: column;
      justify-content: center;
    }
  }
  .formContent {
    display: flex;
    margin-bottom: 10px;
  }
  .formList {
    flex: 1;
    max-width: 49%;
    main-width: 49%;
  }
}
::v-deep .el-time-panel {
  width: 9.375rem !important;
}
</style>
