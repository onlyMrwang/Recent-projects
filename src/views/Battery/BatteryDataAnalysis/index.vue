<template>
  <div class="app-container">
    <div class="card">
      <el-form :model="searchCond" size="small" label-width="100px">
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item label="充电网点名称">
              <el-select
                v-model="searchCond.siteCode"
                placeholder="请选择充电网点名称"
              >
                <el-option
                  v-for="item in siteList"
                  :key="item.recSiteNum + item.chargGroupName"
                  :label="item.chargGroupName"
                  :value="item.recSiteNum"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="充电设备名称">
              <el-select
                v-model="searchCond.equipmentId"
                placeholder="请选择充电设备名称"
              >
                <el-option
                  v-for="item in equipmentList"
                  :key="item.assets_num + item.chargName"
                  :label="item.chargName"
                  :value="item.assets_num"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="BMS编码">
              <el-input
                v-model="searchCond.bMSCode"
                placeholder="请输入BMS编码"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="粒度">
              <el-select
                v-model="granularityType"
                clearable
                placeholder="请选择粒度"
                @change="granularitySelectTrigger(granularityType)"
              >
                <el-option
                  v-for="item in granularityList"
                  :key="item.id"
                  :label="item.text"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item label="开始时间">
              <el-date-picker
                v-if="granularityType != 'season'"
                v-model="searchCond.startTime"
                :type="granularityType"
                placeholder="选择开始时间"
                :format="granularityType == 'week'? 'yyyy 第 WW 周' : ''"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="startTimePicker"
              >
              </el-date-picker>
              <season-select
                v-else
                :defaultValue="searchCond.startTime"
                :valueArr="seasonArr"
                @setQuarterDate="setStartSeason"
              ></season-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结束时间">
              <el-date-picker
                v-if="granularityType != 'season'"
                v-model="searchCond.endTime"
                :type="granularityType"
                 :format="granularityType == 'week'? 'yyyy 第 WW 周' : ''"
                placeholder="选择结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="endTimePicker"
              >
              </el-date-picker>
              <season-select
                v-else
                :defaultValue="searchCond.endTime"
                :valueArr="seasonArr"
                @setQuarterDate="setEndSeason"
              ></season-select>
            </el-form-item>
          </el-col>

          <el-col :span="6" :offset="6" class="btn-group">
            <el-button type="primary" @click="doSearch">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="content-container">
      <div class="table-top">
        <span class="title">查询结果</span>
        <el-button
          type="primary"
          @click="backToPrevious"
          v-show="showModule !== 0"
          >返回</el-button
        >
      </div>
      <div class="table-container" v-show="showModule === 0">
        <el-table
          :data="tableList"
          :header-cell-style="tableHeaderStyle"
          row-class-name="table-row"
          border
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" width="60">
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="结束充电时间"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="siteName"
            label="充电网点名称"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="equipmentName"
            label="充电设备"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column prop="bmsCode" label="BMS编码" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-link
                :underline="false"
                @click="goDrill(scope.row)"
                type="primary"
                style="margin-right: 10px;"
              >
                查看详情
              </el-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="tableList.length > 0">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page.sync="tablePageNo"
            layout="total, prev, pager, next"
            :total="tableList.length"
          >
          </el-pagination>
        </div>
      </div>
      <div id="lineChart" class="line-chart" v-show="showModule === 1"></div>
      <div class="table-container" v-show="showModule === 2">
        <el-table
          :data="secondTableList"
          :header-cell-style="tableHeaderStyle"
          row-class-name="table-row"
          border
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" width="60">
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="开始时间"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="结束时间"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="siteName"
            label="充电网点名称"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="equipmentId"
            label="充电设备编码"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="connectorId"
            label="枪号"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-link
                :underline="false"
                @click="goDrill(scope.row)"
                type="primary"
                style="margin-right: 10px;"
              >
                查看充电过程
              </el-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="secondTableList.length > 0">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page.sync="secondTablePageNo"
            layout="total, prev, pager, next"
            :total="secondTableList.length"
          >
          </el-pagination>
        </div>
      </div>
      <div class="table-container" v-show="showModule === 3">
        <el-table
          :data="thirdTableList"
          :header-cell-style="tableHeaderStyle"
          row-class-name="table-row"
          border
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" width="60">
          </el-table-column>
          <el-table-column
            prop="totalVoltage"
            label="电池总电压（V）"
            width="90"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="totalCurrent"
            label="电池总电流（A）"
            width="90"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="voltageH"
            label="最高单体电压（V）"
            width="90"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="voltageL"
            label="最低单体电压（V）"
            width="90"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="temptureH"
            label="最高温度（℃）"
            width="90"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="temptureL"
            label="最低温度（℃）"
            width="90"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="health"
            label="电池健康度（SOH）"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column prop="soc" label="荷电状态SOC" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="restChargingTime"
            label="剩余充电时间（min）"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="开始时间"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="结束时间"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="thirdTableList.length > 0">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page.sync="thirdTablePageNo"
            layout="total, prev, pager, next"
            :total="thirdTableList.length"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import seasonSelect from "../components/seasonSelect.vue";
import {
  queryBmsCodeListData,
  getChargGroupCode,
  getChargCode,
  queryFirstLevelData,
  querySecondLevelData,
  queryThirdLevelData,
} from "@/api/battery/dataanalysis.js";

export default {
  components: { seasonSelect },
  data() {
    return {
      searchCond: {
        siteCode: "0", // 充电网点名称
        allStations: 1, // 充电站是否全选标识符  0 为单选 1为全选
        equipmentId: "0", // 充电设备名称
        allEquipments: 1, // 充电桩是否全选标识符  0 为单选 1为全选
        timeGranularity: 3, // 粒度
        startTime: moment()
          .subtract(7, "days")
          .format("YYYY-MM-DD HH:mm:ss"), // 开始时间 默认上周
        endTime: moment().format("YYYY-MM-DD HH:mm:ss"), // 结束时间  默认今天
        bMSCode: "", // BMS编码
      },
      granularityType: "week",
      siteList: [], // 充电网点列表
      equipmentList: [], // 充电设备列表
      granularityList: [
        { id: "datetime", text: "小时" },
        { id: "date", text: "天" },
        { id: "week", text: "周" },
        { id: "month", text: "月" },
        { id: "season", text: "季" },
      ], // 粒度列表
      seasonArr: ["01", "02", "03", "04"],
      startTimePicker: this.startTimeLimit(),
      endTimePicker: this.endTimeLimit(),
      tableList: [], // 电池数据跟踪分析表格数据
      tablePageNo: 1, // 电池数据跟踪分析表格页码
      showModule: 0,
      secondSearchCond: {},
      secondTableList: [],
      secondTablePageNo: 1,
      thirdSearchCond: {},
      thirdTableList: [],
      thirdTablePageNo: 1,
    };
  },
  created() {
    this.getList();
    this.getSite();
    this.getEquipment();
  },
  watch: {
    "searchCond.siteCode"(newVal) {
      this.searchCond.allStations = newVal !== "0" ? 0 : 1;
      this.getEquipment();
    },
    granularityType(newVal) {
      const index = this.granularityList.findIndex((x) => {
        return x.id === newVal;
      });
      this.searchCond.timeGranularity = index + 1;
    },
  },
  methods: {
    // 限制开始时间小于结束时间
    startTimeLimit() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.searchCond.endTime) {
            // 如果结束时间不为空，则小于结束时间
            return new Date(self.searchCond.endTime).getTime() < time.getTime();
          }
        },
        firstDayOfWeek: 1,
      };
    },
    // 限制结束时间大于开始时间
    endTimeLimit() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.searchCond.startTime) {
            // 如果开始时间不为空，则大于开始时间
            return (
              new Date(self.searchCond.startTime).getTime() > time.getTime()
            );
          }
        },
        firstDayOfWeek: 1,
      };
    },
    setStartSeason(event) {
      this.searchCond.startTime = event.value;
    },
    setEndSeason(event) {
      this.searchCond.endTime = event.value;
    },
    granularitySelectTrigger() {
      // 清空时间
      Object.assign(this.searchCond, { startTime: "", endTime: "" });
    },
    async getSite() {
      const res = await getChargGroupCode()
      if(res.code === 200) {
        this.siteList = res.data
        this.siteList.unshift({ recSiteNum: "0", chargGroupName: "全部" });
      } else {
        this.siteList = [{ recSiteNum: "0", chargGroupName: "全部" }];
      }
    },
    async getEquipment() {
      if (this.searchCond.allStations !== 1) {
        const res = await getChargCode({siteCode: this.searchCond.siteCode})
        if(res.code === 200) {
          this.equipmentList = res.data
          this.equipmentList.unshift({ assets_num: "0", chargName: "全部" });
        }
      } else {
        this.equipmentList = [{ assets_num: "0", chargName: "全部" }];
      }
    },
    // 重置搜索条件
    resetSearch() {
      this.searchCond = {
        siteCode: "0", // 充电网点名称
        allStations: 1, // 充电站是否全选标识符  0 为单选 1为全选
        equipmentId: "0", // 充电设备名称
        allEquipments: 1, // 充电桩是否全选标识符  0 为单选 1为全选
        timeGranularity: 3, // 粒度
        startTime: moment()
          .subtract(7, "days")
          .format("YYYY-MM-DD HH:mm:ss"), // 开始时间 默认上周
        endTime: moment().format("YYYY-MM-DD HH:mm:ss"), // 结束时间  默认今天
        bMSCode: "", // BMS编码
      };
      this.granularityType = "week";
    },
    //分页点击得方法
    handleCurrentChange(page) {
      if (this.showModule === 2) {
        this.secondTablePageNo = page;
        this.getSecondList();
      } else if (this.showModule === 3) {
        this.thirdTablePageNo = page;
        this.getThirdList();
      } else {
        this.tablePageNo = page;
        this.getList();
      }
    },
    doSearch() {
      this.getList();
      this.showModule = 0;
    },
    async getList() {
      if (this.searchCond.timeGranularity === 5) {
        // 粒度为季度时多传两个字段
        this.searchCond.startStatisticalSeason = this.searchCond.startTime.split(
          "-"
        )[1];
        this.searchCond.endStatisticalSeason = this.searchCond.endTime.split(
          "-"
        )[1];
        this.searchCond.startTime = `${this.searchCond.startTime}-01 00:00:00`;
        this.searchCond.endTime = `${this.searchCond.endTime}-01 00:00:00`;
      } else if (this.searchCond.timeGranularity === 3) {
        // 粒度为周时设置为周一至周日
        const startWeekDay = moment(this.searchCond.startTime).format("E");
        this.searchCond.startTime =
          moment(this.searchCond.startTime)
            .subtract(startWeekDay - 1, "days")
            .format("YYYY-MM-DD") + " 00:00:00";
        const endWeekDay = moment(this.searchCond.endTime).format("E");
        this.searchCond.endTime =
          moment(this.searchCond.endTime)
            .add(7 - endWeekDay, "days")
            .format("YYYY-MM-DD") + " 23:59:59";
      }
      let query = JSON.parse(JSON.stringify(this.searchCond))
      if (this.searchCond.equipmentId !== "0") {
        this.searchCond.allEquipments = 0;
      } 
      const res = await queryBmsCodeListData(this.tablePageNo, 10, query);
      if (res.code === 200) {
        this.tableList = res.data.list;
      }
    },
    async getFirstData(val) {
      const query = Object.assign({}, this.searchCond, {
        bMSCode: val.bmsCode,
      });
      const res = await queryFirstLevelData(query);
      if (res.code === 200) {
      this.initLineChart(res.data);
      }
    },
    async getSecondList() {
      const res = await querySecondLevelData(this.secondTablePageNo, 10, this.secondSearchCond);
      if (res.code === 200) {
        this.secondTableList = res.data.list;
      }
    },
    async getThirdList() {
      this.thirdSearchCond.bMSCode = this.thirdSearchCond.bmsCode
      const res = await queryThirdLevelData(this.thirdTablePageNo, 10, this.thirdSearchCond);
      if (res.code === 200) {
        this.thirdTableList = res.data.list;
      }
    },
    // 下钻内容
    goDrill(val) {
      this.showModule++;
      if (this.showModule === 1) {
        this.getFirstData(val);
      } else if (this.showModule === 2) {
        this.getSecondList();
      } else if (this.showModule === 3) {
        this.thirdSearchCond = val;
        this.getThirdList();
      }
    },
    // 返回上一级
    backToPrevious() {
      this.showModule--;
    },
    initLineChart(origin) {
      const xData = origin.map((x) => x.statisticalTime);
      const yData = origin.map((y) => y.statisticalTimes);
      const self = this;
      let chartDom = document.getElementById("lineChart");
      let myChart = this.$echarts.init(chartDom);
      let option;

      option = {
        title: {
          text: "充电次数统计",
          textStyle: {
            fontWeight: "bold",
            fontSize: 16,
          },
          x: "center",
          y: "top",
          textAlign: "left",
        },
        tooltip: {
          trigger: "axis",
          padding: [8, 16],
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "3%",
          right: "8%",
          top: "16%",
          bottom: "3%",
          containLabel: true,
          width: "90%",
        },
        xAxis: {
          type: "category",
          data: xData,
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#E3E3E3",
            },
          },
          axisLabel: {
            color: "#9AA0A4",
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: "#757575",
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed", // y轴分割线类型
            },
          },
        },
        series: [
          {
            data: yData,
            type: "line",
            smooth: true,
            color: "#05A1AF",
          },
        ],
      };
      myChart.off("click");
      option && myChart.setOption(option);

      myChart.on("click", function(params) {
        // 控制台打印数据的名称
        self.secondSearchCond = origin[params.dataIndex];
        self.secondSearchCond.bMSCode = self.secondSearchCond.bmsCode
        self.secondSearchCond.timeGranularity = self.searchCond.timeGranularity
        self.goDrill();
      });
    },
  },
};
</script>

<style lang="scss">
.btn-group {
  display: flex;
  justify-content: flex-end;
  button {
    margin-left: 24px;
  }
}

.content-container {
  background-color: #fff;
  padding: 20px;
  margin-top: 8px;

  .table-top {
    display: flex;
    justify-content: space-between;
    padding-bottom: 8px;
    .title {
      font-size: 16px;
      color: #222;
    }
  }

  .el-table {
    .table-row:hover td {
      background-color: #f1fcfe;
    }
    .cell {
      padding-left: 20px !important;
    }
  }

  .pagination {
    text-align: right;
    padding-top: 16px;
  }

  .line-chart {
    height: 300px;
    width: 85vw;
  }
}
</style>
