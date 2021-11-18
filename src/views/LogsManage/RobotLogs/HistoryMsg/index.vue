<template>
  <div class="chrOrderSea">
    <!-- search box -->
    <div class="card">
      <el-form
        ref="searchConf"
        :model="searchConf"
        size="small"
        label-width="120px"
      >
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item label="充电网点">
              <el-select
                v-model="searchConf.chargGroupName"
                clearable
                @change="changeSite"
                placeholder="请选择充电网点"
              >
                <el-option
                  v-for="item in siteList"
                  :key="item.chargGroupId"
                  :label="item.chargGroupName"
                  :value="item.chargGroupName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="充电机器人名称">
               <el-select
                v-model="searchConf.deviceName"
                clearable
                @change="changeRobot"
                :placeholder="searchConf.chargGroupName ? '请选择充电机器人名称' : '请先选择充电网点'"
              >
                <el-option
                  v-for="item in robotList"
                  :key="item.robotId"
                  :label="item.robotName"
                  :value="item.robotName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="充电机器人编号">
              <el-input
                v-model="searchConf.deviceNo"
                clearable
                placeholder="请输入充电机器人编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报文命令码">
              <el-select
                v-model="searchConf.commandCode"
                clearable
                placeholder="请选择报文命令码"
              >
                <el-option
                  v-for="item in dictInfo.commandCodeRobot"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="9">
            <el-form-item label="上报时间">
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
          <el-col :span="15" style="text-align: right;">
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
          <div class="name">原始报文日志</div>
        </div>
        <div class="options">
         <!-- <el-button  @click="exportMsg" :loading="showLoading"><i class="iconfont icon-daochu"/> 导出</el-button> -->
        </div>
      </div>
      <div class="table">
        <el-table
          :header-cell-style="tableHeaderStyle"
          :data="tableList"
          border
          style="width: 100%"
        >
          <el-table-column
            fixed="left"
            prop="deviceNo"
            label="机器人编号"
            width="160"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="deviceName"
            label="机器人名称"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
           <el-table-column
            prop="deviceName"
            label="对应充电设备名称"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
           <el-table-column
            prop="gunNo"
            label="枪号"
            width="100"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="commandCode"
            label="报文命令码"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="indbTime"
            label="上报时间"
            align="center"
            show-overflow-tooltip
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
              <div slot="content">{{scope.row.originalMessage}} 
                <el-link
                type="primary"
                title="复制原始报文"
                :underline="false"
                v-clipboard:copy="scope.row.originalMessage"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                icon="el-icon-copy-document"
                ></el-link
              >
              </div>
              <div class="oneLine">{{scope.row.originalMessage}}</div>
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
            <el-tooltip  popper-class="item" effect="dark" placement="top">
              <div slot="content">{{scope.row.analysisMessage}} 
                <el-link
                type="primary"
                title="复制解析报文"
                :underline="false"
                v-clipboard:copy="scope.row.analysisMessage"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                icon="el-icon-copy-document"
                ></el-link
              >
              </div>
              <div class="oneLine">{{scope.row.analysisMessage}}</div>
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
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { listChargGroupCode } from "@/api/alarm/alarmmonitorcenter"
import { getHistoryMsg, exportHistoryMsg, getRobotList } from '@/api/alarm/robot/alarm'
import { streamToExcel } from '@/utils/utils'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      searchConf: {
        pageSize: 10,
        pageNo: 1,
        chargGroupName: null,
        deviceName: null,
        deviceNo: null,
        ver: null,
        commandCode: null,
        startTime: null,
        endTime: null,
      },
      total: 0,
      showLoading: false,
      siteList: [],
      happenTimes: [],
      tableList: [], 
      commandCodeList: [],
      verList: [],
      robotList: [],
    }
  },
  computed: {
    ...mapGetters(['dictInfo'])
  },
  created() {
    this.searchConf.commandCode = this.$route.query.msgCode || null
    this.searchConf.deviceName = this.$route.query.deviceName || null
    if(this.$route.query.startTime && this.$route.query.lastTime) {
      this.searchConf.startTime = this.$route.query.startTime
      this.searchConf.endTime = this.$route.query.lastTime
      this.happenTimes = [new Date(this.$route.query.startTime), new Date(this.$route.query.lastTime)]
    }
    this.fetchList();
    this.fetchSiteList();
    this.fetchRobotList()
  },
  methods: {
    async fetchList() {
       if(this.happenTimes?.length > 0) {
        this.searchConf.startTime = this.happenTimes[0]
        this.searchConf.endTime =  this.happenTimes[1] 
      }else {
         this.searchConf.startTime = null
        this.searchConf.endTime =  null
      }
      const res = await getHistoryMsg(this.searchConf);
      if (res.code === 200) {
        this.tableList = res.data.list;
        this.total = res.data.total;
      }
    },
    async fetchSiteList() {
      const res = await listChargGroupCode();
      if (res.code === 200) {
        this.siteList = res.data;
      }
    },
    async fetchRobotList(val) {
      const rsp = await getRobotList({chargGroupId: val})
      if(rsp.code === 200) {
        this.robotList = rsp.data.result
      }
    },
    changeSite(val) {
        this.robotList = []
        const arr = this.siteList.filter(item => item.chargGroupName === val)
        if(val) {
          if(arr.length > 0) {
            this.fetchRobotList(arr[0].chargGroupId)
          }
        }  
    },
    // 切换充电机器人
    changeRobot(val) {
      const arr = this.robotList.filter(item => item.robotName === val)
       if(arr.length > 0) {
          this.searchConf.deviceNo = arr[0].assetNum
       } 
    },

    toSearch() {
      this.searchConf.pageNo = 1
      this.fetchList()
    },
    resetSearch() {
      this.searchConf = {
        pageSize: 10,
        pageNo: 1,
        chargGroupName: null,
        deviceName: null,
        deviceNo: null,
        ver: null,
        commandCode: null,
        startTime: null,
        endTime: null,
      }
      this.happenTimes = []
    },

    handleCurrentChange(page) {
      this.searchConf.pageNo = page;
      this.fetchList();
    },
     handleSizeChange(pageSize) {
      this.searchConf.pageNo = 1
      this.searchConf.pageSize = pageSize
      this.fetchList()
    },

     onCopy() {
      // 复制成功
      this.$message({
        message: "复制成功",
        type: "success",
      })
    },
    onError() {
      // 复制失败
      this.$message({
        message: "复制失败",
        type: "error",
      });
    },

  async exportMsg() {
    this.showLoading = true;
    const rsp = await exportHistoryMsg(this.searchConf)
    if(rsp && rsp.size > 0) {
        streamToExcel(rsp, '充电机器人原始报文日志')
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
   }
  }
}
</script>
<style lang="scss">
.el-date-editor .el-range-separator {
  color: #999;
}
</style>
<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.chrOrderSea {
  .tableBox {
    background-color: #fff;
    border-radius: 4px;
    min-height: calc(100vh - 280px);
    margin: 10px 0;
    overflow: auto;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
