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
            <el-form-item label="所属组织机构">
              <treeselect
                v-model="searchConf.oriDepartId"
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
                v-model="searchConf.carNumber"
                clearable
                filterable
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
          <el-col :span="6">
            <el-form-item label="通信协议">
              <el-select
                v-model="searchConf.commProtocol"
                clearable
                placeholder="请选择通信协议"
                @change="getcommandCode"
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
            <el-form-item label="命令标识">
              <el-select
                v-model="searchConf.commandCode"
                clearable
                placeholder="请选择命令标识"
              >
                <el-option
                  v-for="item in commandCodeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="信息类型">
              <el-select
                v-model="searchConf.alarmTitle"
                clearable
                filterable
                placeholder="请选择信息类型"
              >
                <el-option
                  v-for="item in alarmTitleSelect"
                  :key="item.alarmCode"
                  :label="item.alarmTitle"
                  :value="item.alarmTitle"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报警标识">
              <el-select
                v-model="searchConf.alarmType"
                clearable
                placeholder="请选择报警标识"
              >
                <el-option
                  v-for="item in dictInfo.alarmType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="告警时间">
              <el-date-picker
                popper-class="dateRange"
                v-model="happenTimes"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy:MM:dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12" align="right">
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
          <div class="name">原始报文日志</div>
        </div>
        <!-- <div class="options">
          <el-button @click="exportOrder" class="btn" :loading="showLoading"
            ><i class="iconfont icon-daochu" /> 导出</el-button
          >
        </div> -->
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
            prop="carNumber"
            label="车牌号"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column prop="protocol" label="通信协议" align="center">
          </el-table-column>
          <el-table-column
            prop="nameCn"
            label="所属组织机构"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="commandCode"
            label="命令标识"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="occurTime"
            label="时间"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="originalMessage"
            label="原始报文"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.originalMessage">
                <el-tooltip popper-class="item" effect="dark" placement="top">
                  <div slot="content">
                    {{ scope.row.originalMessage }}
                    <el-link
                      type="primary"
                      title="复制原始报文"
                      :underline="false"
                      v-clipboard:copy="scope.row.originalMessage"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onError"
                      icon="el-icon-copy-document"
                    ></el-link>
                  </div>
                  <div class="oneLine">{{ scope.row.originalMessage }}</div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="analysisMessage"
            label="解析报文"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.analysisMessage">
                <el-tooltip popper-class="item" effect="dark" placement="top">
                  <div slot="content">
                    {{ scope.row.analysisMessage }}
                    <el-link
                      type="primary"
                      title="复制解析报文"
                      :underline="false"
                      v-clipboard:copy="scope.row.analysisMessage"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onError"
                      icon="el-icon-copy-document"
                    ></el-link>
                  </div>
                  <div class="oneLine">{{ scope.row.analysisMessage }}</div>
                </el-tooltip>
              </div>
            </template>
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
  </div>
</template>

<script>
import {
  getCarNumberByOrg //车牌号
} from '@/api/alarm/caralarm/monitoringcenter'
// 所属组织机构
import { getOrganization } from '@/api/asset/charggroupinfo'
import {
  getList,
  getExprot,
  getCarCommandCode
} from '@/api/alarm/caralarm/originalmessage'
import { getChargingInfo, getChargeBySite } from '@/api/alarm/faultalarmBase.js'
import { getAlarmTitle } from '@/api/alarm/celve.js'
import { mapGetters } from 'vuex'
import { streamToExcel } from '@/utils/utils'
export default {
  data() {
    return {
      siteList: [],
      showLoading: false,
      listChargGroupCode: [],
      searchConf: {
        pageSize: 10,
        pageNo: 1,
        oriDepartId: null,
        carNumber: null,
        commProtocol: null,
        commandCode: null,
        alarmType: null,
        severity: null,
        startTime: null,
        lastTime: null
      },
      timeList: [],
      total: 0,
      levelList: [],
      tableList: [], //table表格数组
      ChargingInfoSelect: [], // 充电设备列表
      alarmTitleSelect: [], //告警名称
      commandCodeList: [], //命令标识
      showAlarmDetail: false,
      alarmTitle: null,
      happenTimes: [],
      // 所属组织机构
      deptOptions: []
    }
  },
  computed: {
    ...mapGetters(['dictInfo'])
  },
  watch: {
    happenTimes() {
      if (this.happenTimes === null) {
        this.happenTimes = []
      }
    },
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
    onCopy() {
      // 复制成功
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    onError() {
      // 复制失败
      this.$message({
        message: '复制失败',
        type: 'error'
      })
    },
    // 获取标识
    getcommandCode(e) {
      getCarCommandCode({ protocol: e }).then((res) => {
        this.commandCodeList = res.data
      })
    },
    // 获取组织机构数据
    getOrganization() {
      getOrganization().then((response) => {
        if (response.code === 200) {
          this.deptOptions = response.data
        }
      })
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
        this.happenTimes.length > 0 ? this.happenTimes[0] : null
      this.searchConf.lastTime =
        this.happenTimes.length > 0 ? this.happenTimes[1] : null
      const res = await getList(this.searchConf)
      if (res.code === 200) {
        this.tableList = res.data.list
        this.total = res.data.total
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
      this.happenTimes = []
      this.searchConf = {
        pageSize: 10,
        pageNo: 1,
        alarmCode: null,
        deviceSite: null,
        deviceName: null,
        deviceNo: null,
        alarmType: null,
        severity: null,
        startTime: null,
        lastTime: null
      }
      this.timeList = []
    },

    //excel导出功能
    async exportOrder() {
      this.showLoading = true
      const rsp = await getExprot(this.searchConf)
      if (rsp && rsp.size > 0) {
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
.oneLine {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
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
::v-deep .el-form-item--small .el-form-item__content {
  line-height: 30px;
}
</style>
