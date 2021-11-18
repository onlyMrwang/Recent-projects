<template>
  <div>
    <div class="card">
      <span class="title">智慧调度</span>
      <span class="titleright">
        <el-button type="primary" @click="handleQuery">查询</el-button>
      </span>
      <div class="titleright">
        <el-select
          v-if="radio == '6'"
          v-model="queryParams.outlets"
          placeholder="请选择季度"
          clearable
          size="small"
        >
          <el-option
            v-for="item in time"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="titleright">
        <el-date-picker
          v-model="value2"
          :key="radio"
          :type="radio == 9 ? 'month' : 'year'"
          value-format="yyyy-MM"
          :placeholder="radio == 9 ? '选择月' : '选择年'"
        >
        </el-date-picker>
      </div>
      <span class="titleright">
        <el-radio-group v-model="radio">
          <el-radio :label="3">年</el-radio>
          <el-radio :label="6">季度</el-radio>
          <el-radio :label="9">月</el-radio>
        </el-radio-group>
      </span>
    </div>
    <div class="box">
      <div class="box1 long">
        <span class="name">充电时长得分</span>
        <span class="grade">{{ getgrand[0] ? getgrand[0] : '----' }}</span>
      </div>
      <div class="box1 long1">
        <span class="name">充电时长充电桩利用率得分</span>
        <span class="grade">{{ getgrand[1] ? getgrand[1] : '----' }}</span>
      </div>
      <div class="box1 long2">
        <span class="name">充电功率充电桩利用率得分</span>
        <span class="grade">{{ getgrand[2] ? getgrand[2] : '----' }}</span>
      </div>
      <div class="box1 long3">
        <span class="name">充电费用得分</span>
        <span class="grade">{{ getgrand[3] ? getgrand[3] : '----' }}</span>
      </div>
    </div>
    <div class="echart">
      <div style="width:100%">
        <span class="chartstitle" style="margin-left:22px">充电时长分析</span>
      </div>
      <div ref="chart" style="width: 100%; height: 376px"></div>
    </div>
    <div class="echart">
      <div style="width:100%;display:flex;justify-content:space-between">
        <span class="chartstitle">充电桩利用率分析</span>
        <el-dropdown @command="handleCommand" style="margin-right:10px">
          <span class="el-dropdown-link">
            {{ defaultsel }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="按充电时长统计"
              >按充电时长统计</el-dropdown-item
            >
            <el-dropdown-item command="按充电功率统计"
              >按充电功率统计</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- <div style="width:100%"> -->
      <!-- <span class="chartstitle">充电费用分析</span> -->
      <!-- </div> -->
      <div ref="chart1" style="width: 100%; height: 376px"></div>
    </div>
    <div class="echart">
      <div style="width:100%">
        <span class="chartstitle" style="margin-left:20px">充电费用分析</span>
      </div>
      <div ref="chart2" style="width: 100%; height: 376px"></div>
    </div>
  </div>
</template>
<script>
// import Echart from "./echart.vue"
import * as echarts from 'echarts'
import {
  getTime,
  getCost,
  getCharg,
  getAnalysis
} from '@/api/smartdispatch/evaluationsystem/index'
export default {
  data() {
    return {
      defaultsel: '按充电时长统计',
      radio: 3,
      queryParams: {
        outlets: ''
      },
      value2: '',
      time: [
        { value: '22', label: '一季度' },
        { value: '33', label: '二季度' },
        { value: '44', label: '三季度' },
        { value: '55', label: '四季度' }
      ],
      xcoordinate: [],
      time1: '',
      time2: '',
      chargingtime: {
        data: [],
        name: '充电时长(h)',
        starttime: this.time1,
        endtime: this.time2,
        xcoordinate: []
      },
      chargingtimedata: [],
      chargingcostdata: [],
      chargdata: [],
      getgrand: [], // 得分
      chargingcost: {
        data: [],
        name: '充电桩利用率%',
        starttime: '2021',
        endtime: '2020',
        xcoordinate: []
      },
      charg: {
        data: [],
        name: '费用(万元)',
        starttime: '2021',
        endtime: '2020',
        xcoordinate: []
      },
      dateList: []
    }
  },
  computed: {
    gettime() {
      return this.value2.substr(0, 4)
    }
  },
  created() {
    this.handleQuery()
  },
  mounted() {
    this.handleQuery()
  },
  methods: {
    // echarts数据
    getEchartData(data, xLable, dateList) {
      const chart = this.$refs.chart
      if (chart) {
        const myChart = this.$echarts.init(chart)
        const xLabel = xLable
        const [expenditureData, incomeData] = data,
          option = {
            //鼠标移入显示数据，无需修改
            tooltip: {
              show: true,
              trigger: 'axis'
            },
            //  左上方标题设置
            title: {
              top: '0%', //距顶部
              left: '1%', //距左侧
              // text: '充电时长分析', //标题文本
              textStyle: {
                //字体样式（颜色、大小、粗细）
                color: '#000',
                fontSize: 15,
                fontWeight: 'bold'
              }
            },

            //右上图例设置
            legend: {
              /**图例左侧小矩形**/
              icon: 'rect', // rect是矩形图例   circle是圆点图例
              itemWidth: 25, //宽
              itemHeight: 16, //高
              itemGap: 20, //间隔
              top: '0%', //距顶部
              right: '6%', //距右侧

              /**图例右侧文字**/
              textStyle: {
                color: '#000',
                fontSize: 15,
                fontWeight: 'bold'
              },
              data: dateList //右上角提示
            },
            //中间内容距外边位置设置
            grid: {
              top: '15%',
              left: '6%',
              right: '5%',
              bottom: '15%'
            },
            // x轴属性
            xAxis: [
              {
                type: 'category',
                // 距离边的距离
                boundaryGap: false,
                axisLine: {
                  show: true,
                  // x轴的颜色样式
                  lineStyle: {
                    color: 'rgba(76, 230, 231, 0.1)'
                  }
                },
                //轴线上的字
                axisLabel: {
                  margin: 15, //刻度标签与轴线之间的距离
                  textStyle: {
                    fontSize: 14, //文字的字体大小
                    color: '#000'
                  }
                },
                // 竖线
                splitLine: {
                  show: false
                },
                // x轴刻度
                axisTick: {
                  show: false
                },
                // x轴刻度数据
                data: xLabel
              }
            ],
            // y轴属性
            yAxis: [
              {
                type: 'value',
                // y轴单位
                name: this.chargingtime.name,
                // name的样式
                nameTextStyle: {
                  color: '#9DCFCF',
                  fontSize: 16,
                  padding: 10
                },
                // 最小
                min: 0,
                // 平均分为多少条横轴
                splitNumber: 5,
                // 横轴样式
                splitLine: {
                  // 是否显示
                  show: true,
                  // 横线样式，颜色
                  lineStyle: {
                    color: 'rgba(76, 230, 231, 0.1)'
                  }
                },
                // y轴
                axisLine: {
                  show: false
                },
                // y轴上的字
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#9DCFCF',
                    padding: 16
                  }
                },
                // y刻度
                axisTick: {
                  show: false
                }
              }
            ],
            // 两条数据线的属性
            series: [
              {
                // 名称
                name: dateList[0],
                type: 'line',
                symbol: 'circle',
                showAllSymbol: false,
                symbolSize: 0,
                // 是否为平滑曲线
                smooth: true,
                lineStyle: {
                  normal: {
                    width: 4,
                    color: '#7ab8ae'
                  }
                },
                // 控制右上角的颜色和鼠标划入小框中圆点的颜色
                itemStyle: {
                  color: '#7ab8ae',
                  borderWidth: 2
                },
                // 是否鼠标划入时显示数据
                tooltip: {
                  show: true
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
                          color: 'rgba(32, 214, 179,.3)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(32, 214, 179, 0)'
                        }
                      ],
                      false
                    ),
                    shadowColor: 'rgba(32, 214, 179, 0.5)',
                    shadowBlur: 20
                  }
                },
                data: expenditureData
              },
              {
                name: dateList[1],
                type: 'line',
                symbol: 'circle',
                showAllSymbol: true,
                symbolSize: 0,
                smooth: true,
                lineStyle: {
                  normal: {
                    width: 4,
                    color: '#8ba2d2'
                  }
                },
                itemStyle: {
                  color: '#8ba2d2',
                  borderWidth: 2
                },
                tooltip: {
                  show: true
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
                          color: 'rgba(76, 228, 230, 0.3)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(76, 228, 230, 0)'
                        }
                      ],
                      false
                    ),
                    shadowColor: 'rgba(76, 228, 230, 0.5)',
                    shadowBlur: 20
                  }
                },
                data: incomeData
              }
            ]
          }
        myChart.setOption(option)
        window.addEventListener('resize', function() {
          myChart.resize()
        })
      }
    },
    getEchartData1(data, xLable, dateList) {
      const chart = this.$refs.chart1
      if (chart) {
        const myChart = this.$echarts.init(chart)
        const xLabel = xLable
        let expenditureData = data[0]
        //
        let incomeData = data[1],
          option = {
            //鼠标移入显示数据，无需修改
            tooltip: {
              show: true,
              trigger: 'axis'
            },
            //  左上方标题设置
            title: {
              top: '0%', //距顶部
              left: '1%', //距左侧
              // text: '充电时长分析', //标题文本
              textStyle: {
                //字体样式（颜色、大小、粗细）
                color: '#000',
                fontSize: 15,
                fontWeight: 'bold'
              }
            },

            //右上图例设置
            legend: {
              /**图例左侧小矩形**/
              icon: 'rect', // rect是矩形图例   circle是圆点图例
              itemWidth: 25, //宽
              itemHeight: 16, //高
              itemGap: 20, //间隔
              top: '0%', //距顶部
              right: '6%', //距右侧

              /**图例右侧文字**/
              textStyle: {
                color: '#000',
                fontSize: 15,
                fontWeight: 'bold'
              },
              // data: dateList //右上角提示
              data: dateList //右上角提示
            },
            //中间内容距外边位置设置
            grid: {
              top: '15%',
              left: '6%',
              right: '5%',
              bottom: '15%'
            },
            // x轴属性
            xAxis: [
              {
                type: 'category',
                // 距离边的距离
                boundaryGap: false,
                axisLine: {
                  show: true,
                  // x轴的颜色样式
                  lineStyle: {
                    color: 'rgba(76, 230, 231, 0.1)'
                  }
                },
                //轴线上的字
                axisLabel: {
                  margin: 15, //刻度标签与轴线之间的距离
                  textStyle: {
                    fontSize: 14, //文字的字体大小
                    color: '#000'
                  }
                },
                // 竖线
                splitLine: {
                  show: false
                },
                // x轴刻度
                axisTick: {
                  show: false
                },
                // x轴刻度数据
                data: xLabel
              }
            ],
            // y轴属性
            yAxis: [
              {
                type: 'value',
                // y轴单位
                name: this.chargingcost.name,
                // name的样式
                nameTextStyle: {
                  color: '#9DCFCF',
                  fontSize: 16,
                  padding: 10
                },
                // 最小
                min: 0,
                // 平均分为多少条横轴
                splitNumber: 5,
                // 横轴样式
                splitLine: {
                  // 是否显示
                  show: true,
                  // 横线样式，颜色
                  lineStyle: {
                    color: 'rgba(76, 230, 231, 0.1)'
                  }
                },
                // y轴
                axisLine: {
                  show: false
                },
                // y轴上的字
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#9DCFCF',
                    padding: 16
                  }
                },
                // y刻度
                axisTick: {
                  show: false
                }
              }
            ],
            // 两条数据线的属性
            series: [
              {
                // 名称
                name: dateList[0],
                type: 'line',
                symbol: 'circle',
                showAllSymbol: false,
                symbolSize: 0,
                // 是否为平滑曲线
                smooth: true,
                lineStyle: {
                  normal: {
                    width: 4,
                    color: '#7ab8ae'
                  }
                },
                // 控制右上角的颜色和鼠标划入小框中圆点的颜色
                itemStyle: {
                  color: '#7ab8ae',
                  borderWidth: 2
                },
                // 是否鼠标划入时显示数据
                tooltip: {
                  show: true
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
                          color: 'rgba(32, 214, 179,.3)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(32, 214, 179, 0)'
                        }
                      ],
                      false
                    ),
                    shadowColor: 'rgba(32, 214, 179, 0.5)',
                    shadowBlur: 20
                  }
                },
                data: expenditureData
              },
              {
                name: dateList[1],
                type: 'line',
                symbol: 'circle',
                showAllSymbol: true,
                symbolSize: 0,
                smooth: true,
                lineStyle: {
                  normal: {
                    width: 4,
                    color: '#8ba2d2'
                  }
                },
                itemStyle: {
                  color: '#8ba2d2',
                  borderWidth: 2
                },
                tooltip: {
                  show: true
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
                          color: 'rgba(76, 228, 230, 0.3)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(76, 228, 230, 0)'
                        }
                      ],
                      false
                    ),
                    shadowColor: 'rgba(76, 228, 230, 0.5)',
                    shadowBlur: 20
                  }
                },
                data: incomeData
              }
            ]
          }
        myChart.setOption(option)
        window.addEventListener('resize', function() {
          myChart.resize()
        })
      }
    },
    getEchartData2(data, xLable, dateList) {
      const chart = this.$refs.chart2
      if (chart) {
        const myChart = this.$echarts.init(chart)
        const xLabel = xLable
        let expenditureData = data[0]
        //
        let incomeData = data[1],
          option = {
            //鼠标移入显示数据，无需修改
            tooltip: {
              show: true,
              trigger: 'axis'
            },
            //  左上方标题设置
            title: {
              top: '0%', //距顶部
              left: '1%', //距左侧
              // text: '充电时长分析', //标题文本
              textStyle: {
                //字体样式（颜色、大小、粗细）
                color: '#000',
                fontSize: 15,
                fontWeight: 'bold'
              }
            },

            //右上图例设置
            legend: {
              /**图例左侧小矩形**/
              icon: 'rect', // rect是矩形图例   circle是圆点图例
              itemWidth: 25, //宽
              itemHeight: 16, //高
              itemGap: 20, //间隔
              top: '0%', //距顶部
              right: '6%', //距右侧

              /**图例右侧文字**/
              textStyle: {
                color: '#000',
                fontSize: 15,
                fontWeight: 'bold'
              },
              data: dateList //右上角提示
            },
            //中间内容距外边位置设置
            grid: {
              top: '15%',
              left: '5%',
              right: '5%',
              bottom: '15%'
            },
            // x轴属性
            xAxis: [
              {
                type: 'category',
                // 距离边的距离
                boundaryGap: false,
                axisLine: {
                  show: true,
                  // x轴的颜色样式
                  lineStyle: {
                    color: 'rgba(76, 230, 231, 0.1)'
                  }
                },
                //轴线上的字
                axisLabel: {
                  margin: 15, //刻度标签与轴线之间的距离
                  textStyle: {
                    fontSize: 14, //文字的字体大小
                    color: '#000'
                  }
                },
                // 竖线
                splitLine: {
                  show: false
                },
                // x轴刻度
                axisTick: {
                  show: false
                },
                // x轴刻度数据
                data: xLabel
              }
            ],
            // y轴属性
            yAxis: [
              {
                type: 'value',
                // y轴单位
                name: this.charg.name,
                // name的样式
                nameTextStyle: {
                  color: '#9DCFCF',
                  fontSize: 16,
                  padding: 10
                },
                // 最小
                min: 0,
                // 平均分为多少条横轴
                splitNumber: 5,
                // 横轴样式
                splitLine: {
                  // 是否显示
                  show: true,
                  // 横线样式，颜色
                  lineStyle: {
                    color: 'rgba(76, 230, 231, 0.1)'
                  }
                },
                // y轴
                axisLine: {
                  show: false
                },
                // y轴上的字
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#9DCFCF',
                    padding: 16
                  }
                },
                // y刻度
                axisTick: {
                  show: false
                }
              }
            ],
            // 两条数据线的属性
            series: [
              {
                // 名称
                name: dateList[0],
                type: 'line',
                symbol: 'circle',
                showAllSymbol: false,
                symbolSize: 0,
                // 是否为平滑曲线
                smooth: true,
                lineStyle: {
                  normal: {
                    width: 4,
                    color: '#7ab8ae'
                  }
                },
                // 控制右上角的颜色和鼠标划入小框中圆点的颜色
                itemStyle: {
                  color: '#7ab8ae',
                  borderWidth: 2
                },
                // 是否鼠标划入时显示数据
                tooltip: {
                  show: true
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
                          color: 'rgba(32, 214, 179,.3)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(32, 214, 179, 0)'
                        }
                      ],
                      false
                    ),
                    shadowColor: 'rgba(32, 214, 179, 0.5)',
                    shadowBlur: 20
                  }
                },
                data: expenditureData
              },
              {
                name: dateList[1],
                type: 'line',
                symbol: 'circle',
                showAllSymbol: true,
                symbolSize: 0,
                smooth: true,
                lineStyle: {
                  normal: {
                    width: 4,
                    color: '#8ba2d2'
                  }
                },
                itemStyle: {
                  color: '#8ba2d2',
                  borderWidth: 2
                },
                tooltip: {
                  show: true
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
                          color: 'rgba(76, 228, 230, 0.3)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(76, 228, 230, 0)'
                        }
                      ],
                      false
                    ),
                    shadowColor: 'rgba(76, 228, 230, 0.5)',
                    shadowBlur: 20
                  }
                },
                data: incomeData
              }
            ]
          }
        myChart.setOption(option)
        window.addEventListener('resize', function() {
          myChart.resize()
        })
      }
    },
    // 查询
    handleQuery() {
      let obj = {}
      // 判断年季度月
      if (this.radio == 3) {
        obj.level = 1
        this.xcoordinate = [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月'
        ]
      } else if (this.radio == 6) {
        obj.level = 2
        if (this.queryParams.outlets == '22') {
          this.xcoordinate = ['1月', '2月', '3月']
        } else if (this.queryParams.outlets == '33') {
          this.xcoordinate = ['4月', '5月', '6月']
        } else {
          this.xcoordinate =
            this.queryParams.outlets == '44'
              ? ['7月', '8月', '9月']
              : ['10月', '11月', '12月']
        }
      } else {
        obj.level = 3
        const arr = []
        for (let i = 1; i <= 30; i++) {
          arr.push(i + '号')
        }
        this.xcoordinate = arr
      }
      // 判断
      if (this.radio == 6) {
        obj.queryTime =
          this.value2.substr(0, 4) + '-' + this.queryParams.outlets
        this.dateList = [
          this.value2.substr(0, 4) - 1 + '',
          this.value2.substr(0, 4)
        ]
        console.log(this.dateList, this.value2.substr(0, 4))
      } else if (this.radio == 3) {
        obj.queryTime = this.value2 === '' ? '2021-02' : this.value2
        if (this.value2) {
          this.dateList = [
            this.value2.substr(0, 4) - 1 + '',
            this.value2.substr(0, 4)
          ]
        } else {
          this.dateList = ['2019', '2020']
        }

        console.log(this.dateList, this.value2.substr(0, 4))
      } else {
        obj.queryTime = this.value2
        this.dateList = [
          this.value2.substr(0, 4) - 1 + '',
          this.value2.substr(0, 4)
        ]
        console.log(this.dateList, this.value2.substr(0, 4))
      }
      // console.log(this.dateList)
      this.time1 = this.value2.substr(0, 4)
      this.time2 = this.value2.substr(0, 4) - 1
      if (obj.level)
        getTime(obj).then((res) => {
          this.getEchartData(res.data.result, this.xcoordinate, this.dateList)
        })
      getCost(obj).then((res) => {
        this.getEchartData1(res.data.result, this.xcoordinate, this.dateList)
      })
      getCharg(obj).then((res) => {
        this.getEchartData2(res.data.result, this.xcoordinate, this.dateList)
      })
      getAnalysis(obj).then((res) => {
        this.getgrand = res.data.result
        console.log('11111111111111111111111', res)
      })
    },
    // 下拉选择
    handleCommand(e) {
      this.defaultsel = e
    },
    getYears() {
      let myDate = new Date()
      let startYear = myDate.getFullYear() - 5 //起始年份
      let endYear = myDate.getFullYear() //结束年份
      let arr = []
      for (let i = startYear; i <= endYear; i++) {
        arr.push({
          value: i,
          label: i
        })
      }
      return arr
    }
  }
}
</script>
<style lang="scss" scoped>
.card {
  height: 30px;
  padding: 5px 0;
  .title {
    height: 28px;
    line-height: 28px;
    border-left: 4px solid #09c5c6;
    float: left;
  }
  .titleright {
    float: right;
    margin-right: 20px;
    ::v-deep.el-input__icon {
      line-height: 32px;
    }
  }
}
.box {
  clear: both;
  display: flex;
  justify-content: space-between;
  width: 80.1rem;
  .long {
    background: url('../../../assets/smartdispatch/cdsc.png') no-repeat;
    background-size: 100%;
  }
  .long1 {
    background: url('../../../assets/smartdispatch/sclyl.png') no-repeat;
    background-size: 100%;
  }
  .long2 {
    background: url('../../../assets/smartdispatch/gllyl.png') no-repeat;
    background-size: 100%;
  }
  .long3 {
    background: url('../../../assets/smartdispatch/fydf.png') no-repeat;
    background-size: 100%;
  }
  .box1 {
    background-color: #fff;
    width: 277px;
    height: 90px;
    border-radius: 5px;
    margin-top: 10px;
    color: white;
    .name {
      margin: 10px 10px 0 20px;
      display: inline-block;
      // width: 230px;
    }
    .grade {
      margin-top: 5px;
      font-size: 20px;
      font-weight: 600;
    }
  }
}
.echart {
  background-color: #fff;
  border-radius: 5px;
  margin-top: 10px;
}
.chartstitle {
  font-size: 18px;
  font-weight: bold;
  color: #000;
  margin-left: 5px;
}
</style>
