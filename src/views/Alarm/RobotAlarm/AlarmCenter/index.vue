<template>
  <div class="chrOrderSea">
    <div class="card">
      <el-form
        size="small"
        label-width="120px" 
      >
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item label="充电网点">
              <el-select
                v-model="searchConf.deviceSite"
                clearable
                @change="changeSite"
                placeholder="请选择充电网点"
              >
                <el-option
                  v-for="item in siteList"
                  :key="item.chargGroupId"
                  :label="item.chargGroupName"
                  :value="item.chargGroupId"
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
                placeholder="请选择充电机器人名称"
              >
                <el-option
                  v-for="item in robotList"
                  :key="item.assetNum"
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
                placeholder="请输入充电机器人编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="告警类型">
              <el-select
                v-model="searchConf.alarmType"
                clearable
                placeholder="请选择告警类型"
              >
                <el-option
                  v-for="item in dictInfo.robotAlarmType"
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
          <el-col :span="12">
            <el-form-item label="首次告警时间">
              <el-date-picker
                popper-class="dateRange"
                v-model="happenTimes"
                type="datetimerange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="告警级别">
              <el-select
                v-model="searchConf.severity"
                @change="severityClick"
                clearable
                placeholder="请选择告警级别"
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
          <el-col :span="6">
           <el-form-item label="告警名称" prop="alarmTitle">
            <el-select
              v-model="searchConf.alarmTitle"
              filterable
              clearable
              :placeholder="searchConf.severity ? '请选择告警名称' : '请先选择告警级别'"
            >
              <el-option
                v-for="item in alarmList"
                :key="item.alarmCode"
                :label="item.alarmTitle"
                :value="item.alarmTitle"
              >
              </el-option>
            </el-select>
          </el-form-item>
          </el-col> 
         
        </el-row>
        <el-row :gutter="5">
          <el-col
            :span="24"
            style="text-align: right;margin-bottom: 15px;"
          >
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
          <div class="name">告警监控中心</div>
        </div>
        <div class="options">
          <el-button @click="exportAlarm" :loading="showLoading"
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
            fixed
            prop="chargGroupName"
            label="充电网点"
            width="160"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="deviceNo"
            label="充电机器人编号"
            width="180"
            align="center"
            fixed
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="deviceName"
            label="充电机器人名称"
            width="180"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="poleNo"
            label="对应设备编号"
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
              {{Number(scope.row.alarmType) > 0 ? dictInfo.robotAlarmTypeObj[scope.row.alarmType] : null}}
          </template>
          </el-table-column>
          <el-table-column
            prop="alarmTitle"
            label="告警标题"
            width="180"
            align="center"
            show-overflow-tooltip
          >
          <template slot-scope="scope">
            <el-link type="primary" :underline="false">
             <div class="alarmTitle" @click="toAlarmDetail(scope.row)">{{scope.row.alarmTitle}}</div>
            </el-link>
          </template>
          </el-table-column>
          <el-table-column
            prop="count"
            label="告警计数(次)"
            width="120"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="treatProgram"
            label="处理方案"
            width="200"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="首次告警时间"
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
            prop="homingTag"
            label="车辆位置是否合适"
            width="180"
            align="center"
            show-overflow-tooltip
          >
          <template slot-scope="scope">
            {{scope.row.homingTag == 1 ? '合适' : '不合适' }}
          </template>
          </el-table-column>
          <el-table-column
            prop="dispStatus"
            label="派单结果"
            width="120"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.dispStatus === 0 ? "未派单" : '已派单' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="dispTime"
            label="派单时间"
            width="160"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
           <el-table-column
              prop="severity"
              label="告警等级"
              width="136"
              align="center"
              fixed="right"
              show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div class="severity" v-if="scope.row.severity === 1">
                <div class="severityItem item1"></div>
                <div class="severityItem">
                  <div class="robotji">{{levelObj[scope.row.severity]}}</div>
                </div>
              </div>
              <div class="severity" v-if="scope.row.severity === 2">
                <div class="severityItem"></div>
                <div class="severityItem item2">
                  <div class="robotji">{{levelObj[scope.row.severity]}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="230"
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
                    :disabled="scope.row.dispStatus === 1"
                    @click="toSendorder(scope.row)"
                    style="margin-right: 10px;"
                    >派单</el-link>
                      <el-link
                    :underline="false"
                    type="primary"
                    style="margin-right: 10px;"
                    @click="toReset(scope.row)"
                    >复位</el-link
                  >
                  <el-link
                    :underline="false"
                    type="primary"
                    style="margin-right: 10px;"
                    @click="toMessage(scope.row)"
                    >查询报文</el-link
                  >
              <!-- <div style="display: flex;">
                <div class="btnBox">
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
                    @click="toSendorder(scope.row)"
                    style="margin-right: 10px;"
                    >派单</el-link
                  >
                </div>
                <div class="btnBox">
                  <el-link
                    :underline="false"
                    type="primary"
                    style="margin-right: 10px;"
                    @click="toReset(scope.row)"
                    >复位</el-link
                  >
                  <el-link
                    :underline="false"
                    type="primary"
                    style="margin-right: 10px;"
                    @click="toMessage(scope.row)"
                    >查询报文</el-link
                  >
                </div>
              </div> -->
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
   
    <div v-if="dialogShow">
    <el-dialog
            v-dialogDrag
            :visible.sync="dialogShow"
            @closed="closeView"
            width="50%"
            title="告警派单"
    >
      <SendOrders
              :siteList="siteList"
              :rowInfo="rowInfo"
              @closeView="closeView" @freshList="getList">
      </SendOrders>
    </el-dialog>
    </div>

     <!-- 告警详情 -->
    <div v-if="showAlarmDetail">
         <el-dialog
            v-dialogDrag
            :visible.sync="showAlarmDetail"
            @closed="closeDialog"
            width="60%"
            title="告警详情"
    >
        <alarm-detail :alarmTitle="alarmTitle" @closeDialog="closeDialog"/>
    </el-dialog>
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { listChargGroupCode } from "@/api/alarm/alarmmonitorcenter"
import { getRobotAlarmList, exportRobotAlarmList, robotReset, clearRobotAlarm } from '@/api/alarm/robot/alarm'
import { getRobot } from '@/api/asset/chargingrobot'
import { getAlarmTitle } from "@/api/alarm/celve"
import { streamToExcel } from '@/utils/utils'
import SendOrders from './SendOrders'
import AlarmDetail from './alarmDetail.vue'
import moment from 'moment'
  export default {
    components:{
      SendOrders, AlarmDetail
  },
  data() {
    return {
      dialogType: false, //控制弹出框是否弹出
      searchConf: {
        deviceSite: null, // 网点
        deviceName: null, // 设备名称
        deviceNo: null, // 设备编码
        severity: null, // 告警级别
        startTime: null, // 开始时间
        lastTime: null, // 结束时间
        alarmTitle: null, // 告警名称
        pageSize: 10,
        pageNo: 1,
      },
      happenTimes: [], // 发生时间
      siteList: [],
      total: 0,
      showLoading: false,
      dialogShow: false,
      levelList: [
        { label: "1级", value: "1" },
        { label: "2级", value: "2" },
      ],
      levelObj: {
        1: '1级',
        2: '2级',
      },
      alarmList: [], //告警名称列表
      tableList: [], //table表格数组
      rowInfo: null,
      robotList: [],
      showAlarmDetail: false,
      alarmTitle: null,
    };
  },
  computed: {
    ...mapGetters(["userInfo", "dictInfo"]),
  },
  created() {
    this.getName(); //获取充电网点
    this.searchConf.severity = this.$route.query.type || null
    this.searchConf.deviceName = this.$route.query.robotName || null
    this.searchConf.deviceNo = this.$route.query.robotNo || null
    if(this.$route.query.startTime && this.$route.query.endTime) {
      this.happenTimes = [new Date(this.$route.query.startTime), new Date(this.$route.query.endTime)]
    }
    this.getList();
  },
  methods: {
    toSendorder(row) {
      this.rowInfo = JSON.parse(JSON.stringify(row))
      this.dialogShow =  true;
    },
    //关闭弹出框
    closeView() {
      this.dialogShow = false;
    },
    //告警清除
    handleDelete(val) {
      this.$confirm("是否确定清楚该告警事件", "提示", {
        confirmButtonText: "确定",
        type: "warning",
        center: true,
      }).then(async () => {
        const res = await clearRobotAlarm({
          recordId: val.recordId,
        });
        if (res.code == 200) {
          this.msgSuccess('清除成功')
          this.getList();
        }
      })
    },
    
    // 切换网点
    changeSite(val) { 
      this.searchConf.deviceName = null
      this.robotList = []
      if(val) {
        this.fetchRobotList(val)
      }
    },
    
    // 切换机器人
    changeRobot(val) {
      this.searchConf.deviceNo = null
      if(val) {
        const arr = this.robotList.filter(item => item.robotName === val)
        if(arr.length > 0) {
          this.searchConf.deviceNo = arr[0].assetNum
        }
      }
    },

   async fetchRobotList(val) {
     const data = {
       pageNo: 1,
       pageSize: 1000,
       chargGroupId: val
     }
     const rsp = await getRobot(data)
     if(rsp.code === 200) {
        this.robotList = rsp.data.result
     }
   },

  toAlarmDetail(row) {
      this.alarmTitle = row.alarmTitle
      this.showAlarmDetail = true
    },

    closeDialog() {
      this.alarmTitle = null
      this.showAlarmDetail = false
    },

   // 复位
    toReset(row) {
      this.$confirm("机器人复位是否确定继续操作", "提示", {
        confirmButtonText: "确定",
        type: "warning",
        center: true,
      }).then(async () => {
         const data = {
            robotName: row.deviceName,
            robotId: row.deviceNo,
            chargId: row.poleNo,
            chargGroupName: row.deviceSite
          }
          const rsp = await robotReset(data)
          if(rsp.code === 200) {
            this.$message({
              type: 'success',
              message: '机器人复位成功'
            })
            this.getList()
          }
      })
   },
    // 历史报文
    toMessage(row) {
      const data = {
        msgCode: '1003',
        startTime: row.startTime,
        lastTime: row.lastTime,
        deviceName: row.deviceName,
      }
        let routeUrl = this.$router.resolve({
        path: "/airweb/robotLogs/robotOriginLog",
        query: data
      });
      window.open(routeUrl.href, '_blank');
    },

    async exportAlarm() {
      this.showLoading = true;
      const rsp = await exportRobotAlarmList(this.searchConf)
       if(rsp && rsp.size > 0) {
          streamToExcel(rsp, '充电机器人告警')
          this.$message({
            type: 'success',
            message: '导出成功'
          })
      }
      this.showLoading = false 
    },

    handleCurrentChange(page) {
      this.searchConf.pageNo = page;
      this.getList();
    },
    handleSizeChange(pageSize) {
      this.searchConf.pageSize = pageSize
      this.searchConf.pageNo = 1
      this.getList()
    },

    // 获取实时告警列表
    async getList() {
       if(this.happenTimes?.length > 0) {
        if(this.$route.query.startTime && this.$route.query.endTime) {
          this.searchConf.startTime = moment(this.happenTimes[0]).format('YYYY-MM-DD HH:mm:ss')
          this.searchConf.lastTime = moment(this.happenTimes[1]).format('YYYY-MM-DD HH:mm:ss') 
        }else {
          this.searchConf.startTime = this.happenTimes[0]
          this.searchConf.lastTime = this.happenTimes[1]
        }
        
      }else {
         this.searchConf.startTime = null
        this.searchConf.lastTime =  null
      }
      const res = await getRobotAlarmList(this.searchConf);
      if (res.code === 200) {
        this.tableList = res.data.list;
        this.total = res.data.total
      }
    },

    // 获取网点下拉数据
    async getName() {
      const res = await listChargGroupCode();
      if (res.code === 200) {
         this.siteList = res.data;
         if(this.$route.query.siteName) {
          const arr = res.data.filter(item => item.chargGroupName === this.$route.query.siteName)
          if(arr.length > 0) {
            this.searchConf.deviceSite = arr[0].chargGroupId
            this.fetchRobotList(arr[0].chargGroupId)
          }
        }
      }
    },

    // 告警等级点击事件
    severityClick(val) {
      this.alarmList = []
      this.searchConf.alarmTitle = null
      if (val) {
        this.fetchAlarmTitle(val);
      }
    },

    // 获取告警名称
    async fetchAlarmTitle(val) {
      const res = await getAlarmTitle({ alarmSeverity: val, type: 3 });
      if (res.code == 200) {
        this.alarmList = res.data;
      }
    },

    resetSearch() {
      this.searchConf = {
        deviceSite: null, // 网点
        deviceName: null, // 设备名称
        deviceNo: null, // 设备编码
        severity: null, // 告警级别
        startTime: null, // 开始时间
        lastTime: null, // 结束时间
        alarmTitle: null, // 告警名称
        pageSize: 10,
        pageNo: 1,
      },
      this.happenTimes = [];
    },
  },
};
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
      width: 80%;
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
