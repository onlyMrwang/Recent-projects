<template>
  <!--历史告警-->
  <div class="chrOrderSea">
    <!-- search box -->
    <div class="card">
      <el-form
        ref="searchConf"
        :model="searchConf"
        size="small"
        label-width="80px"
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
                  :value="item.chargGroupName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备名称">
              <el-select
                v-model="searchConf.deviceName"
                clearable
                placeholder="请输入设备名称"
              >
                <el-option
                  v-for="item in ChargingInfoSelect"
                  :key="item.chargId"
                  :label="item.chargName"
                  :value="item.chargName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备编号">
              <el-input
                v-model="searchConf.deviceNo"
                clearable
                placeholder="请输入设备编号"
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
                  v-for="item in dictInfo.alarmType"
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
            <el-form-item label="告警等级" prop="severity">
              <el-select
                v-model="searchConf.severity"
                clearable
                @change="severityClick"
                placeholder="请选择告警等级"
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
                v-model="searchConf.alarmCode"
                clearable
                placeholder="请选择告警名称"
              >
                <el-option
                  v-for="item in alarmTitleSelect"
                  :key="item.alarmCode"
                  :label="item.alarmTitle"
                  :value="item.alarmCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
         
        </el-row>
        <el-row :gutter="5">
          <el-col :span="24" style="text-align: right;margin-bottom: 15px;">
            <el-button type="primary" @click="toSearch">查询</el-button>
            <el-button @click="reset">重置</el-button>
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
          <el-button @click="exportOrder" :loading="showLoading"
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
            fixed="left"
            width="160"
            prop="deviceSite"
            label="充电网点"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            width="180"
            prop="alarmTitle"
            label="告警名称"
            align="center"
          >
            <template slot-scope="scope">
              <el-link type="primary" :underline="false">
                <div class="alarmTitle" @click="toAlarmDetail(scope.row)">
                  {{ scope.row.alarmTitle }}
                </div>
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            prop="deviceName"
            label="设备名称"
            align="center"
          >
          </el-table-column>
          <el-table-column
            width="160"
            prop="deviceNo"
            label="设备编号"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
         <el-table-column
              prop="severity"
              label="告警等级"
              width="160"
              align="center"
              show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div class="severity" v-if="scope.row.severity === 1">
                <div class="severityItem item1"></div>
                <div class="severityItem">
                  <div class="ji">{{scope.row.severity === 1 ? '1级' : scope.row.severity === 2 ? '2级' : scope.row.severity === 3 ? '3级' : null}}</div>
                </div>
                <div class="severityItem"></div>
              </div>
              <div class="severity" v-if="scope.row.severity === 2">
                <div class="severityItem"></div>
                <div class="severityItem item2">
                  <div class="ji">{{scope.row.severity === 1 ? '1级' : scope.row.severity === 2 ? '2级' : scope.row.severity === 3 ? '3级' : null}}</div>
                </div>
                <div class="severityItem"></div>
              </div>
              <div class="severity" v-if="scope.row.severity === 3">
                <div class="severityItem"></div>
                <div class="severityItem">
                  <div class="ji">{{scope.row.severity === 1 ? '1级' : scope.row.severity === 2 ? '2级' : scope.row.severity === 3 ? '3级' : null}}</div>
                </div>
                <div class="severityItem item3"></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="80"
            prop="gunNum"
            label="枪号"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            width="160"
            prop="alarmType"
            label="告警类型"
            show-overflow-tooltip
            align="center"
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
            width="90"
            prop="count"
            label="告警计数"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            width="180"
            prop="startTime"
            show-overflow-tooltip
            label="首次告警时间"
            align="center"
          >
          </el-table-column>
          <el-table-column
            width="180"
            prop="lastTime"
            show-overflow-tooltip
            label="最近发生时间"
            align="center"
          >
          </el-table-column>
          <el-table-column
            width="180"
            prop="clearTime"
            show-overflow-tooltip
            label="清除时间"
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
          <el-table-column
            fixed="right"
            width="110"
            prop="clearUser"
            label="清除人"
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
        title="告警详情"
      >
        <alarm-detail :alarmTitle="alarmTitle" @closeDialog="closeDialog" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getList, getExprot } from "@/api/alarm/HistoricalAlarms.js";
import { listChargGroupCode } from "@/api/alarm/alarmmonitorcenter.js";
import { getAlarmTitle } from "@/api/alarm/celve.js";
import { getChargeBySite } from "@/api/alarm/faultalarmBase.js";
import { mapGetters } from "vuex";
import { streamToExcel } from "@/utils/utils";
import AlarmDetail from "./alarmDetail.vue";
import moment from 'moment'
export default {
  components: { AlarmDetail },
  data() {
    return {
      siteList: [],
      listChargGroupCode: [],
      searchConf: {
        pageSize: 10,
        pageNo: 1,
        alarmCode: null,
        deviceSite: null,
        deviceName: null,
        deviceNo: null,
        alarmType: null,
        severity: null,
        gunNum: null,
        startTime: null,
        lastTime: null,
      },
      timeList: [],
      total: 0,
      showLoading: false,
      levelList: [
        { label: "1级", value: "1" },
        { label: "2级", value: "2" },
        { label: "3级", value: "3" },
      ],
       levelObj: {
        1: '1级',
        2: '2级',
        3: '3级',
      },
      tableList: [], //table表格数组
      ChargingInfoSelect: [], // 充电设备列表
      alarmTitleSelect: [], //告警名称
      showAlarmDetail: false,
      alarmTitle: null,
    };
  },
  computed: {
    ...mapGetters(["dictInfo"]),
  },
  created() { 
    this.getName(); //获取充电网点
    this.searchConf.severity = this.$route.query.type || null
    this.searchConf.deviceName = this.$route.query.poleName || null
    this.searchConf.deviceSite = this.$route.query.websiteName || null
    this.searchConf.deviceNo = this.$route.query.poleNo || null
    this.searchConf.gunNum = this.$route.query.gunNum || null
    if(this.$route.query.startTime && this.$route.query.endTime) {
      this.timeList = [new Date(this.$route.query.startTime), new Date(this.$route.query.endTime)]
    }
    this.getList();
  },
  methods: {
    changeSite(val) {
      const arr = this.siteList.filter((item) => item.chargGroupName === val);
      if (arr.length > 0) {
        this.ChargingInfoSelect = [];
        this.fetchChargingInfos({ id: arr[0].chargGroupId });
      }
    },

    //充电设备查询
    async fetchChargingInfos(data) {
      const res = await getChargeBySite(data);
      if (res.code == 200) {
        this.ChargingInfoSelect = res.data;
      }
    },

    severityClick(val) {
      this.alarmTitleSelect = [];
      if (val) {
        this.getAlarmTitle(val);
      }
    },
    //获取告警名称
    async getAlarmTitle(val) {
      const res = await getAlarmTitle({ alarmSeverity: val, type: 1 });
      if (res.code == 200) {
        this.alarmTitleSelect = res.data;
      }
    },

    toSearch() {
      this.searchConf.pageNo = 1;
      this.getList();
    },

    toAlarmDetail(row) {
      this.alarmTitle = row.alarmTitle;
      this.showAlarmDetail = true;
    },

    closeDialog() {
      this.alarmTitle = null;
      this.showAlarmDetail = false;
    },

    async getList() {
        if(this.timeList?.length > 0) {
          if(this.$route.query.startTime && this.$route.query.endTime) {
            this.searchConf.startTime = moment(this.timeList[0]).format('YYYY-MM-DD HH:mm:ss')
            this.searchConf.lastTime = moment(this.timeList[1]).format('YYYY-MM-DD HH:mm:ss') 
          }else {
            this.searchConf.startTime = this.timeList[0]
            this.searchConf.lastTime = this.timeList[1]
          }
          
        }else {
          this.searchConf.startTime = null
          this.searchConf.lastTime =  null
        }
      const res = await getList(this.searchConf);
      if (res.code === 200) {
        this.tableList = res.data.list;
        this.total = res.data.total;
      }
    },

    //获取网点
    async getName() {
      const res = await listChargGroupCode();
      if (res.code === 200) {
        this.siteList = res.data;
         if(this.$route.query.websiteName) {
          const arr = this.siteList.filter(item => item.chargGroupName === this.$route.query.websiteName)
          if(arr.length > 0) {
            this.fetchChargingInfos({id: arr[0].chargGroupId})
          }
        }
      }
    },

    handleCurrentChange(page) {
      this.searchConf.pageNo = page;
      this.getList();
    },

    handleSizeChange(pageSize) {
      this.searchConf.pageNo = 1;
      this.searchConf.pageSize = pageSize;
      this.getList();
    },

    reset() {
      this.searchConf = {
        pageSize: 10,
        pageNo: 1,
        alarmCode: null,
        deviceSite: null,
        deviceName: null,
        deviceNo: null,
        alarmType: null,
        gunNum: null,
        severity: null,
        startTime: null,
        lastTime: null,
      };
      this.timeList = [];
    },

    //excel导出功能
    async exportOrder() {
      this.showLoading = true
      const rsp = await getExprot(this.searchConf);
      if (rsp && rsp.size > 0) {
        streamToExcel(rsp, "充电设备历史告警");
        this.$message({
          type: "success",
          message: "导出成功",
        });
      }else {
         this.$message({
          type: 'error',
          message: '导出失败'
        })
      }
      this.showLoading = false
    },
  },
};
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
