<template>
  <div class="qjDateils">
    <div class="echarsDetail">
      <div class="echarsDetailItem">
        <div id="myCharts" style="width: 150px;height: 150px;"></div>
        <div class="title" style="text-align: center">充电输出电压(V)</div>
      </div>
      <div class="echarsDetailItem">
        <div id="myCharts1" style="width: 150px;height: 150px;"></div>
        <div class="title" style="text-align: center">充电输出电流(A)</div>
      </div>
      <div class="echarsDetailItem">
        <div id="myCharts2" style="width: 150px;height: 150px;"></div>
        <div class="title" style="text-align: center">SOC(%)</div>
      </div>
    </div>
    <div class="sjDetails">
      <h3>充电过程数据</h3>
      <div class="sjDetailsContent">
        <div class="sjDetailsItem" :title="realcharge.monomerHighVDC || '-'">
          <label>单体最高电压(V)</label>
          {{ realcharge.monomerHighVDC || '-' }}
        </div>
        <div class="sjDetailsItem" :title="realcharge.monomerLowVDC || '-'">
          <label>单体最低电压(V)</label>
          {{ realcharge.monomerLowVDC || '-' }}
        </div>
        <div class="sjDetailsItem" :title="realcharge.batteryHigTemp || '-'">
          <label>电池最高温度(°C)</label>
          {{ realcharge.batteryHigTemp || '-' }}
        </div>
        <div class="sjDetailsItem" :title="realcharge.batteryLowTemp || '-'">
          <label>电池最低温度(°C)</label>
          {{ realcharge.batteryLowTemp || '-' }}
        </div>
        <div class="sjDetailsItem" :title="realcharge.batteryNewVDC || '-'">
          <label>电池当前电压(V)</label>
          {{ realcharge.batteryNewVDC || '-' }}
        </div>
        <div class="sjDetailsItem" :title="realcharge.batteryNewEle || '-'">
          <label>电池当前电流(A)</label>
          {{ realcharge.batteryNewEle || '-' }}
        </div>
        <div class="sjDetailsItem" :title="realcharge.startSOC || '-'">
          <label>开始SOC(%)</label>
          {{ realcharge.startSOC || '-' }}
        </div>
        <div class="sjDetailsItem" :title="realcharge.newSOC || '-'">
          <label>当前SOC(%)</label>
          {{ realcharge.newSOC || '-' }}
        </div>
        <div class="sjDetailsItem" :title="realcharge.totalEnergy || '-'">
          <label>累计充电电能(kWh)</label>
          {{ realcharge.totalEnergy || '-' }}
        </div>
        <div class="sjDetailsItem" :title="realcharge.totalTime || '-'">
          <label>累计充电时间(分钟)</label>
          {{ realcharge.totalTime || '-' }}
        </div>
        <div class="sjDetailsItem" :title="realcharge.residueTime || '-'">
          <label>当前充电剩余时间(分钟)</label>
          {{ realcharge.residueTime || '-' }}
        </div>
        <div class="sjDetailsItem" :title="realcharge.chargeTimes || '-'">
          <label></label>
          <!--{{ realcharge.chargeTimes || '-'}}-->
        </div>
      </div>
    </div>
    <div class="sjDetails sjDetail">
      <h3>充电对象信息</h3>
      <div class="sjDetailsContent">
        <div class="sjDetailsItem" :title="realcharge.orderNo || '-'">
          <label>订单号</label>
          {{ realcharge.orderNo || '-' }}
        </div>
        <div class="sjDetailsItem" :title="realcharge.cardNo || '-'">
          <label>充电卡号</label>
          {{ realcharge.cardNo || '-' }}
        </div>
        <div class="sjDetailsItem" :title="realcharge.chargeUserName || '-'">
          <label>用户姓名</label>
          {{ realcharge.chargeUserName || '-' }}
        </div>
        <div class="sjDetailsItem" :title="realcharge.plateNo || '-'">
          <label>车牌号</label>
          {{ realcharge.plateNo || '-' }}
        </div>
        <div class="sjDetailsItem" :title="realcharge.vin || '-'">
          <label>车辆VIN码</label>
          {{ realcharge.vIN || '-' }}
        </div>
        <div class="sjDetailsItem" :title="realcharge.carOrgName || '-'">
          <label>所属组织机构</label>
          {{ realcharge.carOrgName || '-' }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getRealcharge } from "@/api/monitoring/comsupervision.js";
export default {
  name: "qj-detail",
  data() {
    return {
      info: {},
      realcharge: {},
      intervalBox: null,
    };
  },
  props: {
    infos: {
      type: Object,
      required: false,
    },
  },
  created() {
    this.info = this.infos;
  },
  mounted() {
    this.info = this.infos;
    this.getRealcharges();
    let self = this
    self.intervalBox = setInterval(self.getRealcharges, 15000);
  },
  beforeDestroy() {
    const self = this;
    clearInterval(self.intervalBox);
  },
  methods: {
    async getRealcharges() {
      const res = await getRealcharge(this.info);
      if (res.code === 200) {
        this.realcharge = res.data;
        this.drawLine(
          "myCharts",
          res.data.outputVoltage || 0,
          1000,
          "充电输出电压(V)"
        );
        this.drawLine(
          "myCharts1",
          res.data.outputCurrent || 0,
          500,
          "充电输出电流(A)"
        );
        this.drawLine("myCharts2", res.data.newSOC || 0, 100, "SOC(%)");
      }
    },
    //ecars画事实数据
    drawLine(id, val, maxVal, name) {
      const axislineColor = new this.$echarts.graphic.LinearGradient(
        0,
        0,
        1,
        0,
        [
          {
            offset: 0.1,
            color: "rgba(0,187,190,0.32)",
          },
          {
            offset: 1,
            color: "rgba(6,194,191,1)",
          },
        ]
      );
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById(id));
      // 绘制图表
      myChart.setOption({
        series: [
          {
            type: "gauge",
            name: "总计",
            min: 0,
            max: maxVal,
            splitNumber: 4,
            itemStyle: {
              color: "#91C7AE",
              shadowColor: "rgba(0,138,255,0.45)",
              shadowBlur: 10,
              shadowOffsetX: 2,
              shadowOffsetY: 2,
              fontSize: 10,
            },
            axisLine: {
              lineStyle: {
                color: [[val/maxVal, axislineColor ],[1, '#E9F1F1',]],
                width: 10,
              },
            },
            itemStyle: {
              color: "#06C2BF",
            },
            pointer: {
              width: 4,
            },
            axisTick: {
            //   show: false,
              //   distance: -10,
              length: 16,
              splitNumber: 2,
              lineStyle: {
                color: "#E9F1F1",
                width: 2,
              },
            },
            splitLine: {
              show: false,
              distance: 10,
              length: 9,
              lineStyle: {
                color: "auto",
                width: 1,
              },
            },
            axisLabel: {
              show: false,
              color: "auto",
              distance: 10,
              fontSize: 12,
            },
            detail: {
              valueAnimation: true,
              formatter: "{value}",
              color: "auto",
              textStyle: {
                fontSize: 15,
                color: "#000",
              },
            },
            data: [
              {
                value: val,
                // name: name
              },
            ],
          },
        ],
      });
    },
  },
  //监听父组件给的值
  watch: {
    infos: {
      handler(newName, oldName) {
        this.info = newName;
        this.getRealcharges();
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.qjDateils {
  background-color: #fff;
  padding: 10px;
  padding-bottom: 20px;
  border-radius: 10px;
}
.echarsDetail {
  width: 100%;
  margin-bottom: 16px;
}
.echarsDetailItem {
  display: inline-block;
  margin-right: 90px;
  .title {
    text-align: center;
    font-size: 14px;
    color: #222222;
    margin-top: -20px;
  }
}
h3 {
  color: #222222;
  font-size: 14px;
  margin-bottom: 10px;
}
.sjDetails {
  display: inline-block;
  width: 66%;
}
.sjDetail {
  width: 32.8%;
  margin-left: 1%;
}
.sjDetailsContent {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #dedede;
  border-bottom: 0;
  border-left: 0;
}
.sjDetailsItem {
  width: 50%;
  color: #333;
  font-size: 13px;
  height: 32px;
  line-height: 32px;
  background-color: #fff;
  border-bottom: 1px solid #dedede;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.sjDetail .sjDetailsItem {
  width: 100%;
}
.sjDetailsItem label {
  display: inline-block;
  color: #999;
  background-color: #f7f7f7;
  border-right: 1px solid #dedede;
  border-left: 1px solid #dedede;
  /*background-color:#DEDEDE;*/
  width: 50%;
  height: 32px;
  text-align: right;
  margin-right: 10px;
  padding-right: 20px;
  color: #646464;
}
</style>
