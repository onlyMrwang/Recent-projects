<template>
  <div ref="chart" style="width: 100%; height: 376px"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {};
  },
  mounted() {
    this.getEchartData();
  },
  methods: {
    getEchartData() {
      const chart = this.$refs.chart;
      if (chart) {
        const myChart = this.$echarts.init(chart);
        let xLabel = [
          "一月",
          "二月",
          "三月",
          "四月",
          "五月",
          "六月",
          "七月",
          "八月",
          "九月",
          "十月",
          "十一月",
          "十二月",
        ];
        let expenditureData=JSON.stringify(this.data.data[0])
        // 
        let incomeData =JSON.stringify(this.data.data[1]),
          option = {
            //鼠标移入显示数据，无需修改
            tooltip: {
              show: true,
              trigger: "axis",
            },
            //  左上方标题设置
            title: {
              top: "0%", //距顶部
              left: "4%", //距左侧
              // text: "充电时长分析", //标题文本
              textStyle: {
                //字体样式（颜色、大小、粗细）
                color: "#000",
                fontSize: 15,
                fontWeight: "bold",
              },
            },

            //右上图例设置
            legend: {
              /**图例左侧小矩形**/
              icon: "rect", // rect是矩形图例   circle是圆点图例
              itemWidth: 25, //宽
              itemHeight: 16, //高
              itemGap: 20, //间隔
              top: "0%", //距顶部
              right: "6%", //距右侧

              /**图例右侧文字**/
              textStyle: {
                color: "#000",
                fontSize: 15,
                fontWeight: "bold",
              },
              data: [`2020`, `2021`], //右上角提示
            },
            //中间内容距外边位置设置
            grid: {
              top: "15%",
              left: "5%",
              right: "5%",
              bottom: "15%",
            },
            // x轴属性
            xAxis: [
              {
                type: "category",
                // 距离边的距离
                boundaryGap: false,
                axisLine: {
                  show: true,
                  // x轴的颜色样式
                  lineStyle: {
                    color: "rgba(76, 230, 231, 0.1)",
                  },
                },
                //轴线上的字
                axisLabel: {
                  margin: 15, //刻度标签与轴线之间的距离
                  textStyle: {
                    fontSize: 14, //文字的字体大小
                    color: "#000",
                  },
                },
                // 竖线
                splitLine: {
                  show: false,
                },
                // x轴刻度
                axisTick: {
                  show: false,
                },
                // x轴刻度数据
                data: xLabel,
              },
            ],
            // y轴属性
            yAxis: [
              {
                type: "value",
                // y轴单位
                name: this.data.name,
                // name的样式
                nameTextStyle: {
                  color: "#9DCFCF",
                  fontSize: 16,
                  padding: 10,
                },
                // 最小
                min: 0,
                max: 30,
                // 平均分为多少条横轴
                splitNumber: 5,
                // 横轴样式
                splitLine: {
                  // 是否显示
                  show: true,
                  // 横线样式，颜色
                  lineStyle: {
                    color: "rgba(76, 230, 231, 0.1)",
                  },
                },
                // y轴
                axisLine: {
                  show: false,
                },
                // y轴上的字
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: "#9DCFCF",
                    padding: 16,
                  },
                },
                // y刻度
                axisTick: {
                  show: false,
                },
              },
            ],
            // 两条数据线的属性
            series: [
              {
                // 名称
                name: "2020",
                type: "line",
                symbol: "circle",
                showAllSymbol: false,
                symbolSize: 0,
                // 是否为平滑曲线
                smooth: true,
                lineStyle: {
                  normal: {
                    width: 4,
                    color: "#7ab8ae",
                  },
                },
                // 控制右上角的颜色和鼠标划入小框中圆点的颜色
                itemStyle: {
                  color: "#7ab8ae",
                  borderWidth: 2,
                },
                // 是否鼠标划入时显示数据
                tooltip: {
                  show: true,
                },
                // 区域样式
                areaStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: "rgba(32, 214, 179,.3)",
                        },
                        {
                          offset: 1,
                          color: "rgba(32, 214, 179, 0)",
                        },
                      ],
                      false
                    ),
                    shadowColor: "rgba(32, 214, 179, 0.5)",
                    shadowBlur: 20,
                  },
                },
                data: expenditureData,
              },
              {
                name: "2021",
                type: "line",
                symbol: "circle",
                showAllSymbol: true,
                symbolSize: 0,
                smooth: true,
                lineStyle: {
                  normal: {
                    width: 4,
                    color: "#8ba2d2",
                  },
                },
                itemStyle: {
                  color: "#8ba2d2",
                  borderWidth: 2,
                },
                tooltip: {
                  show: true,
                },
                areaStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: "rgba(76, 228, 230, 0.3)",
                        },
                        {
                          offset: 1,
                          color: "rgba(76, 228, 230, 0)",
                        },
                      ],
                      false
                    ),
                    shadowColor: "rgba(76, 228, 230, 0.5)",
                    shadowBlur: 20,
                  },
                },
                data: incomeData,
              },
            ],
          };
        myChart.setOption(option);
        window.addEventListener("resize", function () {
          myChart.resize();
        });
      }
    },
  },
};
</script>

<style></style>
