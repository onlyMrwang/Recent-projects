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
          <el-col :span="8">
            <el-form-item label="接入平台">
              <el-select
                v-model="searchInfo.accessPlatform"
                clearable
                placeholder="请选择接入平台"
              >
                <el-option
                  v-for="item in levelList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="通信协议类型">
              <el-select
                v-model="searchInfo.protocolType"
                filterable
                clearable
                placeholder="请选择协议类型"
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
          <el-col :span="8">
            <el-form-item label="操作类型">
              <el-select
                v-model="searchInfo.behavior"
                filterable
                clearable
                placeholder="操作类型"
              >
                <el-option
                  v-for="item in operationType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作时间">
              <el-date-picker
                popper-class="dateRange"
                v-model="happenTimes"
                type="datetimerange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy:MM:dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" align="right">
            <el-button type="primary" @click="searClick">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- table box-->
    <div class="tableBox">
      <div class="top">
        <div class="title">
          <!-- <div class="sign"></div> -->
          <div class="name">平台操作日志</div>
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
            fixed
            prop="accessPlatform"
            label="接入平台"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="accessIp"
            label="接入IP"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column
            prop="accessPost"
            label="接入端口"
            align="center"
            show-overflow-tooltip
          >
            <!-- <template slot-scope="scope">
              {{ dictInfo.alarmTypeObj[scope.row.alarmType] }}
            </template> -->
          </el-table-column>
          <el-table-column
            prop="protocolType"
            label="通信协议类型"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="behavior"
            label="行为"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="operationTime"
            label="操作时间"
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
            :current-page="searchInfo.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="searchInfo.pageSize"
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
import { getList } from '@/api/alarm/caralarm/platformoperationlogs'
import { stopWledgeConfig, clertList } from '@/api/alarm/faultalarmBase'
import { getAlarmTitle } from '@/api/alarm/celve'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      happenTimes: [],
      titles: '',
      total: 0,
      subType: 1,
      searchInfo: {
        alarmSeverity: null,
        alarmTitle: null,
        pageNo: 1,
        pageSize: 10
      },
      alarmList: [],
      levelList: [],
      operationType: [
        { value: '登入', label: '登入' },
        { value: '登出', label: '登出' },
        { value: '补报', label: '补报' }
      ],
      siteList: [],
      tableList: [], //table表格列表数组
      showSetting: false, //弹出框得显示隐藏
      rowInfo: null
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
    }
  },
  created() {
    this.levelList = this.dictInfo.accessPlatform
    this.siteList = this.dictInfo.accessCommProtocol
    this.getList()
  },
  methods: {
    handleSizeChange(pageSize) {
      this.searchInfo.pageNo = 1
      this.searchInfo.pageSize = pageSize
      this.getList()
    },
    // 修改确定
    submit() {
      this.cancel()
    },
    // 取消
    cancel() {
      this.showSetting = false
    },
    // severityClick(val) {
    //   this.alarmList = []
    //   this.searchInfo.alarmTitle = null
    //   if (val) {
    //     this.fetchAlarmTitle(val)
    //   }
    // },

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
      this.happenTimes = []
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

    handleStatus(val) {
      if (val.validTag == 1) {
        this.$confirm('是否确定停用该告警', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          center: true
        })
          .then(() => {
            this.stopList(val)
          })
          .catch(() => {})
      } else {
        this.stopList(val)
      }
    },

    //停启用告警知识库
    async stopList(val) {
      val.validTag = val.validTag == 1 ? 0 : 1
      const res = await stopWledgeConfig(val)
      if (res.code == 200) {
        this.$message({
          message: val.validTag == 1 ? '停用成功' : '启用成功',
          type: 'success'
        })
        this.getList()
      }
    },

    //获取实时告警列表
    async getList() {
      this.searchInfo.startTime =
        this.happenTimes.length > 0 ? this.happenTimes[0] : null
      this.searchInfo.lastTime =
        this.happenTimes.length > 0 ? this.happenTimes[1] : null
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
</style>
