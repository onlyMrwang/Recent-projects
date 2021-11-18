<template>
  <!--充电过程-->
  <div class="chargingProcess">
    <!-- <div class="header">
      <span>过程数据</span>
    </div> -->
    <div class="searchAccSearch">
      <div class="inputBox">
        <div class="inputItem">
          <div class="label">上报时间</div>
          <div class="value">
            <el-date-picker
              popper-class="dateRange"
              v-model="timeList"
              type="datetimerange"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              @change="handleSelectedTime"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="search">
        <el-button type="primary" @click="toSearch">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </div>
    <div class="options">
      <div class="title">充电过程数据列表</div>
      <div class="btns">
        <el-button @click="processDataExport"
          ><i class="iconfont icon-daochu" /> 导出</el-button
        >
      </div>
    </div>
    <div class="tableContent">
      <el-table
        :data="tableData"
        :header-cell-style="tableHeaderStyle"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          align="center"
          label="序号"
        ></el-table-column>
        <el-table-column
          width="160"
          align="center"
          prop="time"
          label="上报时间"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="totalEnergy"
          label="已输入电量(kWh)"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="outputVoltage"
          show-overflow-tooltip
          label="输出电压(V)"
        >
        </el-table-column>
        <el-table-column
          prop="ah"
          align="center"
          show-overflow-tooltip
          label="安时(Ah)"
        >
        </el-table-column>
        <el-table-column
          prop="outputCurrent"
          align="center"
          show-overflow-tooltip
          label="输出电流(A)"
        >
        </el-table-column>
        <el-table-column
          prop="monomerHighVdc"
          align="center"
          show-overflow-tooltip
          label="单体最高电压(V)"
        >
        </el-table-column>
        <el-table-column
          prop="monomerLowVdc"
          align="center"
          show-overflow-tooltip
          label="单体最低电压(V)"
        >
        </el-table-column>
        <el-table-column
          prop="batteryHighTemp"
          show-overflow-tooltip
          align="center"
          label="电池最高温度(°C)"
        >
        </el-table-column>
        <el-table-column
          prop="batteryLowTemp"
          show-overflow-tooltip
          align="center"
          label="电池最低温度(°C)"
        >
        </el-table-column>
        <el-table-column
          prop="batteryNewVdc"
          show-overflow-tooltip
          align="center"
          label="电池当前电压(V)"
        >
        </el-table-column>
        <!--<el-table-column-->
        <!--prop="date"-->
        <!--fixed="right"-->
        <!--align="center"-->
        <!--label="当前电压">-->
        <!--</el-table-column>-->
        <el-table-column
          fixed="right"
          align="center"
          prop="newSoc"
          label="SOC(%)"
        >
        </el-table-column>
      </el-table>
      <div class="pagination" v-if="tableData.length > 0">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="searchConf.pageNo"
          layout="total, prev, pager, next"
          :total="total"
          :page-size="3"
        >
        </el-pagination>
      </div>
    </div>

    <div class="options" style="margin: 30px 0 10px 0;">
      <div class="title">充电过程趋势分析</div>
      <!-- <div class="btns">
        <el-select
          v-model="type"
          placeholder="请选择"
          @change="chartTypeChange(type)"
        >
          <el-option
            v-for="item in chartType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div> -->
    </div>

    <div id="chartType1" class="chart"></div>
    <div id="chartType2" class="chart"></div>
    <div id="chartType3" class="chart"></div>
    <div id="chartType4" class="chart"></div>
    <div id="chartType5" class="chart"></div>
    <div id="chartType6" class="chart"></div>
    <div id="chartType7" class="chart"></div>
  </div>
</template>

<script>
import moment from "moment";
import {
  getChargeprocess,
  getChargeProcessLineData,
  chargeProcessInfoExport,
} from "@/api/monitoring/comsupervision.js";
import { streamToExcel } from "@/utils/utils";
export default {
  name: "charging-process",
  data() {
    return {
      timeList: [
        `${moment().format("yyyy-MM-DD")} 00:00:00`,
        `${moment().format("yyyy-MM-DD HH:mm:ss")}`,
      ],
      tableData: [],
      info: {},
      searchConf: {
        pageNo: 1,
        pageSize: 3,
        startTime: null,
        endTime: null,
      },
      total: 0,
      fields:
        "monomerHighVdc,monomerLowVdc,batteryNewEle,batteryNewVdc,newSoc,batteryHighTemp,batteryLowTemp,totalEnergy,ah",
      chartType: [
        {
          label: "单体最高和最低电压趋势图",
          value: 1,
          unit: [{ name: "单体最高电压" }, { name: "单体最低电压" }],
          fields: "monomerHighVdc,monomerLowVdc",
          engUnit: "(V)",
        },
        {
          label: "当前电流趋势图",
          value: 2,
          unit: [{ name: "当前电流" }],
          fields: "batteryNewEle",
          engUnit: "(A)",
        },
        {
          label: "当前电压趋势图",
          value: 3,
          unit: [{ name: "当前电压" }],
          fields: "batteryNewVdc",
          engUnit: "(V)",
        },
        {
          label: "当前SOC趋势图",
          value: 4,
          unit: [{ name: "当前SOC" }],
          fields: "newSoc",
          engUnit: "(%)",
        },
        {
          label: "最高和最低温度趋势图",
          value: 5,
          unit: [{ name: "单体最高温度" }, { name: "单体最低温度" }],
          fields: "batteryHighTemp,batteryLowTemp",
          engUnit: "(℃)",
        },
        {
          label: "已输入电量趋势图",
          value: 6,
          unit: [{ name: "已输入电量" }],
          fields: "totalEnergy",
          engUnit: "(kWh)",
        },
        {
          label: "安时趋势分析图",
          value: 7,
          unit: [{ name: "安时" }],
          fields: "ah",
          engUnit: "(Ah)",
        },
      ],
      chartInfo: {
        title: "单体最高和最低电压趋势图",
        unit: [
          { name: "单体最高电压", color: "red" },
          { name: "单体最低电压", color: "#526470" },
        ],
        fields: "monomerHighVdc,monomerLowVdc",
      },
      type: 1,
      myChart: {},
      pickerMinDate: "",
      pickerMaxDate: "",
      lineData: {},
    };
  },
  props: {
    infos: {
      type: Object,
      required: false,
    },
    pileDetail: {
      type: Object,
      required: false,
    },
  },
  //监听父组件给的值
  watch: {
    infos: {
      handler(newName, oldName) {
        this.info = newName;
        this.fetchChargeprocess();
      },
      // immediate: true,
    },
  },
  created() {
    this.info = this.infos;
    this.searchConf.startTime =
      this.timeList.length > 0 ? this.timeList[0] : null;
    this.searchConf.endTime =
      this.timeList.length > 0 ? this.timeList[1] : null;
    this.searchConf.deviceNo = this.infos.deviceNo;
    this.searchConf.gunNo = this.infos.gunNo;
  },
  mounted() {
    this.fetchChargeprocess();
    this.fetchChargeProcessLineData();
  },
  methods: {
    // 导出过程数据
    async processDataExport() {
      const query = {};
      query.deviceNo = this.infos.deviceNo;
      query.gunNo = this.infos.gunNo;
      query.startTime = this.searchConf.startTime;
      query.endTime = this.searchConf.endTime;
      const res = await chargeProcessInfoExport(query);
      if (res) {
        streamToExcel(
          res,
          `${this.pileDetail.poleName}桩${this.infos.gunNo}终端充电桩过程数据`
        );
        this.$message({
          type: "success",
          message: "导出成功",
        });
      }
    },
    handleSelectedTime() {
      let startTime = moment(this.timeList[0]);
      let endTime = moment(this.timeList[1]);
      if (endTime.diff(startTime, "minute") > 24 * 60) {
        endTime = startTime.format("yyyy-MM-DD") + " 23:59:59";
      } else {
        endTime = endTime.format("yyyy-MM-DD HH:mm:ss");
      }
      this.timeList.pop();
      this.timeList.push(endTime);
    },
    async fetchChargeprocess() {
      const res = await getChargeprocess(this.searchConf);
      if (res.code === 200) {
        this.tableData = res.data;
        this.total = res.total;
      }
    },
    async fetchChargeProcessLineData() {
      const query = {};
      // query.fields = this.chartType[this.type - 1].fields;
      query.fields = this.fields;
      query.deviceNo = this.infos.deviceNo;
      query.gunNo = this.infos.gunNo;
      query.startTime = this.searchConf.startTime;
      query.endTime = this.searchConf.endTime;
      const res = await getChargeProcessLineData(query);
      if (res.code === 200) {
        this.lineData = res.data;
        this.drawLine();
      }
    },
    toSearch() {
      this.searchConf.startTime =
        this.timeList.length > 0 ? this.timeList[0] : null;
      this.searchConf.endTime =
        this.timeList.length > 0 ? this.timeList[1] : null;
      this.searchConf.pageNo = 1;
      this.fetchChargeprocess();
      this.fetchChargeProcessLineData();
    },
    resetSearch() {
      this.timeList = [];
      this.searchConf = {
        pageNo: 1,
        pageSize: 3,
        startTime: null,
        endTime: null,
        deviceNo: this.infos.deviceNo,
        gunNo: this.infos.gunNo,
      };
    },
    handleCurrentChange(page) {
      this.searchConf.pageNo = page;
      this.fetchChargeprocess();
    },
    chartTypeChange(type) {
      this.chartInfo = {
        title: this.chartType[type - 1].label,
        unit: this.chartType[type - 1].unit,
        fields: this.chartType[type - 1].fields,
      };
      this.fetchChargeProcessLineData();
    },
    //为图表计算高度
    drawLine() {
      this.chartType.map((chartInfo) => {
        let myChart = document.getElementById("chartType" + chartInfo.value);
        myChart.removeAttribute("_echarts_instance_");
        myChart.style.width = window.innerWidth - 350 + "px";
        // 基于准备好的dom，初始化echarts实例
        this.myChart = this.$echarts.init(myChart);

        let xData = [];
        let yData = [];
        let seriesData = [];
        let fields = chartInfo.fields.split(",");
        let max = 5;
        let min = 0;
        fields.map((field, index) => {
          const y = [];
          const lineData = this.lineData[field];
          lineData.map((item) => {
            index === 0 && xData.push(item.time);
            if(item.value) {
             y.push(Number(item.value).toFixed(2))
            } else {
              y.push(item.value)
            }
          });
          yData.push(y);
          max = Math.max(...y) > max ? Math.max(...y) : max
          min = Math.min(...y) < min ? Math.min(...y) : min
        });
        max = Math.ceil(max)
        min = Math.floor(min)
        // xData = xData.reverse()
        if (yData[0].length > 0) {
          chartInfo.unit.map((item, index) => {
            seriesData.push({
              name: item.name,
              data: yData[index],
              // data: yData[index].reverse(),
              type: "line",
              symbol: "none",
              smooth: true,
            });
            if (index === 0) {
              seriesData[index].areaStyle = {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(255,152,0,0.2)" },
                  { offset: 1, color: "rgba(255,152,0,0)" },
                ]),
              };
            } else {
              seriesData[index].areaStyle = {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(92,202,232,0.2)" },
                  { offset: 1, color: "rgba(92,202,232,0)" },
                ]),
              };
            }
          });
          // 绘制图表
          this.myChart.setOption({
            title: {
              text: chartInfo.label,
              textStyle: {
                fontSize: 14,
                fontWeight: 500,
              },
            },
            tooltip: {
              trigger: "axis",
            },
            legend: {
              data: chartInfo.unit,
              icon: "rect",
              itemHeight: 5,
              itemWidth: 15,
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
            },
            xAxis: {
              type: "category",
              data: xData,
              boundaryGap: false,
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
                formatter(value) {
                  const strArr = value.split(" ");
                  return `${strArr[0]}\n${strArr[1]}`;
                },
              },
            },
            toolbox: {
              feature: {
                saveAsImage: {},
              },
            },
            yAxis: {
              name: chartInfo.engUnit,
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
              minInterval: 1,
              max: max,
              min: min,
            },
            series: seriesData,
            color: ["#FF9800", "#5CCAE8"],
          });
        } else {
          const elementImg = require("@/assets/monitoring/type/noData.png"); // 暂无数据图片路径
          myChart.style.display = "flex";
          myChart.style.justifyContent = "center"; // 设置元素水平居中
          myChart.style.alignItems = "center"; // 垂直居中
          myChart.style.flexDirection = "column"; // 垂直居中
          myChart.style.borderBottom = "1px solid #dedede"; // 垂直居中
          myChart.removeChild(myChart.firstChild); // 移除第一个节点，即里面的要放置图表的div

          const mainImg = document.createElement("img");
          myChart.appendChild(mainImg); // 添加要显示的图片
          mainImg.style.width = "auto";
          mainImg.style.height = "auto";
          mainImg.style.maxWidth = "20%";
          mainImg.style.maxHeight = "20%";
          mainImg.style.marginBottom = "8px";
          mainImg.src = elementImg; // 要显示图片的src

          const div = document.createElement("div");
          myChart.appendChild(div);
          
          const span2 = document.createElement("span");
          div.appendChild(span2);
          span2.innerText = chartInfo.label;
          span2.style.color = "#bbb";
          span2.style.fontSize = "13px";
          span2.style.marginRight = "12px";

          const span = document.createElement("span");
          div.appendChild(span);
          span.innerText = "暂无数据";
          span.style.color = "#bbb";
          span.style.fontSize = "13px";
          return {}; // 返回空对象
        }

        // let self = this;
        // window.addEventListener("resize", () => {
        //     let myChart = document.getElementById("chartType");
        //     myChart.style.width = window.innerWidth - 350 + "px";
        //     self.myChart.resize();
        // })
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
h3 {
  font-size: 14px;
}
.options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
}

.chart {
  width: 100%;
  height: 300px;
}

.searchAccSearch {
  background-color: #fff;
  height: 55px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  // justify-content: space-between;
  // padding: 0 35px 0 30px;
  .inputBox {
    display: flex;
    align-items: center;
    .inputItem {
      display: flex;
      align-items: center;
      margin-right: 38px;
      .label {
        color: $mainTextColor;
        font-size: $fontSize14;
        margin-right: 12px;
      }
    }
  }
}

.chargingProcess {
  // width: calc(100% - 210px);
}
</style>
