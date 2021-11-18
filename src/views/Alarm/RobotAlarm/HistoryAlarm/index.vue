<template>
  <!--历史告警-->
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
                :placeholder="searchConf.deviceSite ? '请选择充电机器人名称' : '请先选择充电网点'"
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
                clearable
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
            <el-form-item label="清除时间">
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
           <el-col :span="6">
            <el-form-item label="告警级别" prop="severity">
              <el-select
                v-model="searchConf.severity"
                clearable
                @change="severityClick"
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
            <el-form-item label="告警名称">
              <el-select
                v-model="searchConf.alarmTitle"
                clearable
                :placeholder="searchConf.severity ? '请选择告警名称' : '请先选择告警级别'"
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
          
        </el-row>
        <el-row :gutter="5">
          <el-col
            :span="24"
            style="text-align: right;margin-bottom: 15px;"
          >
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
          <div class="name">历史告警</div>
        </div>
        <div class="options">
          <el-button  @click="exportHistoryAlarm" :loading="showLoading"><i class="iconfont icon-daochu"/> 导出</el-button>
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
            fixed="left"
            width="160"
            prop="chargGroupName"
            label="充电网点"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            width="180" 
            fixed="left"
            prop="deviceNo"
            label="充电机器人编号"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            width="180"
            prop="deviceName"
            label="充电机器人名称"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
           <el-table-column
            width="160"
            prop="poleNo"
            label="对应设备编号"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
           <el-table-column
            width="160"
            prop="alarmType"
            label="告警类型"
            align="center"
            show-overflow-tooltip
          >
          <template slot-scope="scope">
            {{Number(scope.row.alarmType) > 0 ? dictInfo.robotAlarmTypeObj[scope.row.alarmType] : null}}
          </template>
          </el-table-column>
           <el-table-column
              prop="severity"
              label="告警等级"
              width="142"
              align="center"
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
            width="160"
            prop="alarmTitle"
            label="告警标题"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            width="90"
            prop="count"
            label="告警计数"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            width="160"
            prop="treatProgram"
            label="处理方案"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            width="180"
            prop="startTime"
            show-overflow-tooltip
            label="首次告警发生时间"
            align="center"
          >
          </el-table-column>
           <el-table-column
            width="180"
            prop="lastTime"
            show-overflow-tooltip
            label="最近一次告警时间"
            align="center"
          >
          </el-table-column>
          <el-table-column
            width="180"
            prop="clearTime"
            show-overflow-tooltip
            label="告警清除时间"
            align="center"
          >
          </el-table-column>
          <el-table-column
            width="180"
            prop="homingTag"
            show-overflow-tooltip
            label="车辆位置是否合适"
            align="center"
          >
          <template slot-scope="scope">
            {{scope.row.homingTag == '1' ? '是' : '否'}}
          </template>
          </el-table-column>
          <el-table-column
            width="100"
            prop="plateNo"
            show-overflow-tooltip
            label="车牌号"
            align="center"
          >
          </el-table-column>
          <el-table-column
            width="120"
            show-overflow-tooltip
            prop="dispStatus"
            label="派单结果"
            align="center"
          >
           <template slot-scope="scope">
               {{ scope.row.dispStatus === 1 ? "已派单" : "未派单" }}
           </template>
          </el-table-column>
          <el-table-column
            width="160"
            prop="dispTime"
            label="派单时间"
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
              :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRobotHistoryAlarm, exportHistoryAlarm } from '@/api/alarm/robot/alarm'
import { listChargGroupCode } from "@/api/alarm/alarmmonitorcenter.js";
import { getAlarmTitle } from "@/api/alarm/celve.js";
import { getRobotList } from '@/api/alarm/robot/alarm'
import { mapGetters } from 'vuex'
import { streamToExcel } from "@/utils/utils"
export default {
  data() {
    return {
      searchConf: {
        pageSize: 10,
        pageNo: 1,
        alarmCode: null,
        alarmTitle: null,
        deviceSite: null,
        deviceName: null,
        deviceNo: null,
        alarmType: null,
        severity: null,
        startTime: null,
        lastTime: null,
      },
      siteList: [],
      listChargGroupCode: [],
      total: 0,
      showLoading: false,
      timeList: [],
      levelList: [
        { label: "1级", value: "1" },
        { label: "2级", value: "2" },
      ],
      levelObj: {
        1: '1级',
        2: '2级',
      },
      tableList: [], //table表格数组
      alarmTitleSelect: [], //告警名称列表
      robotList: [],
    };
  },
  computed: {
    ...mapGetters(['dictInfo'])
  },
  created() {
    this.getList();
    this.fetchSiteList(); //获取充电网点
  },
  methods: {
    severityClick(val) {
      this.alarmTitleSelect = []
      this.searchConf.alarmTitle = null
      if (val) {
        this.getAlarmTitle(val);
      }
    },
    //获取告警名称
    async getAlarmTitle(val) {
      const res = await getAlarmTitle({ alarmSeverity: val, type: 3 });
      if (res.code == 200) {
        this.alarmTitleSelect = res.data;
      }
    },

    toSearch() {
      this.searchConf.pageNo = 1
      this.getList()
    },

    async getList() {
      if(this.timeList?.length > 0) {
          this.searchConf.startTime = this.timeList[0]
          this.searchConf.lastTime = this.timeList[1]
        }else {
          this.searchConf.startTime = null
          this.searchConf.lastTime = null
        }
      const res = await getRobotHistoryAlarm(this.searchConf);
      if (res.code === 200) {
        this.tableList = res.data.list;
        this.total = res.data.total;
      }
    },

    //获取网点
    async fetchSiteList() {
      const res = await listChargGroupCode();
      if (res.code === 200) {
        this.siteList = res.data;
      }
    },

    changeSite(val) {
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
        const rsp = await getRobotList({chargGroupId: val})
        if(rsp.code === 200) {
            this.robotList = rsp.data.result
        }
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

    resetSearch() {
      this.searchConf = {
        pageSize: 10,
        pageNo: 1,
        alarmCode: null,
        alarmTitle: null,
        deviceSite: null,
        deviceName: null,
        deviceNo: null,
        alarmType: null,
        severity: null,
        startTime: null,
        lastTime: null,
      };
      this.timeList = [];
    },

    //excel导出功能
    async exportHistoryAlarm() {
      this.showLoading = true
      const rsp = await exportHistoryAlarm(this.searchConf);
      if (rsp && rsp.size > 0) {
        streamToExcel(rsp, "充电设备历史告警");
        this.$message({
          type: "success",
          message: "导出成功",
        });
      }
      this.showLoading = false
    },
  },
};
</script>

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
