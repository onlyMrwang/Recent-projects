<template>
    <!--机器人详情-->
    <div class="robotDetails">
        <div class="carDetails">
            <div class="headerBox">
                <div class="title">&nbsp;&nbsp;自动充电机器人详情</div>
                <div class="back" @click="goBack">
                    <img :src="backImg"  style="width: 16px;height: 14px;" />
                </div>
            </div>
            <div class="itemContent">
                <div class="carItem">
                    <div class="carItemLt">
                      <label> 机器人名称:</label>
                        <span>{{pileDetail.robotName}}</span>
                    </div>
                    <div class="carItemLt">
                        <label>所属组织机构:</label>
                        <span>{{pileDetail.orgName}}</span>
                    </div>
                </div>
                <div class="carItem">
                    <div class="carItemLt">
                        <label>机器人型号:</label>
                        <span>{{pileDetail.robotMark}}</span>
                    </div>
                    <div class="carItemLt">
                        <label> 设备状态:</label>
                        <span style="color: rgb(65, 184, 195);">{{pileDetail.deviceStatus==1?'在线':'离线'}}</span>
                    </div>
                </div>
                <div class="carItem">
                    <div class="carItemLt">
                        <label>所属网点:</label>
                        <span>{{pileDetail.siteName}}</span>
                    </div>
                    <div class="carItemLt">
                        <label>所属充电设备编码:</label>
                        <span>{{pileDetail.deviceNo}}</span>
                    </div>


                </div>
            </div>
        </div>
        <div class="menuContent" >
            <div class="headerBox">
                <div class="title">&nbsp;&nbsp;实时告警</div>
            </div>
            <div class="titleHeader" >
                <div class="title" >当日告警数据
                    (
                  <span v-for="(item,index) in pileDetail.levels" :key="index" >
                    <span class="label" >
                       {{item.severity=='1'?'一':item.severity=='2'?'二':'三'}}级告警: </span>
                       <span class="value" @click="toAlarm(index+1)">{{item.alertNum}}次</span>
                    <span class="d" v-if="item.severity!='2'">, </span>
                  </span>
                  )
                </div>
            </div>
            <div id="myChart" style="height: 400px;"></div>
            <!--<div id="myChart" style="width: 900px;height:400px;"></div>-->
        </div>
    </div>
</template>

<script>
    import  qjDetail from './qjDetail'//全景数据
    import  chargingProcess from './chargingProcess'//过程数据
    import {getRobot,getPileDetails,getOnlineduration1h,getHisalarm1h} from '@/api/monitoring/comsupervision.js'
    export default {
        name: "robot-details",
        components:{
            qjDetail,chargingProcess
        },
        data(){
            return{
                backImg: require('@/assets/monitoring/type/fanhui.svg'),
                timeOptionRange: '',
                pileDetail:{},
                activeName:"",
                info:{},
            }
        },
        props:{
            infos:{
                type:Object,
                required:false
            },
        },
        //监听父组件给的值
        watch: {
            infos: {
                handler(newName, oldName) {
                    this.info = newName;
                    this.getRobot();
                },
                immediate: true
            },
        },
        mounted(){
            this.getRobot();
        },
        methods: {
            //返回方法
            goBack() {
                this.$emit('changeType',this.infos)
            },
            //点击告警级别方法
            toAlarm(type){
                let newDate={};
                newDate.type = type;
                newDate.siteName = this.pileDetail.siteName;
                newDate.robotName = this.pileDetail.robotName;
                newDate.robotNo = this.pileDetail.robotNo;

                var back=this.$router.resolve({
                    query:newDate,
                    name:"充电机器人告警"
                })
                window.open(back.href,'_blank')
            },
            //获取机器人详情
            async getRobot(){
                this.info.type=null
                const res = await getRobot(this.info);
                if(res.code === 200) {
                    this.pileDetail = res.data;
                    this.drawLine(res.data.levels);
                }
            },
            //ecars画事实数据
            drawLine(val){
                let  dateDate=[];//定义时间数组
                let  dataContent1=[];//定义一级报警数组
                let  dataContent2=[];//定义二级报警数组
                let  dataContent3=[];//定义三级报警数组
                for(var i=0;i<val.length;i++){
                    for(var z=0;z<val[i].alarmStats.length;z++){
                        if(val[i].severity==='1'){
                            dataContent1.push(val[i].alarmStats[z].alarmCount);
                            dateDate.push(val[i].alarmStats[z].time + ':00')
                        }
                        if(val[i].severity==='2'){
                            dataContent2.push(val[i].alarmStats[z].alarmCount);
                        }
                        if(val[i].severity==='3'){
                            dataContent3.push(val[i].alarmStats[z].alarmCount);

                        }
                    }
                }
                let myChart2 = document.getElementById('myChart');
                myChart2.style.width = window.innerWidth - 350 + "px";
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(myChart2)
                // 绘制图表
                myChart.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    color: ['#DB1313', '#FF9800', '#5CCAE8'],
                    legend: {
                        data: [
                            {name: '一级告警', icon: 'rect',textStyle:{
                                    fontSize:12,
                                    color:'#999',
                                },},
                            {name: '二级告警', icon: 'rect',textStyle:{
                                    fontSize:12,
                                    color:'#999'
                                },},
                            // {name: '三级告警', icon: 'rect',textStyle:{
                            //         fontSize:12,
                            //         color:'#999'
                            //     },},
                        ],
                        top: 0,
                        itemHeight: 5,
                        itemWidth: 15,
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '10%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: dateDate,
                        axisTick:{
                            show: false
                        },
                    },
                    yAxis: {
                        name: '(次)',
                        type: 'value',
                        min: 5,
                        axisLine:{
                            show: false
                        },
                        axisTick:{
                            show:false
                        },
                        splitLine:{
                            show: true,
                            lineStyle: {
                                type: 'dashed' // y轴分割线类型
                            }
                        }
                    },
                    series: [
                        {
                            name: '一级告警',
                            type: 'line',
                            stack: '总量',
                            data: dataContent1,
                            symbol: 'none',
                            smooth:true,
                        },
                        {
                            name: '二级告警',
                            type: 'line',
                            stack: '总量',
                            data: dataContent2,
                            symbol: 'none',
                            smooth:true,
                        },
                        {
                            name: '三级告警',
                            type: 'line',
                            stack: '总量',
                            data: dataContent3,
                            symbol: 'none',
                            smooth:true,
                        }
                    ]
                });
            },
        },
        created(){
            this.info=this.infos
        }
    }
</script>
<style lang="scss">
    .robotDetails{
        .el-tabs__item{
            background-color: #fff !important;
            /*color: #4bd6a2;*/
            color: #777;
        }
        .el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
            border-bottom-color:#4bd6a2;
        }
        .is-active{
            color: #4bd6a2;
        }
    }
</style>
<style lang="scss" scoped>
    @import "@/assets/styles/global.scss";
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
                  content: '|';
                  color:  $btnMainColor;
                  height: 5px;
                  width: 2px;
                  background: $btnMainColor;
              }
          }
          .back {
              width: 36px;
              cursor: pointer;
              border: 1px solid #DEDEDE;
              border-radius: 2px;
              text-align: center;
              // margin: -10px 0;
          }
      }
    .carDetails{
        width: 100%;
        overflow: hidden;
        background-color: #E4F3F5;
        color: #222;
        /*padding: 10px;*/
        margin-bottom: 10px;
        /*display: flex;*/
    }
    .header{
        background-color:#fff;
        margin-bottom: 10px;
        color: #222222;
        letter-spacing: 0;
        font-weight: 500;
        font-size: 15px;
        padding: 10px 0;
        border: 0;
    }
    .header span{
        display: inline-block;
        border-left:3px solid rgb(0, 153, 153);
        padding-left: 10px;
    }
    .itemContent{
        background-color: #fff;
        overflow: hidden;
        padding: 0 0 10px 0;
    }
    .itemContent label{
        width: 120px;
    }
    .carItem{
        width: 25%;
        font-size: 13px;
        float: left;
    }
    .carItem>div{
        height: 32px;
        line-height: 32px;
    }
    .carItem label{
        margin-left: 10px;
        display: inline-block;
        margin-right: 3%;
        text-align: right;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        color: #8E8E8E;
        letter-spacing: 0;
        text-align: right;
        line-height: 26px;
        font-weight: 400;
    }
    .carItemRt{
        /*overflow: hidden;*/
    }
    .carItemLt{
        height: 32px;
        line-height: 32px;
    }
    .carItemLt span{
        display: inline-block;
        width:50%;
        font-size: 14px;
        color: #222222;
        letter-spacing: 0;
        line-height: 26px;
        font-weight: 400;
    }
    .menuContent{
        background-color: #fff;
        .titleHeader {
            .title {
                margin-left: 12px;
                font-size: 14px;
                .label {
                    color: #999;
                }
                .value {
                    color: #FF9800;
                    cursor: pointer;
                }
                .d {
                    color: #999;
                }
            }
        }
    }
</style>