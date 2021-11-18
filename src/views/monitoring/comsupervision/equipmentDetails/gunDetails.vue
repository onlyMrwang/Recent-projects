<template>
  <!--机器人详情-->
  <div class="box">
    <div class="carDetails">
      <div class="headerBox">
        <div class="title">&nbsp;&nbsp;充电设备详情</div>
        <div class="back" @click="goBack">
          <img :src="backImg" style="width: 16px;height: 14px;" />
        </div>
      </div>
      <div class="itemContent">
        <div class="line">
          <div class="item">
            <div class="label">充电设备名称:</div>
            <div class="value">{{ pileDetail.poleName }}</div>
          </div>
          <div class="item">
            <div class="label">枪号:</div>
            <div class="value">{{ infos.gunNo }}</div>
          </div>
          <div class="item">
            <div class="label">所属组织机构:</div>
            <div class="value">{{ pileDetail.orgName }}</div>
          </div>
        </div>
        <div class="line">
          <div class="item">
            <div class="label">所属网点:</div>
            <div class="value">{{ pileDetail.websiteName }}</div>
          </div>
          <div class="item">
            <div class="label">设备类型:</div>
            <div class="value">
              {{ getEquipType(pileDetail.deviceType)}}
            </div>
          </div>
          <div class="item">
            <div class="label">桩状态:</div>
            <div class="value">
              <span style="color: #41B8C3" v-if="pileDetail.status == '1'"
                >在线</span
              >
              <span style="color: red" v-else>离线</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="menuContent">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全景" name="quanjing">
          <qjDetail :infos="info"></qjDetail>
        </el-tab-pane>
        <el-tab-pane label="实时告警" name="shishi">
          <div class="titleHeader">
            <div class="title">
              当日告警数据 (<span class="label">一级告警: </span
              ><span class="value" @click="toAlarm(1)"
                >{{ alarmtrendTotal[1] }}次</span
              ><span class="d">, </span> <span class="label">二级告警: </span
              ><span class="value" @click="toAlarm(2)"
                >{{ alarmtrendTotal[2] }}次</span
              ><span class="d">, </span> <span class="label">三级告警: </span
              ><span class="value" @click="toAlarm(3)"
                >{{ alarmtrendTotal[3] }}次</span
              >)
            </div>
          </div>
          <div id="myChart"></div>
        </el-tab-pane>
        <el-tab-pane label="过程数据" name="guocheng">
          <chargingProcess
            :infos="info"
            :pileDetail="pileDetail"
          ></chargingProcess>
        </el-tab-pane>
        <el-tab-pane label="在线情况" name="zaixian">
          <div id="myChart1"></div>
        </el-tab-pane>
        <el-tab-pane label="历史告警" name="lishi">
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
          <div class="titleHeader">
            <div class="title">
              告警数据 (<span class="label">一级告警: </span
              ><span class="value" @click="toAlarm(1,'历史告警')"
                >{{ hisalarmTotal[1] }}次</span
              ><span class="d">, </span> <span class="label">二级告警: </span
              ><span class="value" @click="toAlarm(2,'历史告警')"
                >{{ hisalarmTotal[2] }}次</span
              ><span class="d">, </span> <span class="label">三级告警: </span
              ><span class="value" @click="toAlarm(3,'历史告警')"
                >{{ hisalarmTotal[3] }}次</span
              >)
            </div>
          </div>
          <!-- 历史告警折线图 -->
          <div id="myChart2"></div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import qjDetail from "./qjDetail"; //全景数据
import chargingProcess from "./chargingProcess"; //过程数据
import {
  getalarmtrend,
  getPileDetails,
  getOnlineduration1h,
  getHisalarm1h,
} from "@/api/monitoring/comsupervision.js";
import { mapGetters } from "vuex";
import moment from "moment";
import * as echarts from "echarts";
export default {
  components: {
    qjDetail,
    chargingProcess,
  },
  data() {
    return {
      myChart:{},
      myChart1:{},
      value1: "",
      pileDetail: {},
      activeName: "quanjing",
      info: {},
      backImg: require("@/assets/monitoring/type/fanhui.svg"),
      timeList: [
        `${moment()
          .subtract(6, "days")
          .format("YYYY-MM-DD HH:mm:ss")}`,
        `${moment().format("yyyy-MM-DD HH:mm:ss")}`,
      ],
      hisAlarmConf: {
        gunNo: null,
        deviceNo: null,
        startTime: null,
        endTime: null,
      },
      alarmtrendTotal: {
        1: "0",
        2: "0",
        3: "0",
      },
      hisalarmTotal: {
        1: "0",
        2: "0",
        3: "0",
      },
    };
  },
  props: {
    infos: {
      type: Object,
      required: false,
    },
  },
  //监听父组件给的值
  watch: {
    infos: {
      handler(newName, oldName) {
        this.info = newName;
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters(["routersList",'dictInfo']),
  },
  created() {
      console.log(this.dictInfo.chargEquipType);
    this.info = this.infos;
    this.hisAlarmConf.gunNo = this.infos.gunNo;
    this.hisAlarmConf.deviceNo = this.infos.deviceNo;
    this.getPileDetails();
  },
  mounted() {
    // 实时告警
    this.getalarmtrend();
    // 在线情况
    this.getOnlineduration1h();
    // 历史告警
    this.getHisalarm1h();
  },
  methods: {
    getEquipType(val){
        let EquipType=''
        for(var i=0;i<this.dictInfo.chargEquipType.length;i++){
            if(val==this.dictInfo.chargEquipType[i].value){
                EquipType=this.dictInfo.chargEquipType[i].label
            }
        }
        return EquipType;
    },
    handleClick(tab, event) {
        console.log(this.activeName)
    },
    toSearch() {
      this.hisAlarmConf.startTime =
        this.timeList.length > 0 ? this.timeList[0] : null;
      this.hisAlarmConf.endTime =
        this.timeList.length > 0 ? this.timeList[1] : null;
      // 历史告警
      this.getHisalarm1h();
    },
    resetSearch() {
      this.timeList = [];
      this.hisAlarmConf = {
        gunNo: this.infos.gunNo,
        deviceNo: this.infos.deviceNo,
        startTime: null,
        endTime: null,
      };
    },
    // 跳转到告警中心
    toAlarm(type,name,startTime,endTime) {
      console.log(this.timeList)
        let newDate={};
        newDate.type = type;
        newDate.websiteName = this.pileDetail.websiteName;
        newDate.poleName = this.pileDetail.poleName;
        newDate.poleNo = this.pileDetail.poleNo;
        newDate.gunNum = this.infos.gunNo;
        if(startTime){
            newDate.startTime = startTime; // 开始时间
            newDate.endTime = endTime;//结束事件
        }else{
            if(this.activeName=="lishi"){
                if(this.timeList){
                    newDate.startTime = this.timeList[0]; // 开始时间
                    newDate.endTime = this.timeList[1];//结束事件
                }
            }
        }
      var back = this.$router.resolve({
        query: newDate,
        name: name?name:"告警监控中心",
      });
      window.open(back.href, "_blank");
    },
    goBack() {
      this.$emit("changeType", this.info);
    },
    //获取桩信息
    async getPileDetails() {
      const res = await getPileDetails({ poleNo: this.info.deviceNo });
      if (res.code === 200) {
        this.pileDetail = res.data;
      }
    },
    //获取历史告警
    async getHisalarm1h() {
      const res = await getHisalarm1h(this.hisAlarmConf);
      if (res.code === 200) {
        this.drawLine(res.data, "myChart2");
        res.data.map((item) => {
          this.hisalarmTotal[Number(item.severity)] = item.alertNum || "0";
        });
      }
    },
    //获取在线情况
    async getOnlineduration1h() {
      const res = await getOnlineduration1h(this.info);
      if (res.code === 200) {
        this.drawLine1(res.data);
      }
    },
    //在线情况柱状图
    drawLine1(val) {
      let dateDate = [];
      let dataContent = [];
      for (var i = 0; i < val.length; i++) {
        dateDate.push(val[i].time + ":00");
        dataContent.push(val[i].onlineTime);
        // dataContent.push(val[i].time + ":00");
      }
      let max = Math.ceil(Math.max(...dataContent) / 5) * 5;
      max = max > 5 ? max : 5;
      let myChart1 = document.getElementById("myChart1");
      myChart1.style.width = window.innerWidth - 350 + "px";
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(myChart1);
      // 绘制图表
      myChart.setOption({
        title: {
          text: "今日在线情况分析",
          textStyle: {
            fontSize: 14,
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
        },
        xAxis: {
          type: "category",
          data: dateDate,
          axisLine: {
            lineStyle: {
              color: "#cacccf",
            },
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          name: "在线时长（min）",
          nameTextStyle: {
            padding: [0, 0, 0, 32],
          },
          type: "value",
          axisLine: { show: false },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          axisTick: {
            show: false,
          },
          min: 0,
          max: max,
          minInterval: 1,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        series: [
          {
            data: dataContent,
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#82e3e6" },
                { offset: 1, color: "#6ebce4" },
              ]),
              barBorderRadius: [4, 4, 0, 0],
            },
            type: "bar",
            barWidth: 20, //柱图宽度
            // showBackground: true,
            // backgroundStyle: {
            //     color: '#6395f9'
            // }
          },
        ],
      });
    },
    // 获取实时告警数据
    async getalarmtrend() {
      const res = await getalarmtrend(this.info);
      if (res.code === 200) {
        res.data.map((item) => {
          this.alarmtrendTotal[Number(item.severity)] = item.alertNum || "0";
        });
        this.drawLine(res.data, "myChart");
      }
    },

    //ecars画事实数据
    drawLine(val, id) {
      let xData = [];
      let seriesData = [];
      let max = 5;
      let myChart2 = document.getElementById(id);
      myChart2.removeAttribute("_echarts_instance_");
      myChart2.style.width = window.innerWidth - 350 + "px";
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(myChart2);
      if (val.length > 0) {
        val.map((data, index) => {
          const yData = [];
          data.alarmStats.map((item) => {
            if (index === 0) {
              if (id === "myChart") {
                xData.push(item.time + ":00");
              } else {
                xData.push(item.time);
              }
            }
            yData.push(item.alarmCount);
          });
          let tempMax = Math.ceil(Math.max(...yData) / 5) * 5;
          max = max > tempMax ? max : tempMax;
          seriesData.push({
            name:
              Number(data.severity) === 1
                ? "一级告警"
                : Number(data.severity) === 2
                ? "二级告警"
                : "三级告警",
            data: yData,
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 3,
            color:
              Number(data.severity) === 1
                ? "#DB1313"
                : Number(data.severity) === 2
                ? "#FF9800"
                : "#5CCAE8",
          });
        });
        // 绘制图表
          this.myChart .setOption({
          tooltip: {
            trigger: "axis",
            formatter(params) {
              let html = params[0].name + "<br />";
              html +=
                params[0].marker +
                params[0].seriesName +
                ":" +
                params[0].value +
                "次 <br />";
              if (params.length > 1) {
                html +=
                  params[1].marker +
                  params[1].seriesName +
                  ":" +
                  params[1].value +
                  "次 <br />";
              }
              if (params.length > 2) {
                html +=
                  params[2].marker +
                  params[2].seriesName +
                  ":" +
                  params[2].value +
                  "次";
              }
              return html;
            },
          },
          color: ["#DB1313", "#FF9800", "#5CCAE8"],
          legend: {
            icon: "rect",
            textStyle: {
              fontSize: 12,
              color: "#999",
            },
            top: 0,
            itemHeight: 5,
            itemWidth: 15,
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "10%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
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
            name: "(次)",
            type: "value",
            min: 0,
            max: max,
            minInterval: 1,
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
            splitNumber: 5,
          },
          series: seriesData,
        });
      } else {
        const elementImg = require("@/assets/monitoring/type/noData.png"); // 暂无数据图片路径
        myChart2.style.display = "flex";
        myChart2.style.justifyContent = "center"; // 设置元素水平居中
        myChart2.style.alignItems = "center"; // 垂直居中
        myChart2.style.flexDirection = "column"; // 垂直居中
        myChart2.style.borderBottom = "1px solid #dedede"; // 垂直居中
        myChart2.removeChild(myChart2.firstChild); // 移除第一个节点，即里面的要放置图表的div
        const mainImg = document.createElement("img");
        myChart2.appendChild(mainImg); // 添加要显示的图片
        mainImg.style.width = "auto";
        mainImg.style.height = "auto";
        mainImg.style.maxWidth = "20%";
        mainImg.style.maxHeight = "20%";
        mainImg.style.marginBottom = "8px";
        mainImg.src = elementImg; // 要显示图片的src
        const span = document.createElement("span");
        myChart2.appendChild(span);
        span.innerText = "暂无数据";
        span.style.color = "#aaa";
        span.style.fontSize = "14px";
        return {}; // 返回空对象
      }
        this.myChart.on('click', params => {
            console.log(params.dataIndex);
            let data = {
                x: params.name,
                y: params.value
            }
            console.log(data)
            let type = (params.seriesName=='一级告警'?1:params.seriesName=='二级告警'?2:3);//告警类型
            let startTime="";//开始时间
            let endTime="";//结束时间
            let name=''
            if(this.activeName=='lishi'){
                startTime = params.name+ ' 00:00:01'
                endTime = params.name+ ' 23:59:59'
                name='历史告警'
            }else{
                startTime = this.getNewDates()+' '+(Number(params.dataIndex)-1)+':00';
                endTime = this.getNewDates()+' '+params.name;
                name='告警监控中心'
            }

            this.toAlarm(type,name,startTime,endTime)
        })
    },
    getNewDates(){
          var date = new Date();
          this.year = date.getFullYear();
          this.month = date.getMonth() + 1;
          this.date = date.getDate();

          var currentTime = this.year + "-" + this.month + "-" + this.date
          return currentTime
      }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";

#myChart {
  width: 100%;
  height: 400px;
}

#myChart1 {
  width: 100%;
  height: 400px;
}

#myChart2 {
  width: 100%;
  height: 400px;
}

.carDetails {
  width: 100%;
  overflow: hidden;
  background-color: #e4f3f5;
  color: #222;
  margin-bottom: 10px;
}
.headerBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 10px 20px 10px 0;
  .title {
    font-size: 16px;
    color: #222222;
    &::before {
      content: "|";
      color: $btnMainColor;
      height: 5px;
      width: 2px;
      background: $btnMainColor;
    }
  }
  .back {
    width: 36px;
    cursor: pointer;
    border: 1px solid #dedede;
    border-radius: 2px;
    text-align: center;
    // margin: -10px 0;
  }
}
.itemContent {
  background-color: #fff;
  padding-bottom: 10px;
  .line {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    .item {
      flex: 1;
      display: flex;
      align-items: center;
      .label {
        font-size: 14px;
        color: #8e8e8e;
        margin-right: 10px;
        width: 140px;
        text-align: right;
      }
      .value {
        font-size: 14px;
        color: #222222;
      }
    }
  }
}

.menuContent {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 15px;
  // width: calc(100% - 30px);
  .titleHeader {
    .title {
      font-size: 14px;
      .label {
        color: #999;
      }
      .value {
        color: #ff9800;
        cursor: pointer;
      }
      .d {
        color: #999;
      }
    }
  }
  .numBox {
    text-align: center;
    display: flex;
    align-items: center;
    // justify-content: center;
    margin-left: 30px;
    .numItem {
      margin-right: 20px;
      background-color: #f5f5f5;
      padding: 5px 15px;
      border-radius: 2px;
      .name {
        font-size: 14px;
        color: #999;
      }
      .num {
        margin-top: 10px;
        font-size: 16px;
        font-weight: 700;
        color: #666;
      }
    }
  }
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
</style>
