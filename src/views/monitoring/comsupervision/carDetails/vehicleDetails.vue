<template>
  <div class="car-detail-container">
    <div class="header">
      <div class="title">
        <div class="title-text">车辆详情</div>
        <div class="back" @click="goBack">
          <svg
            class="icon"
            viewBox="0 0 1024 1024"
            fill="rgba(6,160,175,1)"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M627.479 283.894H451.324V137.536l-385.13 196.73 385.13 196.68V384.639H641.56c150.323 0 225.485 64.75 225.485 194.3 0 134.36-77.542 199.111-234.856 199.111H190.636v103.174h448.592c211.356 0 319.389-98.365 319.389-292.666 0-203.919-110.362-304.664-331.138-304.664z"
            />
          </svg>
        </div>
      </div>
      <div class="itemContent">
        <el-row :gutter="20">
          <el-col :span="5">
            <div class="item">
              <span class="label">车辆名称：</span>
              <span class="value">{{ infos.carName }}</span>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="item">
              <span class="label">车牌号：</span>
              <span class="value">{{ infos.plateNo }}</span>
            </div> </el-col
          ><el-col :span="6">
            <div class="item">
              <span class="label">车辆编码：</span>
              <span class="value" :title=infos.carNo>{{ infos.carNo }}</span>
            </div> </el-col
          ><el-col :span="8">
            <div class="item">
              <span class="label">所属组织机构：</span>
              <span class="value" :title="infos.orgName">{{ infos.orgName }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="5">
            <div class="item">
              <span class="label">终端类型：</span>
              <span class="value">{{ infos.terminalTypes }}</span>
            </div> </el-col
          ><el-col :span="5">
            <div class="item">
              <span class="label">车辆状态：</span>
              <span
                class="value"
                :class="Number(infos.carStatus) === 1 ? 'green-text' : ''"
              >
                {{ Number(infos.carStatus) === 1 ? "在线" : "离线" }}
                {{
                  infos.stopStatus && Number(infos.stopStatus) === 1
                    ? " / 行驶"
                    : " / 停止"
                }}
              </span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item">
              <span class="label">能源类型：</span>
              <span class="value">{{
                Number(infos.carEnergyType) === 2 ? "新能源车辆" : "燃油车"
              }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item">
              <span class="label">车辆用途：</span>
              <span class="value">{{ carType2Format(infos.carType2) }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="5">
            <div class="item">
              <span class="label">车辆类型：</span>
              <span class="value">{{ carType1Format(infos.carType1) }}</span>
            </div>
          </el-col>
          <el-col :span="5" v-show="Number(infos.carEnergyType) === 2">
            <div class="item">
              <span class="label">充电状态：</span>
              <span class="value">{{
                chargingStatus[Number(infos.chargingStatus)]
              }}</span>
            </div>
          </el-col>
          <el-col :span="7" v-show="Number(infos.carEnergyType) === 2">
            <div class="item">
              <span class="label">车辆VIN码：</span>
              <span class="value" :title=infos.vin>{{ infos.vin }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="content">
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
        v-if="Number(infos.carEnergyType) === 2"
      >
        <el-tab-pane label="行驶数据" name="drivingData">
          <driving-data :carNo="infos.carNo"></driving-data>
          <div class="tab-header">
            行驶里程(累计行驶里程：<span class="alarm-count"
              >{{ fuelDrivingData.mileage }}km</span
            >， 累计行驶时长：<span class="alarm-count"
              >{{ fuelDrivingData.accTravelTime }}分钟</span
            >)
          </div>
          <div id="drivingMileChart" class="chart"></div>
        </el-tab-pane>
        <el-tab-pane label="告警数据" name="alarmData">
          <div class="tab-header">
            累计告警总数：<span class="alarm-count"
              >{{ alarmData.alarmSum }}次</span
            >
            当日告警总数：<span class="alarm-count"
              >{{ alarmData.dayAlarmSum }}次</span
            >
          </div>
          <div id="alarmChart" class="chart"></div>
        </el-tab-pane>
        <el-tab-pane label="充电数据" name="chargingData">
          <div id="chargingChart" class="chart"></div>
        </el-tab-pane>
        <el-tab-pane label="调度信息" name="scheduleInfo">
          <div class="right-select">
            <el-select
              v-model="scheduleType"
              placeholder="请选择"
              @change="getSchedule"
            >
              <el-option
                v-for="item in scheduleOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div id="scheduleChart" class="chart"></div>
        </el-tab-pane>
      </el-tabs>
      <el-tabs v-model="activeName" @tab-click="handleClick" v-else>
        <el-tab-pane label="行驶数据" name="drivingData">
          <div class="tab-header">
            行驶里程(累计行驶里程：<span class="alarm-count"
              >{{ fuelDrivingData.mileage }}km</span
            >， 累计行驶时长：<span class="alarm-count"
              >{{ fuelDrivingData.accTravelTime }}分钟</span
            >)
          </div>
          <div id="drivingMileChart" class="chart"></div>
        </el-tab-pane>
        <el-tab-pane label="告警数据" name="alarmAnalysis">
          <div class="tab-header">
            累计告警总数：<span class="alarm-count"
              >{{ alarmData.alarmSum }}次</span
            >
            当日告警总数：<span class="alarm-count"
              >{{ alarmData.dayAlarmSum }}次</span
            >
          </div>
          <div id="alarmChart" class="chart"></div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getCarAlarms,
  getCarChargingstat,
  getCarSchedulingStat,
  getCarRundata,
  getCarInfo,
} from "@/api/monitoring/comsupervision.js";
import DrivingData from "./drivingData";
import { mapGetters } from "vuex";
export default {
  components: {
    DrivingData,
  },
  props: {
    infos: {
      type: Object,
      required: false,
    },
  },
  computed: {
    ...mapGetters(["dictInfo"]),
  },
  data() {
    return {
      activeName: "drivingData",
      myChart: {},
      scheduleOpts: [
        { value: 7, label: "近7天" },
        { value: 30, label: "近30天" },
      ],
      scheduleType: 7,
      carStatus: [
        "/行驶",
        "/停止",
        "/启动",
        "/熄火",
        "/异常",
        "/无效",
        "/其他",
      ],
      chargingStatus: ["未充电", "充电", "充电完成", "异常", "无效"],
      alarmData: {
        alarmSum: 0,
        dayAlarmSum: 0,
      },
      fuelDrivingData: {
        accTravelTime: 0,
        mileage: 0,
      },
      pileDetail: {},
    };
  },
  created() {
    if (this.infos.carType) {
      this.infos.carEnergyType = Number(this.infos.carType);
    }
    // if (this.infos.carEnergyType == 1) {
    //   //能源车
    //   this.getCarInfo("monitor/car/vevcar/info");
    // } else {
    //   //燃油车
    //   this.getCarInfo("monitor/car/fuelcar/info");
    // }
  },
  mounted() {
    if (Number(this.infos.carEnergyType) === 2) {
      // this.getCarProcessData()
      this.getDrivingData();
      // 获取告警数据
      this.getElectricAlarm();
      // 获取充电数据
      this.getChargingData();
      this.getSchedule();
    } else {
      this.getDrivingData();
      // 获取告警数据
      this.getElectricAlarm();
    }
  },
  methods: {
    async getCarInfo(url) {
      const res = await getCarInfo({ carNo: this.infos.carNo }, url);
      if (res.code === 200) {
        this.pileDetail = res.data;
        // this.pileDetail.carName='测试名字'
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },

    goBack() {
      this.$emit("changeType");
    },

    // 获取车辆类型
    carType1Format(val) {
      const typeArr = this.dictInfo.usebroaHead;
      let item = typeArr.find((x) => {
        return x.value == val;
      });
      return item ? item.label : "";
    },

    // 获取车辆用途
    carType2Format(val) {
      const typeArr = this.dictInfo.usesubcHead;
      let item = typeArr.find((x) => {
        return x.value == val;
      });
      return item ? item.label : "";
    },

    // 获取告警数据
    async getElectricAlarm() {
      const res = await getCarAlarms(
        { carNo: this.infos.carNo },
        "/monitor/car/alarms"
      );
      if (res.code === 200) {
        this.alarmData.alarmSum = res.data.alarmSum;
        this.alarmData.dayAlarmSum = res.data.dayAlarmSum;
        const info = res.data.infos[0].alarmStats;
        let xData = [];
        let yData = [];
        info.map((item) => {
          xData.push(`${item.time}点`);
          yData.push(item.alarmCount);
        });
        this.drawAlarmChart(xData, yData);
      }
    },
    // 绘制告警数据
    drawAlarmChart(xData, yData) {
      let myChart = document.getElementById("alarmChart");
      myChart.removeAttribute("_echarts_instance_");
      myChart.style.width = window.innerWidth - 350 + "px";
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(myChart);
      let max = Math.max(...yData);

      // 绘制图表
      this.myChart.setOption({
        title: {
          text: "当日告警数据",
          textStyle: {
            fontSize: 14,
            fontWeight: 500,
          },
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "#fff",
          padding: 12,
          textStyle: {
            color: "#333",
            fontSize: 10,
          },
          extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);",
        },
        legend: {
          icon: "rect",
          itemHeight: 5,
          itemWidth: 15,
        },
        grid: {
          left: "3%",
          right: "2%",
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
          max: max > 5 ? max : 5,
          minInterval: 1,
          min: 0,
        },
        series: {
          name: "告警次数",
          data: yData,
          type: "line",
          symbol: "none",
          smooth: true,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(255,152,0,0.2)" },
              { offset: 1, color: "rgba(255,152,0,0)" },
            ]),
          },
        },
        color: ["#FF9800", "#5CCAE8"],
      });
    },
    // 获取充电数据
    async getChargingData() {
      const res = await getCarChargingstat({ carNo: this.infos.carNo });
      if (res.code === 200) {
        const data = res.data;
        let xData = [];
        let yData = [[], []];
        data.map((item) => {
          xData.push(item.time);
          yData[0].push(item.chargeCapacity);
          yData[1].push(item.duration);
        });
        this.drawChargingChart(xData, yData);
      }
    },
    // 绘制充电数据
    drawChargingChart(xData, yData) {
      let myChart = document.getElementById("chargingChart");
      myChart.removeAttribute("_echarts_instance_");
      myChart.style.width = window.innerWidth - 350 + "px";
      myChart.style.height = window.innerHeight - 300 + "px";
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(myChart);
      let max1 = Math.ceil(Math.max(...yData[0]) / 5) * 5;
      let max2 = Math.ceil(Math.max(...yData[1]) / 5) * 5;
      max1 = max1 > 5 ? max1 : 5;
      max2 = max2 > 5 ? max2 : 5;
      // 绘制图表
      this.myChart.setOption({
        title: {
          text: "充电量数据",
          textStyle: {
            fontSize: 14,
            fontWeight: "bold",
          },
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "#fff",
          padding: 12,
          textStyle: {
            color: "#333",
            fontSize: 10,
          },
          extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);",
        },
        legend: {
          icon: "rect",
          itemHeight: 5,
          itemWidth: 15,
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "3%",
          containLabel: true,
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
        yAxis: [
          {
            name: "充电量(kwh)",
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
            min: 0,
            max: max1,
            interval: max1 / 5,
            minInterval: 1,
          },
          {
            name: "充电时长(分钟)",
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
            min: 0,
            max: max2,
            interval: max2 / 5,
            minInterval: 1,
          },
        ],
        series: [
          {
            name: "充电量",
            data: yData[0],
            yAxisIndex: '0',
            type: "bar",
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#75E1E3" },
                { offset: 1, color: "#49ACE0" },
              ]),
              barBorderRadius: [4, 4, 0, 0],
            },
            barWidth: 30,
          },
          {
            name: "充电时长",
            data: yData[1],
            yAxisIndex: '1',
            type: "line",
            symbol: "none",
            smooth: true,
            color: "#FF9800",
          },
        ],
      });
    },
    // 获取调度信息
    async getSchedule() {
      const res = await getCarSchedulingStat({
        carNo: this.infos.carNo,
        dateType: this.scheduleType,
      });
      if (res.code === 200) {
        let xData = [];
        let yData = [];
        res.data.map((item) => {
          xData.push(item.time);
          yData.push(item.taskSum);
        });
        this.drawScheduleChart(xData, yData);
      }
    },
    // 绘制调度信息
    drawScheduleChart(xData, yData) {
      let myChart = document.getElementById("scheduleChart");
      myChart.removeAttribute("_echarts_instance_");
      myChart.style.width = window.innerWidth - 350 + "px";
      myChart.style.height = window.innerHeight - 300 + "px";
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(myChart);
      let max = Math.max(...yData);

      // 绘制图表
      this.myChart.setOption({
        title: {
          text: "车辆调度统计分析",
          textStyle: {
            fontSize: 14,
            fontWeight: "bold",
          },
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "#fff",
          padding: 12,
          textStyle: {
            color: "#333",
            fontSize: 10,
          },
          axisPointer: {
            type: "shadow",
          },
          extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);",
        },
        legend: {
          icon: "rect",
          itemHeight: 5,
          itemWidth: 15,
        },
        grid: {
          left: "3%",
          right: "2%",
          bottom: "3%",
          containLabel: true,
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
        yAxis: [
          {
            name: "调度任务数（个）",
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
            max: max > 5 ? max : 5,
            minInterval: 1,
            min: 0,
          },
        ],
        series: [
          {
            name: "调度任务数",
            data: yData,
            type: "bar",
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#75E1E3" },
                { offset: 1, color: "#49ACE0" },
              ]),
              barBorderRadius: [4, 4, 0, 0],
            },
            barWidth: 30,
          },
        ],
      });
    },
    // 获取燃油车行驶数据
    async getDrivingData() {
      const res = await getCarRundata({ carNo: this.infos.carNo });
      if (res.code === 200) {
        this.fuelDrivingData.mileage = res.data.mileage;
        this.fuelDrivingData.accTravelTime = res.data.accTravelTime;
        let xData = [];
        let yData = [[], []];
        res.data.runDataStats.map((item) => {
          xData.push(`${item.time}点`);
          yData[0].push(item.mileage);
          yData[1].push(item.travelTime);
        });
        this.drawDrivingMileChart(xData, yData);
      }
    },
    // 绘制燃油车行驶数据
    drawDrivingMileChart(xData, yData) {
      let myChart = document.getElementById("drivingMileChart");
      myChart.removeAttribute("_echarts_instance_");
      myChart.style.width = window.innerWidth - 350 + "px";
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(myChart);
      let max1 = Math.ceil(Math.max(...yData[0]) / 5) * 5;
      let max2 = Math.ceil(Math.max(...yData[1]) / 5) * 5;
      max1 = max1 > 5 ? max1 : 5;
      max2 = max2 > 5 ? max2 : 5;
      // 绘制图表
      this.myChart.setOption({
        title: {
          text: "",
          textStyle: {
            fontSize: 14,
            fontWeight: 500,
          },
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "#fff",
          padding: 12,
          textStyle: {
            color: "#333",
            fontSize: 10,
          },
          extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);",
        },
        legend: {
          icon: "rect",
          itemHeight: 5,
          itemWidth: 15,
        },
        grid: {
          left: "4%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
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
        yAxis: [
          {
            name: "里程(km)",
            nameTextStyle: {
              fontSize: 14,
            },
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
            min: 0,
            max: max1,
            interval: max1 / 5,
            minInterval: 1,
          },
          {
            name: "时长(分钟)",
            nameTextStyle: {
              fontSize: 14,
            },
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
            min: 0,
            max: max2,
            interval: max2 / 5,
            minInterval: 1,
          },
        ],
        series: [
          {
            name: "行驶里程",
            data: yData[0],
            yAxisIndex: '0',
            type: "bar",
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#75E1E3" },
                { offset: 1, color: "#49ACE0" },
              ]),
              barBorderRadius: [4, 4, 0, 0],
            },
            barWidth: 30,
          },
          {
            name: "行驶时长",
            data: yData[1],
            yAxisIndex: '1',
            type: "line",
            symbol: "none",
            smooth: true,
            color: "#FF9800",
          },
        ],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.car-detail-container {
  height: calc(100vh - 80px);
}
.header {
  background-color: #fff;
  padding: 11px 18px 13px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title-text {
      font-size: 16px;
      color: #222222;
      font-weight: 500;
      &::before {
        content: "|";
        color: $btnMainColor;
        height: 24px;
        width: 3px;
        background: $btnMainColor;
        margin-right: 18px;
      }
    }
    .back {
      width: 36px;
      cursor: pointer;
      border: 1px solid #dedede;
      border-radius: 2px;
      text-align: center;
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.25);
      svg {
        width: 16px;
        height: 14px;
      }
    }
  }
  .itemContent {
    padding-top: 10px;
    .item {
      display: flex;
      font-size: 14px;
      color: #222222;
      justify-content: center;
      line-height: 26px;
      span {
        flex: 1;
      }
      .label {
        text-align: right;
        color: #8e8e8e;
        width: 100px;
        flex: none;
      }
      .value {
        overflow: hidden;  
        text-overflow: ellipsis;  
        white-space: nowrap;
      }
      .green-text {
        color: #21bc17;
      }
    }
  }
}
.content {
  background-color: #fff;
  padding: 3px 18px 15px;
  margin-top: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  min-height: calc(100% - 166px);

  ::v-deep .el-tabs__nav-wrap::after {
    height: 1px;
  }

  ::v-deep .el-tabs__item {
    color: #585d66;
    font-weight: normal;

    &.is-active {
      color: #41b8c3;
      font-weight: bold;
    }
  }

  ::v-deep .el-tabs__active-bar {
    background-color: #41b8c3;
  }

  .tab-header {
    padding: 14px 0;
    color: #222;
    font-weight: 500;
    font-size: 15px;
    position: relative;

    .alarm-count {
      color: #ff9800;
      padding-right: 4px;
      display: inline-block;
    }
  }
  .right-select {
    width: 100px;
    position: absolute;
    left: 90%;
    z-index: 2;

    ::v-deep .el-select .el-input {
      &.is-focus .el-input__inner {
        border-color: #41b8c3;
      }
      .el-select__caret {
        line-height: 32px;
      }
    }
  }

  .chart {
    width: 100%;
    height: 430px;
  }
}
</style>
