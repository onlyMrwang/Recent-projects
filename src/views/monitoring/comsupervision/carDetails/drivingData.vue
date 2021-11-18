<template>
  <div>
    <div id="chart0" class="chart"></div>
    <div id="chart1" class="chart"></div>
    <div id="chart2" class="chart"></div>
    <div id="chart3" class="chart"></div>
    <div id="chart4" class="chart"></div>
    <div id="chart5" class="chart"></div>
    <div id="chart6" class="chart"></div>
  </div>
</template>
<script>
import { getCarProcessTrend } from "@/api/monitoring/comsupervision.js";
export default {
  props: {
    carNo: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      myChart: {},
      chartArr: [
        {
          title: "SOC实时趋势图",
          unit: "(%)",
          legend: [{ name: "SOC" }],
          prop: ["carSoc"],
        },
        {
          title: "电池单体电压趋势图",
          unit: "(v)",
          legend: [{ name: "最高电压" }, { name: "最低电压" }],
          prop: ["maxVoltage", "minVoltage"],
        },
        {
          title: "电池温度趋势图",
          unit: "(℃)",
          legend: [{ name: "最高温度" }, { name: "最低温度" }],
          prop: ["bmsTemp", "minTemp"],
        },
        {
          title: "车辆总电压趋势图",
          unit: "(v)",
          legend: [{ name: "总电压" }],
          prop: ["carAccVoltage"],
        },
        {
          title: "车辆总电流趋势图",
          unit: "(A)",
          legend: [{ name: "总电流" }],
          prop: ["carAccElectric"],
        },
        {
          title: "驱动电机温度趋势图",
          unit: "(℃)",
          legend: [{ name: "电机温度" }],
          prop: ["driverTemp"],
        },
        {
          title: "驱动电机控制器温度趋势图",
          unit: "(℃)",
          legend: [{ name: "控制器温度" }],
          prop: ["driverControllerTemp"],
        },
      ],
      intervalBox: null,
    };
  },
  mounted() {
    const self = this;
    self.getCarProcessData();
    self.intervalBox = setInterval(self.getCarProcessData, 60000);
  },
  beforeDestroy() {
    const self = this;
    clearInterval(self.intervalBox);
  },
  methods: {
    async getCarProcessData() {
      const res = await getCarProcessTrend({ carNo: this.carNo });
      if (res.code === 200) {
        this.drawTrendLine(res.data);
      }
    },
    drawTrendLine(val) {
      let xData = [];
      let yData = [];
      val.map((item) => {
        const timeArr = item.time.split(" ");
        xData.push(timeArr[0] + "\n" + timeArr[1]);
      });
      this.chartArr.map((item, index) => {
        let myChart = document.getElementById(`chart${index}`);
        myChart.removeAttribute("_echarts_instance_");
        myChart.style.width = window.innerWidth - 350 + "px";
        // 基于准备好的dom，初始化echarts实例
        this.myChart = this.$echarts.init(myChart);

        let seriesData = [];
        let max = 5;
        let min = 0;
        item.legend.map((x, i) => {
          yData = [];
          val.map((y) => {
            yData.push(y[item.prop[i]]);
            // if(y[item.prop[i]]) {
            //   yData.push(Number(y[item.prop[i]]).toFixed(2));
            // } else {
            //   yData.push(y[item.prop[i]]);
            // }
          });
          max = Math.max(...yData) > max ? Math.max(...yData) : max
          min = Math.min(...yData) < min ? Math.min(...yData) : min
          max = Math.ceil(max)
          min = Math.floor(min)
          seriesData.push({
            name: x.name,
            data: yData,
            type: "line",
            symbol: "none",
            smooth: true,
          });
          if (i === 0) {
            seriesData[i].areaStyle = {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(255,152,0,0.2)" },
                { offset: 1, color: "rgba(255,152,0,0)" },
              ]),
            };
          } else {
            seriesData[i].areaStyle = {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(92,202,232,0.2)" },
                { offset: 1, color: "rgba(92,202,232,0)" },
              ]),
            };
          }
        });
        if (yData.length > 0) {
          // 绘制图表
          this.myChart.setOption({
            title: {
              text: item.title,
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
              data: item.legend,
              icon: "rect",
              itemHeight: 5,
              itemWidth: 15,
            },
            grid: {
              left: "3%",
              right: "3%",
              bottom: "15%",
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
                formatter: "{value}",
              },
            },
            yAxis: {
              type: "value",
              name: item.unit,
              axisLine: {
                show: false,
              },
              axisLabel: {
                color: "#757575",
                // formatter: "{value} " + item.unit,
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
              max: max,
              min: min,
              minInterval: 1,
            },
            series: seriesData,
            color: ["#FF9800", "#5CCAE8"],
            dataZoom: [
              {
                type: "slider",
                showDetail: true,
                show: true,
                xAxisIndex: 0,
                filterMode: "filter",
                start: 80,
                end: 100,
                height: 16,
              },
            ],
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
          span2.innerText = item.title;
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
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 300px;
}
</style>
