<template>
  <!--历史告警-->
  <div class="chrOrderSea">
    <!-- search box -->
    <div class="card">
      <el-form
        ref="searchConf"
        :model="searchConf"
        size="small"
        label-width="100px"
      >
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item label="通信协议">
              <el-select
                v-model="searchConf.commProtocol"
                clearable
                placeholder="请选择通信协议"
                @change="changeType"
              >
                <el-option
                  v-for="item in siteList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="告警类型">
              <el-select
                v-model="searchConf.alarmType"
                clearable
                placeholder="请选择告警类型"
                @change="changeTitle"
              >
                <el-option
                  v-for="item in alarmTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="告警名称">
              <el-select
                v-model="searchConf.alarmTitle"
                clearable
                filterable
                :placeholder="
                  searchConf.alarmType ? '请选择告警名称' : '请先选择告警级别'
                "
              >
                <el-option
                  v-for="item in alarmTitleSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div class="orgList">
             <el-form-item label="所属组织机构">
              <treeselect
                v-model="searchConf.oriDepartId"
                :default-expand-level="1"
                :options="deptOptions"
                :normalizer="normalizer"
                placeholder="选择所属组织机构"
              />
            </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item label="车牌号">
              <el-select
                v-model="searchConf.plateNo"
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
            <el-form-item label="告警时间">
              <el-date-picker
                popper-class="dateRange"
                v-model="timeList"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy:MM:dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" align="right">
            <el-button type="primary" @click="getList">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- table box-->
    <div class="tableBox">
      <div class="top">
        <div class="title">
          <div class="name">历史告警列表</div>
        </div>
        <div class="options">
          <el-button @click="exportOrder" class="btn" :loading="showLoading"
            ><i class="iconfont icon-daochu" /> 导出</el-button
          >
        </div>
      </div>
      <div class="table">
        <el-table
          :data="tableList"
          :header-cell-style="tableHeaderStyle"
          border
          style="width: 100%"
        >
          <el-table-column
            align="center"
            width="50"
            fixed="left"
            label="序号"
            type="index"
          />
          <el-table-column
            fixed="left"
            width="160"
            prop="plateNo"
            label="车牌号"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            width="180"
            prop="deviceName"
            label="车辆名称"
            align="center"
          >
            <template slot-scope="scope">
              <!-- <el-link type="primary" :underline="false"> -->
              <div class="alarmTitle">
                {{ scope.row.deviceName }}
              </div>
              <!-- </el-link> -->
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            prop="commProtocol"
            label="通信协议"
            align="center"
          >
          </el-table-column>
          <el-table-column
            width="160"
            prop="deviceVin"
            label="车辆VIN"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            width="200"
            prop="terminalNo"
            label="外接终端编号"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div style="color: #fff;">
                {{ scope.row.terminalNo }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            width="160"
            prop="alarmType"
            label="告警类型"
            show-overflow-tooltip
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="toAlarmDetail(scope.row)">{{
                scope.row.alarmType
                  ? dictInfo.alarmTypeObj[scope.row.alarmType]
                  : null
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            width="80"
            prop="alarmTitle"
            label="告警名称"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            width="90"
            prop="treatNeasures"
            label="处理措施"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            width="180"
            prop="occurTime"
            show-overflow-tooltip
            label="首次告警发生时间"
            align="center"
          >
          </el-table-column>
          <el-table-column
            width="180"
            prop="lastTime"
            show-overflow-tooltip
            label="告警结束时间"
            align="center"
          >
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="tableList.length > 0">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchConf.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="searchConf.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 告警详情 -->
    <div v-if="showAlarmDetail">
      <el-dialog
        v-dialogDrag
        :visible.sync="showAlarmDetail"
        @closed="closeDialog"
        width="60%"
        title="告警信息"
      >
        <alarm-detail :alarmTitle="alarmTitle" @closeDialog="closeDialog" />
        <div slot="footer">
          <el-button @click="closeDialog">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 所属组织机构
import { getOrganization } from '@/api/asset/charggroupinfo'
import {
  getAlarmTypeByComm,
  getAlarmTitleByType, //获取告警名称
  getCarNumberByOrg //车牌号
} from '@/api/alarm/caralarm/monitoringcenter'
import { getList, getExprot } from '@/api/alarm/caralarm/historicalalarm'
import { listChargGroupCode } from '@/api/alarm/alarmmonitorcenter.js'
import { getChargingInfo } from '@/api/alarm/faultalarmBase.js'
import { getAlarmTitle } from '@/api/alarm/celve.js'
import { getChargeBySite } from '@/api/alarm/faultalarmBase.js'
import { mapGetters } from 'vuex'
import { streamToExcel } from '@/utils/utils'
import AlarmDetail from './alarmDetail.vue'
export default {
  components: { AlarmDetail },
  data() {
    return {
      showLoading: false,
      listChargGroupCode: [],
      searchConf: {
        commProtocol: null, // 通信协议
        alarmType: null, // 告警类型
        plateNo: null, //车牌号
        oriDepartId: null, // 开始时间
        alarmTitle: null,
        startTime: null,
        lastTime: null,
        pageSize: 10,
        pageNo: 1
      },
      timeList: [],
      total: 0,
      tableList: [], //table表格数组
      ChargingInfoSelect: [], // 充电设备列表
      alarmTitleSelect: [], //告警名称
      showAlarmDetail: false,
      alarmTitle: null,
      happenTimes: [],
      // 所属组织机构
      deptOptions: [],
      alarmTypeList: [],
      siteList: [], //通信协议
      levelList: [] //车牌号列表
    }
  },
  computed: {
    ...mapGetters(['dictInfo'])
  },
  watch: {
    'searchConf.oriDepartId'(newVal, oldVal) {
      if (newVal === null || newVal === undefined) {
        return false
      } else {
        getCarNumberByOrg({
          id: this.searchConf.oriDepartId
        }).then((res) => {
          this.levelList = res.data
        })
      }
    }
  },
  created() {
    this.getList()
    this.getOrganization()
    this.siteList = this.dictInfo.commProtocol
  },
  methods: {
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
    // 请求告警类型
    changeType(e) {
      const obj = {}
      obj.protocolVersion = e
      getAlarmTypeByComm(obj).then((res) => {
        this.alarmTypeList = res.data
      })
    },
    // 请求告警名称
    changeTitle(e) {
      getAlarmTitleByType({ alarmType: e }).then((res) => {
        this.alarmTitleSelect = res.data
      })
    },
    //充电设备查询
    async fetchChargingInfos(data) {
      const res = await getChargeBySite(data)
      if (res.code == 200) {
        this.ChargingInfoSelect = res.data
      }
    },

    severityClick(val) {
      this.alarmTitleSelect = []
      if (val) {
        this.getAlarmTitle(val)
      }
    },
    //获取告警名称
    async getAlarmTitle(val) {
      const res = await getAlarmTitle({ alarmSeverity: val })
      if (res.code == 200) {
        this.alarmTitleSelect = res.data
      }
    },

    toSearch() {
      this.searchConf.pageNo = 1
      this.getList()
    },

    toAlarmDetail(row) {
      this.alarmTitle = row.alarmTitle
      this.showAlarmDetail = true
    },

    closeDialog() {
      this.alarmTitle = null
      this.showAlarmDetail = false
    },

    //充电设备查询
    async getChargingInfos() {
      const res = await getChargingInfo()
      if (res.code == 200) {
        this.ChargingInfoSelect = res.data
      }
    },

    async getList() {
      this.searchConf.startTime =
        this.timeList.length > 0 ? this.timeList[0] : null
      this.searchConf.lastTime =
        this.timeList.length > 0 ? this.timeList[1] : null
      const res = await getList(this.searchConf)
      if (res.code === 200) {
        this.tableList = res.data.list
        this.total = res.data.total
      }
    },

    //获取网点
    async getName() {
      const res = await listChargGroupCode()
      if (res.code === 200) {
        this.siteList = res.data
      }
    },

    handleCurrentChange(page) {
      this.searchConf.pageNo = page
      this.getList()
    },

    handleSizeChange(pageSize) {
      this.searchConf.pageNo = 1
      this.searchConf.pageSize = pageSize
      this.getList()
    },

    resetSearch() {
      this.searchConf = {
        commProtocol: null, // 通信协议
        alarmType: null, // 告警类型
        plateNo: null, //车牌号
        oriDepartId: null, // 开始时间
        alarmTitle: null,
        startTime: null,
        lastTime: null,
        pageSize: 10,
        pageNo: 1
      }
      this.timeList = []
    },

    //excel导出功能
    async exportOrder() {
      this.showLoading = true
      const rsp = await getExprot(this.searchConf)
      if (rsp) {
        streamToExcel(rsp, '车辆原始报文')
        this.$message({
          type: 'success',
          message: '导出成功'
        })
      } else {
        this.$message({
          type: 'error',
          message: '导出失败'
        })
      }
      this.showLoading = false
    }
  }
}
</script>
<style lang="scss">
.alarmTitle {
  width: 160px;
  margin: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.chrOrderSea {
  .tableBox {
    background-color: #fff;
    border-radius: 4px;
    min-height: calc(100vh - 312px);
    margin: 10px 0;
    overflow: auto;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // margin-right: 20px;
      padding: 15px 20px;
      .title {
        display: flex;
        align-items: center;
        .name {
          font-size: 16px;
          color: $mainTextColor;
        }
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
    .btnBox a {
      display: inline-block;
      width: 50%;
      text-align: center;
    }
    .flexbox {
      height: 110px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}
</style>
