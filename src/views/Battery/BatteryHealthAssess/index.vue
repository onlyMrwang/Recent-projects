<template>
  <div class="app-container">
    <div class="card">
      <el-form :model="searchCond" size="small" label-width="100px">
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item label="充电网点名称">
              <el-select
                v-model="searchCond.siteCode"
                clearable
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
          <el-col :span="6" :offset="3">
            <el-form-item label="充电设备名称">
              <el-select
                v-model="searchCond.equipmentId"
                clearable
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
          <el-col :span="6" :offset="3">
            <el-form-item label="BMS编码">
              <el-input
                v-model="searchCond.bMSCode"
                placeholder="请输入BMS编码"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item label="周期">
              <el-select
                v-model="granularityType"
                clearable
                placeholder="请选择周期"
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
          <el-col :span="6" :offset="3">
            <el-form-item label="选择日期">
              <el-date-picker
                v-if="granularityType != 'season'"
                v-model="searchCond.time"
                :type="granularityType"
                placeholder="请选择日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
              <season-select
                v-else
                :defaultValue="searchCond.time"
                :valueArr="seasonArr"
                @setQuarterDate="setSeason"
              ></season-select>
            </el-form-item>
          </el-col>

          <el-col :span="6" :offset="3" class="btn-group">
            <el-button type="primary" @click="doSearch">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="content-container">
      <div class="table-top">
        <span class="title">查询结果</span>
        <div v-show="showModule !== 0">
          <el-button type="primary" @click="getPdf(pdfTitle)">导出报告</el-button>
          <el-button type="primary" @click="backToPrevious">返回</el-button>
        </div>
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
            prop="statisticalTime"
            label="时间"
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
                @click="viewRepo(scope.row)"
                type="primary"
                style="margin-right: 10px;"
              >
                查看报告
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
      <div id="pdfDom" v-show="showModule === 1">
        <p>电池基本信息</p>
        <el-table
          :data="repoInfo.batteryBaiscInfo"
          :header-cell-style="tableHeaderStyle"
          row-class-name="table-row"
          border
          style="width: 100%"
          class="mb10"
        >
          <el-table-column
            prop="batteryBmsCode"
            label="电池编码"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="vehicularApplications"
            label="车辆用途"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="ratedCapacity"
            label="额定容量"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="ratedVoltage"
            label="额定电压"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            :formatter="evaluationShow"
            label="综合评估"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            :formatter="tsohShow"
            label="当前健康度"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
        <el-row class="mb10">
          <el-col :span="12">
            <div id="perfHistory" class="chart"></div>
          </el-col>
          <el-col :span="12">
            <div id="restCY" class="chart"></div>
          </el-col>
        </el-row>
        <el-row class="mb10">
          <el-col :span="12">
            <div id="alarmType" class="chart"></div>
          </el-col>
          <el-col :span="12">
            <div id="alarmLevel" class="chart"></div>
          </el-col>
        </el-row>
        <el-tabs v-model="tabActiveName">
          <el-tab-pane label="电池运行情况历史分析" name="first">
            <el-table
              :data="repoInfo.historyInfo"
              :header-cell-style="tableHeaderStyle"
              row-class-name="table-row"
              border
              style="width: 100%"
            >
              <el-table-column
                prop="statsTime"
                label="统计时间"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="chargeTimesSum"
                label="历史充电次数"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="chargeTimeSum"
                label="历史充电时长"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="chargeTimeF"
                label="单次最快充电时长"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="chargeTimeS"
                label="单次最慢充电时长"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="tatalVoltageH"
                label="最高充电电压"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="totalCurrentH"
                label="最高充电电流"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="voltageH"
                label="最高单体电压"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="voltageL"
                label="最低单体电压"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="temptureH"
                label="最高温度"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="temptureL"
                label="最低温度"
                show-overflow-tooltip
              >
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="电池运行情况周期分析" name="second">
            <el-table
              :data="repoInfo.periodInfo"
              :header-cell-style="tableHeaderStyle"
              row-class-name="table-row"
              border
              style="width: 100%"
            >
              <el-table-column
                prop="statsTime"
                label="统计时间"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="chargeTimesSum"
                :label="
                  `本${
                    searchCond.period == 'month'
                      ? '月'
                      : searchCond.period == 'season'
                      ? '季'
                      : '年'
                  }度充电次数`
                "
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="avgChargeTimes"
                :label="
                  `平均每${searchCond.period == 'month' ? '日' : '月'}充电次数`
                "
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="chargeTimeSum"
                :label="
                  `本${
                    searchCond.period == 'month'
                      ? '月'
                      : searchCond.period == 'season'
                      ? '季'
                      : '年'
                  }度充电时长`
                "
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="avgEveryChargeTime"
                :label="
                  `平均每${searchCond.period == 'month' ? '日' : '月'}充电时长`
                "
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="avgChargeTime"
                label="平均每次充电时长"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="chargeTimeF"
                label="单次最快充电时长"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="chargeTimeS"
                label="单次最慢充电时长"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="tatalVoltageH"
                label="最高充电电压"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="totalCurrentH"
                label="最高充电电流"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="beforeSocL"
                label="充电开始SOC最低值"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="avgBeforeSoc"
                label="充电开始SOC平均值"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="afterSocH"
                label="充电结束SOC最高值"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="avgAfterSoc"
                label="充电结束SOC平均值"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="voltageH"
                label="最高单体电压"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="voltageL"
                label="最低单体电压"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="temptureH"
                label="最高温度"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="temptureL"
                label="最低温度"
                show-overflow-tooltip
              >
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import seasonSelect from "../components/seasonSelect.vue";
import moment from "moment";
import { getChargGroupCode, getChargCode } from "@/api/battery/dataanalysis.js";
import {
  queryReportBmsCodeListData,
  queryBatteryDataReport,
} from "@/api/battery/healthassess.js";
import htmlToPdf from "@/utils/htmlToPdf.js";

Vue.use(htmlToPdf);

export default {
  components: { seasonSelect },
  data() {
    return {
      searchCond: {
        allStations: 1,
        allEquipments: 1,
        siteCode: "0", // 充电网点名称
        equipmentId: "0", // 充电设备名称
        timeGranularity: 4, // 粒度
        time: moment().format("YYYY-MM-DD HH:mm:ss"), // 时间
        BMSCode: "", // BMS编码
      },
      siteList: [], // 充电网点列表
      equipmentList: [], // 充电设备列表
      granularityList: [
        { id: "month", text: "月" },
        { id: "season", text: "季" },
        { id: "year", text: "年" },
      ],
      seasonArr: ["01", "02", "03", "04"],
      granularityType: "month",
      showModule: 0,
      tablePageNo: 1,
      tableList: [],
      repoInfo: {
        batteryBaiscInfo: [],
        perfHistory: [],
        restCY: [],
        historyInfo: [],
        periodInfo: [],
      },
      tsohList: ["优", "良", "一般", "较差"],
      tabActiveName: "first",
      pdfTitle: "动力电池健康度分析月报告",
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
      this.searchCond.timeGranularity = index + 4;
      this.pdfTitle = `动力电池健康度分析${
        index === 0 ? "月" : index === 1 ? "季" : "年"
      }报告`;
    },
  },
  methods: {
    setSeason(event) {
      this.searchCond.time = event.value;
    },
    granularitySelectTrigger() {
      // 清空时间
      Object.assign(this.searchCond, { time: "" });
    },
    async getSite() {
      const res = await getChargGroupCode();
      if (res.code === 200) {
        this.siteList = res.data;
        this.siteList.unshift({ recSiteNum: "0", chargGroupName: "全部" });
      }
    },
    async getEquipment() {
      if (this.searchCond.allStations !== 1) {
        const res = await getChargCode({ siteCode: this.searchCond.siteCode });
        if (res.code === 200) {
          this.equipmentList = res.data;
          this.equipmentList.unshift({ assets_num: "0", chargName: "全部" });
        }
      } else {
        this.equipmentList = [{ assets_num: "0", chargName: "全部" }];
      }
    },
    // 重置搜索条件
    resetSearch() {
      this.searchCond = {
        allStations: 1,
        allEquipments: 1,
        siteCode: "0", // 充电网点名称
        equipmentId: "0", // 充电设备名称
        timeGranularity: 4, // 粒度
        time: moment().format("YYYY-MM-DD HH:mm:ss"), // 时间
        BMSCode: "", // BMS编码
      };
    },
    doSearch() {
      this.showModule = 0
      this.getList();
    },
    async getList() {
      let query = {};

      if (this.searchCond.equipmentId !== "0") {
        this.searchCond.allEquipments = 0;
      } else {
        query = (({ equipmentId, ...query }) => ({ equipmentId, ...query }))(
          this.searchCond
        );
      }

      console.log(query, "=====!!!");
      if (this.searchCond.timeGranularity === 5) {
        // 粒度为季度时多传一个字段
        this.searchCond.statisticalSeason = this.searchCond.time.split("-")[1];
        this.searchCond.time = `${this.searchCond.time}-01 00:00:00`;
      }
      const res = await queryReportBmsCodeListData(
        this.tablePageNo,
        10,
        this.searchCond
      );
      if (res.code === 200) {
        this.tableList = res.data.list;
      }
      console.log(this.searchCond, "--searchCond");
      console.log("获取初始表格数据");
      // this.tableList = [
      //   {
      //     statisticalTime: "2021-07-01",
      //     siteName: "光明一号站",
      //     equipmentName: "光明一号充电设备",
      //     bmsCode: "FFFFFFDF08070211",
      //   },
      // ];
    },
    // 返回上一级
    backToPrevious() {
      this.showModule--;
    },
    //分页点击得方法
    handleCurrentChange(page) {
      this.tablePageNo = page;
      this.getList();
    },
    viewRepo(val) {
      this.showModule++;
      this.getRepoInfo(val);
    },
    async getRepoInfo(val) {
      const query = Object.assign({}, this.searchCond, {
        bMSCode: val.bmsCode,
      });
      const res = await queryBatteryDataReport(query);
      if (res.code === 200) {
        //  this.repoInfo = res.data
        this.repoInfo.batteryBaiscInfo = [res.data.batteryBaiscInfo];
        this.repoInfo.batteryBaiscInfo[0].tsoh = res.data.tsoh;

        this.repoInfo.historyInfo = [res.data.batteryData];
        this.repoInfo.historyInfo[0].statsTime = res.data.statisticalTime;

        this.repoInfo.periodInfo = [res.data.batteryData];
        this.repoInfo.periodInfo[0].statsTime = res.data.statisticalTime;

        let xData = [];
        let cyY = [];
        let perfY = [];
        res.data.sohAndRemainCapacity.map((item) => {
          xData.push(item.statisticalTime);
          cyY.push(item.sohSum);
          perfY.push(item.remainCapacitySum);
        });
        this.initLineChart("perfHistory", "电池性能历史分析", xData, perfY);
        this.initLineChart("restCY", "剩余容量曲线", xData, cyY);

        let alarmType = [];
        const alarmTypeObj = {
          "106": "单体电压过低",
          "107": "单体电压过高",
          "111": "电流过高",
          "120": "温度过高",
          "5057": "温度过低",
          "5066": "总电压过高",
          "5067": "总电压过低",
          "5068": "soc过高",
          "5069": "soc过低",
          "5072": "soc变化过快",
        };
        res.data.warningCodeDistribution.forEach((item) => {
          alarmType.push({
            value: item.warningCodeTimes,
            name: alarmTypeObj[item.warningCode],
          });
        });
        this.initPieChart("alarmType", "告警类型", alarmType);

        let alarmLevel = [];
        res.data.warningLevelDistribution.forEach((item) => {
          const level = Number(item.warningLevel);
          alarmLevel.push({
            value: item.warningCodeTimes,
            name:
              level === 1 ? "一级告警" : level === 2 ? "二级告警" : "三级告警",
          });
        });
        this.initPieChart("alarmLevel", "告警级别", alarmLevel);
      }
      console.log(query, "--query");
      console.log("获取报告数据");
    },
    evaluationShow(row) {
      return Number(row.tsoh) === 1 ? "正常" : "建议更换";
    },
    tsohShow(row) {
      return this.tsohList[row.tsoh - 1];
    },
    initLineChart(id, title, xData, YData) {
      let chartDom = document.getElementById(id);
      let myChart = this.$echarts.init(chartDom);
      let option;

      option = {
        title: {
          text: title,
          textStyle: {
            fontWeight: "normal",
            fontSize: 16,
          },
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
          data: xData,
          type: "category",
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
            data: YData,
            type: "line",
            smooth: true,
            color: "#05A1AF",
          },
        ],
      };
      option && myChart.setOption(option);
    },
    initPieChart(id, title, data) {
      let chartDom = document.getElementById(id);
      let myChart = this.$echarts.init(chartDom);
      let option;

      option = {
        title: {
          text: title,
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: title,
            type: "pie",
            radius: "50%",
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
        color: ["#ee6666", "#fac858", "#73c0de"],
      };
      option && myChart.setOption(option);
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

  .chart {
    height: 300px;
    width: 40vw;
  }
  .el-tabs__item.is-active,
  .el-tabs__item:hover {
    color: #05a1af;
  }
  .el-tabs__active-bar {
    background-color: #05a1af;
  }
}
</style>
