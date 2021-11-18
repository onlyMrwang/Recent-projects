<template>
    <!--机器人详情-->
    <div class="robotDetails">
        <div class="carDetails">
            <div class="headerBox">
                <div class="title">&nbsp;&nbsp;充电设备详情</div>
                <div class="back" @click="goBack">
                    <img :src="backImg"  style="width: 16px;height: 14px;" />
                </div>
            </div>
            <div class="itemContent">
                <div class="carItem">
                    <div class="carItemLt">
                        <label>充电桩名称:</label>
                        <span>{{pileDetail.websiteName}}</span>
                    </div>
                    <div class="carItemRt">
                        <label>枪数:</label>
                        <span>{{pileDetail.gunSum}}</span>
                    </div>
                </div>
                <div class="carItem">
                    <div class="carItemLt">
                        <label>所属组织机构:</label>
                        <span>{{pileDetail.orgName}}</span>
                    </div>
                    <div class="carItemRt">
                        <label>所属网点:</label>
                        <span>{{pileDetail.websiteName}}</span>
                    </div>
                </div>
                <div class="carItem">
                    <div class="carItemLt">
                        <label>设备类型:</label>
                        <span>{{pileDetail.deviceType==1?'直流':'交流'}}</span>
                    </div>
                    <div class="carItemRt">
                        <label>桩状态:</label>
                        <span style="color: #00B3FF">{{pileDetail.status==1?'在线':'离线'}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="menuContent">
            <div class="header">
                <span>
                    告警详情
                </span>
            </div>
          <div class="table">
              <el-table
                      :data="tableList"
                      :cell-style="tableStyle"
                      :header-cell-style="tableHeaderStyle"
                      border
                      style="width: 100%">

                  <el-table-column
                          prop="deviceName"
                          label="设备名称"
                          width="180"
                          align="center"
                          fixed
                  >
                  </el-table-column>
                  <el-table-column
                          prop="deviceNo"
                          label="设备编码"
                          width="180"
                          align="center"
                          show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                          prop="severitys"
                          label="告警等级"
                          width="200"
                          align="center"
                          show-overflow-tooltip
                          fixed="right"
                  >
                      <template slot-scope="scope">
                          <div style="color: #fff;">
                              {{scope.row.severitys}}
                          </div>
                      </template>
                  </el-table-column>
                  <el-table-column
                          prop="gunNum"
                          label="枪号"
                          width="100"
                          align="center"
                          show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                          prop="alarmTitle"
                          label="告警名称"
                          width="180"
                          align="center"
                          show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                          prop="occurTime"
                          label="首发告警时间"
                          width="180"
                          align="center"
                          show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                          prop="lastTime"
                          label="告警结束时间"
                          width="180"
                          align="center"
                          show-overflow-tooltip
                  >
                  </el-table-column>
              </el-table>
          </div>
        </div>
    </div>
</template>

<script>
    import {getPileDetails} from '@/api/monitoring/comsupervision.js'
    import {listPoleRtrecord } from "@/api/alarm/alarmmonitorcenter.js";
    export default {
        name: "robot-details",
        data(){
            return{
                backImg: require('@/assets/monitoring/type/fanhui.svg'),
                pileDetail:{},
                activeName:"",
                chargingGun:{},
                tableList:[],
                searchConf:{
                    deviceSite: null, // 网点
                    deviceName: null, // 设备名称
                    deviceNo: null, // 设备编码
                    occurTime: null, // 结束时间
                    severity: null, // 告警级别
                    alarmType: null, // 告警类型
                    startTime: null, // 开始时间
                    pageSize:20,
                    pageNo:1,
                },
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
                    this.chargingGun = newName;
                    this.getPileDetails()
                    this.getList()
                },
                immediate: true
            },
        },
        methods: {
            goBack() {
                this.$emit('changeType')
            },
            //根据告警级别展示不同得颜色
            tableStyle({row, column, rowIndex, columnIndex}){
                if(columnIndex === 10) {      // 表格的第11行做处理
                    if(row.severity == 1) {             // 一级风险
                        row.severitys='一级风险'
                        return 'background:#DB1313;color:#fff !important;'
                    }else if(row.severity == 2) {       // 二级风险
                        row.severitys='二级风险'
                        return 'background:#FF9800;color:#fff !important;'
                    }else if(row.severity == 3) {       // 三级风险
                        row.severitys='三级风险'
                        return 'background:#5CCAE8;color:#fff !important;'
                    }
                }else {
                    return ''
                }

            },
            //获取实时告警列表
            async getList(){
                this.searchConf.deviceNo=this.chargingGun.deviceNo
                // this.searchConf.deviceNo=this.chargingGun.websiteId
                const res = await listPoleRtrecord(this.searchConf);
                if(res.code === 200) {
                    this.tableList = res.data.list;
                }
            },
            //获取桩信息
            async getPileDetails(){
                const res = await getPileDetails({poleNo:this.chargingGun.deviceNo});
                if(res.code === 200) {
                    this.pileDetail = res.data;
                }
            },
            goBack() {
                this.$emit('changeType')
            },

        },
        created(){
            this.chargingGun=this.infos;
            // this.getPileDetails()
            // this.getList()
        }
    }
</script>
<style lang="scss" scoped>
    @import "@/assets/styles/global.scss";
    .robotDetails{
        .el-tabs__item{
            background-color: #fff !important;
            color: #777;
        }
        .el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
            border-bottom-color:#4bd6a2;
        }
        .is-active{
            color: #4bd6a2;
        }
        headerBox {
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
    .table {
        /*padding: 0 15px 15px 15px;*/
            width: 100%;
    }
    .carDetails{
        width: 100%;
        overflow: hidden;
        background-color: #E4F3F5;
        color: #222;
        /*padding: 10px;*/
        margin-bottom: 10px;
        width: 100%;
        /*display: flex;*/
    }
    .header{
        background-color:#fff;
        color: rgb(0, 153, 153);
        margin-bottom: 10px;
        padding: 10px 0;
    }
    .header span{
        display: inline-block;
        border-left:3px solid rgb(0, 153, 153);
        padding-left: 10px;
    }
    .itemContent{
        background-color: #fff;
        /*margin: 10px;*/
        overflow: hidden;
        padding: 10px;
    }
    .carItem{
        width: 25%;
        /*margin-top: 10px;*/
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
        margin-right: 20px;
        width: 50%;
        text-align: right;
        color: #8E8E8E;
    }
</style>