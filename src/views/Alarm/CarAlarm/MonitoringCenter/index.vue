<template>
  <div class="chrOrderSea">
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
                  searchConf.alarmType ? '请选择告警名称' : '请先选择告警类型'
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
                v-model="happenTimes"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy:MM:dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" align="right">
            <el-button type="primary" @click="toSearch">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- table box-->
    <div class="tableBox">
      <div class="top">
        <div class="title">
          <div class="name">告警事件信息总览</div>
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
            label="序号"
            align="center"
            type="index"
            width="50"
            fixed
          >
          </el-table-column>
          <el-table-column
            fixed
            prop="plateNo"
            label="车牌号"
            width="180"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="deviceName"
            label="车辆名称"
            width="150"
            align="center"
            fixed
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="commProtocol"
            label="通信协议"
            width="180"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="deviceVin"
            label="车辆VIN"
            width="200"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column
            prop="terminalNo"
            label="外接终端编号"
            width="180"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="alarmType"
            label="告警类型"
            width="120"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{
                scope.row.alarmType
                  ? dictInfo.alarmTypeObj[scope.row.alarmType]
                  : null
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="alarmTitle"
            label="告警名称"
            width="100"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-button type="text" @click="toAlarmDetail(scope.row)">
                {{ scope.row.alarmTitle }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="treatNeasures"
            label="处理措施"
            width="100"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="occurTime"
            label="首次告警发生时间"
            width="180"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="lastTime"
            label="告警结束时间"
            width="180"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-link
                :underline="false"
                @click="handleDelete(scope.row)"
                type="primary"
                style="margin-right: 10px;"
                >清除</el-link
              >
              <el-link
                :underline="false"
                type="primary"
                style="margin-right: 10px;"
                @click="toMessage(scope.row)"
                >查询报文</el-link
              >
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
    <!-- 告警详信息 -->
    <div v-if="showAlarmDetail">
      <el-dialog
        v-dialogDrag
        :visible.sync="showAlarmDetail"
        @closed="closeDialog"
        width="60%"
        title="告警详情"
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
import { mapGetters } from 'vuex'
// 所属组织机构
import { getOrganization } from '@/api/asset/charggroupinfo'
import {
  getAlarmTypeByComm,
  getExprot, //导出
  clearClearAway,
  getList, //列表
  getAlarmTitleByType, //获取告警名称
  getCarNumberByOrg //车牌号
} from '@/api/alarm/caralarm/monitoringcenter'
import { streamToExcel } from '@/utils/utils'
import AlarmDetail from './alarmDetail.vue'
export default {
  components: {
    AlarmDetail
  },
  data() {
    return {
      showLoading: false,
      dialogShow: false, //控制弹出框是否弹出
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
      // 所属组织机构
      deptOptions: [],
      alarmTypeList: [],
      total: 0,
      rowInfo: null,
      happenTimes: [], // 发生时间
      siteList: [], //通信协议
      levelList: [], //车牌号列表
      alarmTitleSelect: [],
      tableList: [], //table表格数组
      showAlarmDetail: false,
      alarmTitle: null
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'dictInfo'])
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
    this.getOrganization()
    this.searchConf.plateNo = this.$route.query.plateNo || null
    this.searchConf.orgId = this.$route.query.orgId || null
    this.siteList = this.dictInfo.commProtocol
    this.getList()
  },
  methods: {
    handleSizeChange(pageSize) {
      this.searchConf.pageNo = 1
      this.searchConf.pageSize = pageSize
      this.getList()
    },
    toSearch() {
      this.searchConf.pageNo = 1
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
    // 请求告警类型
    changeType(val) {
    this.alarmTypeList = []
    if(val) {
      const obj = {
        protocolVersion: val
      }
      getAlarmTypeByComm(obj).then((res) => {
        this.alarmTypeList = res.data
      })
      }
    },
    // 请求告警名称
    changeTitle(e) {
      getAlarmTitleByType({ alarmType: e }).then((res) => {
        this.alarmTitleSelect = res.data
      })
    },
    toSendorder(row) {
      this.rowInfo = row
      this.dialogShow = true
    },
    //关闭弹出框
    closeView() {
      this.dialogShow = false
      this.getList()
    },
    //告警清除
    handleDelete(val) {
      this.$confirm('是否清除所选告警信息', '提示', {
        confirmButtonText: '确定',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const res = await clearClearAway({
            recordId: val.recordId
          })
          if (res.code == 200) {
            this.msgSuccess(res.message)
            this.getList()
          }
        })
        .catch(() => {})
    },
    // 历史报文
    toMessage(row) {
      this.$store.commit('settings/changeSiderMenuIndex','/CarAlarm/OriginalMessage')
      this.$router.push('/airweb/CarAlarm/OriginalMessage')
    },

    toAlarmDetail(row) {
      this.alarmTitle = row.alarmTitle
      this.showAlarmDetail = true
    },

    closeDialog() {
      this.alarmTitle = null
      this.showAlarmDetail = false
    },

    //excel导出功能
    async exportOrder() {
      this.showLoading = true
      const aa = {
        alarmCode: null
      }
      const rsp = await getExprot(aa)
      // const rsp = await getExprot(this.searchConf)
      if (rsp && rsp.size > 0) {
        streamToExcel(rsp, '车辆告警事件')
        this.$message({
          type: 'success',
          message: '导出成功'
        })
      }else {
         this.$message({
          type: 'error',
          message: '导出失败'
        })
      }
      this.showLoading = false
    },

    //分页点击得方法
    handleCurrentChange(page) {
      this.searchConf.pageNo = page
      this.getList()
    },


    //获取实时告警列表
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
    //清空检索框数据得方法
    resetSearch() {
      this.searchConf = {
        commProtocol: null, // 通信协议
        alarmType: null, // 告警类型
        plateNo: null, //车牌号
        oriDepartId: null,
        alarmTitle: null,
        startTime: null,
        lastTime: null,
        pageSize: 10,
        pageNo: 1
      }
      this.happenTimes = []
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
      margin-right: 20px;
      padding: 15px 0 0 20px;
      .title {
        display: flex;
        align-items: center;

        .sign {
          width: 7px;
          height: 20px;
          background: #18bbda;
          margin-right: 8px;
        }
        .name {
          font-size: 16px;
          color: #666666;
        }
      }
      .options {
        margin-bottom: 8px;
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
// ::v-deep .el-input__inner {
//   width: 12.5rem;
// }
// ::v-deep.el-select {
//   width: 12.5rem;
// }
</style>
