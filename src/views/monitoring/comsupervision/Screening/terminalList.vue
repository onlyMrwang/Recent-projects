<template>
    <!--基站列表-->
    <div>
        <div class="terminalList">
            <div class="termianItem">
                <div class="header">
                    充电终端状态分析
                </div>
               <div class="tjContent" >
                   <div class="tjItem" v-for="(item,index) in myChart1.label" :key="index">
                        <div class="lableText">
                            {{myChart1.label[index]}}
                        </div>
                        <div class="zhuContrng">
                            <div class="zhuItem">
                                <div class="zhuVal" :style="{width:(myChart1.total==0?0:myChart1.sums[index])*100+'%',background:myChart1.color[index]}"></div>
                            </div>
                        </div>
                       <div class="tjText">
                        <span class="textStyle">{{myChart1.data[index]}}</span>
                        <span>{{((myChart1.total==0?0:myChart1.data[index]/myChart1.total)*100).toFixed(2)}}%</span>
                       </div>
                   </div>
               </div>
            </div>
            <div class="termianItem termianItemTow">
                <div class="header">
                    充电设备类型分析
                </div>
                <div class="tjContent">
                    <div class="tjItem"  v-for="(item,index) in myChart2.deviceTypes" :key="index">
                        <div class="lableText">
                            {{item.deviceTypeName.substr(0,item.deviceTypeName.length-3)}}
                        </div>
                        <div class="zhuContrng">
                            <div class="zhuItem">
                                <div class="zhuVal" :style="{width:((myChart2.total==0?0:item.deviceTypeNum/myChart2.total)*100)+'%'}"></div>
                            </div>
                        </div>
                        <div class="tjText">
                            <span class="textStyle">{{item.deviceTypeNum}}</span>
                            <span>{{((myChart2.total==0?0:item.deviceTypeNum/myChart2.total)*100).toFixed(2)}}%</span>
                        </div>
                    </div>

                </div>
            </div>
            <div class="termianItem">
                <div class="header">
                    告警分析
                </div>
                <div class="tjContent" >
                    <div class="tjItem" v-for="(item,index) in myChart3.infos" :key="index">
                        <div class="lableText">
                            {{item.severity=='1'?'一':item.severity=='2'?'二':'三'}}级告警
                        </div>
                        <div class="zhuContrng">
                            <div class="zhuItem">
                                <!--color: ['#F53131','#F76B1C ', '#3EAAC6'],-->
                                <div class="zhuVal" :style="{width:myChart3.alarmTotal==0?0:(Number(item.alertNum)/myChart3.alarmTotal*100)+'%',background:item.severity=='1'?'linear-gradient(to right, #F53131, #FA8369)':item.severity=='2'?'linear-gradient(to right, #FAD961, #F76B1C)':'linear-gradient(to right, #3EAAC6, #74D7DB)'}" ></div>
                            </div>
                        </div>
                        <div class="tjText">
                            <span class="textStyle">{{item.alertNum}}</span>
                            <!--<span>{{((Number(item.alertNum)/myChart3.alarmTotal)*100).toFixed(2)}}%</span>-->
                            <span>{{(myChart3.alarmTotal==0?0:(Number(item.alertNum)/myChart3.alarmTotal)*100).toFixed(2)}}%</span>
                        </div>
                    </div>
                    <div class="gjSun">
                        告警总数: <b>{{myChart3.alarmTotal}}</b>
                    </div>
                </div>
            </div>
        </div>
        <div class="teblaContent">
            <div class="headerBox">
                <div class="title">&nbsp;&nbsp;网点监控信息列表</div>
            </div>
            <div class="tables">
                <el-table :data="tableList" style="width: 100%" border
                          :header-cell-style="tableHeaderStyle">
                    <el-table-column
                            label="序号"
                            align="center"
                            type="index"
                            width="50">
                    </el-table-column>
                    <el-table-column
                            width="110"
                            prop="websiteName"
                            label="网点"
                            align="center"
                    ></el-table-column>
                    <el-table-column
                            width="130"
                            prop="deviceOnlineRate"
                            label="充电桩在线率(%)"
                            align="center"
                    ></el-table-column>
                    <el-table-column
                            width="130"
                            prop="faultNum"
                            label="充电桩故障数(个)"
                            align="center"
                    ></el-table-column>
                    <el-table-column
                            width="130"
                            prop="onlineNum"
                            label="充电桩在线数(个)"
                            align="center"
                    ></el-table-column>
                    <el-table-column
                            width="130"
                            prop="freeNum"
                            label="充电桩空闲数(个)"
                            align="center"
                    ></el-table-column>
                    <el-table-column
                            width="100"
                            prop="chargeTotalEle"
                            label="总充电量(度)"
                            align="center"
                    ></el-table-column>
                    <el-table-column
                            prop="chargeTotalCount"
                            label="总充电次数"
                            align="center"
                    ></el-table-column>
                    <el-table-column
                            prop="deviceTotal"
                            label="设备总数"
                            align="center"
                    ></el-table-column>
                    <el-table-column
                            prop="deviceTotal"
                            label="操作"
                            align="center"
                    >
                        <template slot-scope="scope">
                            <el-link
                                    :underline="false"
                                    type="primary"
                                    @click="toSendorder(scope.row)"
                                    style="margin-right: 10px;">详情</el-link>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination" v-if="tableList.length > 0">
                    <el-pagination

                            background
                            @current-change="handleCurrentChange"
                            :current-page.sync="chargingGun.pageNo"
                            :page-size.sync="chargingGun.pageSize"
                            layout="total, prev, pager, next"
                            :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getAlertAnalyze} from "@/api/monitoring/comsupervision.js";
    import bus from '@/utils/bus'
    export default {
        name: "terminal-list",
        data(){
            return {
                tableList:[],
                myChart1:{
                    data:[],
                    sums:[],
                    color: ['linear-gradient(to right, #69FF87 , #13D73D)', 'linear-gradient(to right, #3EAAC6, #74D7DB)','linear-gradient(to right, #727CF5, #ABA7FC)', 'linear-gradient(to right, #F53131, #FA8369)', 'linear-gradient(to right, #ACACAC, #DADADA)'],
                    label:['充电中', '空闲', '预约', '故障', '离线'],
                    total:"",
                },
                myChart2:{
                    data:[],
                    color: ['#c23531'],
                    label:[]
                },
                myChart3:{
                    data:[],
                    color: ['#F53131','#F76B1C ', '#3EAAC6'],
                    label:[]
                },

                chargingGun:{
                    orgId:"",
                    websiteName:"",
                    pageNo:1,
                    pageSize:5,
                },
                total:20,
            }
        },

        mounted(){

        },
        methods: {
            //获取桩信息
            async getAlertAnalyzes(type,url){
                const res = await getAlertAnalyze(this.chargingGun,url);
                if(res.code === 200) {
                    if(type==1){
                        console.log(res);
                        this.myChart1.data=[];
                        this.myChart1.data.push(res.data.rechargeNum)
                        this.myChart1.data.push(res.data.freeNum)
                        this.myChart1.data.push(res.data.appointmentNum)
                        this.myChart1.data.push(res.data.faultNum)
                        this.myChart1.data.push(res.data.offlineNum)

                        this.myChart1.sums.push(res.data.rechargeRate)
                        this.myChart1.sums.push(res.data.freeRate)
                        this.myChart1.sums.push(res.data.appointmentRate)
                        this.myChart1.sums.push(res.data.faultRate)
                        this.myChart1.sums.push(res.data.offlineRate)
                        this.myChart1.total=res.data.total
                        console.log( this.myChart1);
                    }
                    if(type==2){
                        this.myChart2=res.data;
                    }
                    if(type==3){
                        this.myChart3=res.data;
                        console.log(this.myChart3)
                    }
                    if(type==4){
                        this.tableList=res.data;
                        this.total=res.total
                    }

                }
            },
            toSendorder(val){
                val.type=5
                bus.$emit('clickOpen', val);
            },
            handleCurrentChange(val){
                this.chargingGun.pageNo=val;
                this.getAlertAnalyzes(4,'/monitor/website/websiteList');
            }
        },
        created(){
            this.getAlertAnalyzes(3,'/monitor/website/alertAnalyze');
            this.getAlertAnalyzes(1,'/monitor/website/chargeDeviceStatusStat');
            this.getAlertAnalyzes(2,'/monitor/website/chargeDeviceTypeStat');
            this.getAlertAnalyzes(4,'/monitor/website/websiteList');
        },
    }
</script>

<style scoped lang="scss">
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

    }
    .terminalList{
        display: flex;
    }
    .termianItemTow{
        margin: 0 12px;
    }
    .tjContent{
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        height: 145px;
        border-radius: 4px;
        .tjItem{
            display: flex;
            margin-bottom: 5px;
        }
        .tjItem>div{
            flex: 1;
        }
        .lableText{
            max-width: 68px;
            font-size: 13px;
            color: #8E8E8E;
            letter-spacing: 0;
            text-align: right;
            line-height: 24px;
            font-weight: 400;
            margin-right: 10px;
        }
        .zhuContrng{
            /*max-width: 150px;*/
            height: 20px;
            line-height: 20px;
            margin-right: 16px;

        }
        .zhuItem{
            display: inline-block;
            position: relative;
            height: 6px;
            background-color: #E4EEEE;
            width: 100%;
            border-radius: 5px;
        }
        .zhuVal{
            position: absolute;
            left: 0;
            top: 0;
            background:linear-gradient(to right, #3EAAC6, #74D7DB);
            z-index: 100;
            width: 50%;
            height: 6px;
            border-radius: 5px;
        }
        .tjText{
            max-width: 80px;
            text-align: right;
            text-align: left;
            span{
                font-size: 12px;
                color: #37669C;
                letter-spacing: 0;
                line-height: 24px;
                font-weight: 400;
            }
            .textStyle{
                font-weight: bold;
                min-width: 30px !important;
                font-size: 14px;
                color: #222222;
                letter-spacing: 0;
                line-height: 24px;
                font-weight: 600;
                margin-right: 10px;
                /*text-align: left !important;*/
            }
        }
        .gjSun{
            height: 23px;
            line-height: 23px;
            background: #F6F6F6;
            border-radius: 3px;
            text-align: center;
            font-size: 13px;
            color: #8E8E8E;
            letter-spacing: 0;
            font-weight: 400;
            b{
                font-size: 14px;
                color: #222222;
                letter-spacing: 0;
                font-weight: 600;
            }
            /*margin: 0 10%;*/
        }
    }
    .terminalList{
        width: 100%;
    }
    .termianItem{
        padding: 12px 18px;
        background-color: #fff;
        display: inline-block;
        flex: 1;
        width:29.8%;
    }
   .termianItem  .header{
        font-size: 15px;
        padding-bottom: 15px;
        color: #222;
    }
    .termianEchars{
        display: flex;
    }
    .termianEchars>div{
        flex: 1;
    }
    .textContentItem{
        margin-top: 15px;
    }
    .jiao{
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background-color: #50B8CD;
        display: inline-block;
    }
    .textContentItem{
        font-size: 12px;
        color:#8E8E8E ;
    }
    .bodys{
        overflow: hidden;
        margin-top: 7px;
    }
    .bodys b{
        color:#222;
        display: inline-block;
        font-size: 14px;
    }
    .bodys span{
        float: right;
        color: #37778B;
    }
    .teblaContent{
        /*margin: 20px;*/
        margin-top: 12px;
        background-color: #fff;
        padding-bottom:12px;
    }
    .tables{
        padding: 0 12px;

    }
</style>