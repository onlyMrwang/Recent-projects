<template>
    <div class="chrOrderSea">
        <!-- search box -->
        <div class="card">
            <el-form ref="searchConf" :model="searchConf" size="small" label-width="80px">
                <el-row :gutter="5">
                    <el-col :span="6">
                        <el-form-item label="充电网点">
                            <el-select
                                v-model="searchConf.chargGroupName"
                                clearable
                                @change="changeSite"
                                placeholder="请选择充电网点"
                            >
                               <el-option
                                v-for="item in siteList"
                                :key="item.chargGroupId"
                                :label="item.chargGroupName"
                                :value="item.chargGroupName"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="设备名称">
                             <el-select
                                v-model="searchConf.chargName"
                                clearable
                                :placeholder="searchConf.chargGroupName ? '请选择设备名称' : '请先选择充电网点'"
                            >
                              <el-option
                                v-for="item in ChargingInfoSelect"
                                :key="item.chargId"
                                :label="item.chargName"
                                :value="item.chargName"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8">
                        <el-form-item label="设备编号">
                            <el-select
                                v-model="searchConf.deviceNo"
                                clearable
                                placeholder="请选择设备编码"
                            >
                              <el-option
                                v-for="item in ChargingInfoSelect"
                                :key="item.assetsNum"
                                :label="item.assetsNum"
                                :value="item.assetsNum"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->  
                    <el-col :span="12">
                        <el-form-item label="上报时间">
                        <el-date-picker
                            popper-class="dateRange"
                            v-model="happenTimes"
                            type="datetimerange"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            value-format="yyyy:MM:dd HH:mm:ss"
                        >
                        </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="5">
                    <el-col :span="24" style="text-align: right;padding-bottom: 15px;">
                         <el-button type="primary" @click="toSearch">查询</el-button>
                         <el-button @click="resetSearch">重置</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!-- table box-->
        <div class="tableBox">
            <div class="top">
                <div class="title">
                    <div class="name">充电过程日志</div>
                </div>
                <div class="options">
                    <!-- <el-button @click="exportOrder" :loading="showLoading"><i class="iconfont icon-daochu"/> 导出</el-button> -->
                </div>
             
            </div>
            <div class="table">
                <el-table
                        :data="tableList"
                        :header-cell-style="tableHeaderStyle"
                        border
                        max-height="540"
                        style="width: 100%">
                    <el-table-column
                            fixed="left"
                            prop="chargGroupName"
                            label="充电网点"
                            width="150"
                            align="center"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="chargName"
                            label="设备名称"
                            width="150"
                            align="center"
                            fixed="left"
                            show-overflow-tooltip
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
                            prop="gunNo"
                            label="枪号"
                            width="100"
                            align="center"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="totalEnergy"
                            label="已输入电量(kWh)"
                            width="130"
                            align="center"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="outputVoltage"
                            label="输出电压(V)"
                            width="120"
                            align="center"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="ah"
                            label="安时(Ah)"
                            width="120"
                            align="center"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="outputCurrent"
                        label="输出电流(A)"
                        width="120"
                        align="center"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="monomerHighVdc"
                            label="单体最高电压(V)"
                            width="160"
                            align="center"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="monomerLowVdc"
                            label="单体最低电压(V)"
                            width="160"
                            align="center"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="batteryHighTemp"
                            label="电池最高温度(°C)"
                            width="160"
                            align="center"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="batteryLowTemp"
                            label="电池最低温度(°C)"
                            width="160"
                            align="center"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="batteryNewVdc"
                            label="电池当前电压(V)"
                            width="160"
                            align="center"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="batteryNewEle"
                            label="当前电流(A)"
                            width="160"
                            align="center"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="newSoc"
                            label="SOC(%)"
                            width="120"
                            align="center"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                     <el-table-column
                            prop="time"
                            label="上报时间"
                            width="170"
                            align="center"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                </el-table>
                <div class="pagination" v-if="tableList.length > 0">
                      <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="searchConf.pageNo"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="searchConf.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import{ mapGetters  } from 'vuex'
    import { listChargGroupCode } from "@/api/alarm/alarmmonitorcenter.js";
    import { getChargeBySite } from "@/api/alarm/faultalarmBase.js";
    import { getProcessData, exportProcessData } from '@/api/alarm/celve'
    import moment from 'moment'
    import { streamToExcel } from '@/utils/utils'
    export default {
        data() {
            return {
                searchConf: {
                    chargGroupName: null,
                    chargName: null,
                    startTime: null,
                    endTime: null,
                    pageSize: 10,
                    pageNo: 1,
                },
                showLoading: false,
                ChargingInfoSelect: [],
                happenTimes: [],
                total: 0,
                siteList: [],
                tableList: []//table表格数组
            };
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        created(){
            this.searchConf.chargName = this.$route.query.deviceName || null
            if(this.$route.query.time) {
                this.happenTimes = [new Date(moment(this.$route.query.time).subtract(1, 'm')), new Date(moment(this.$route.query.time).add(1, 'm'))]
            }
            this.fetchList();
            this.getName();
            // this.fetchChargingInfos()
        },
        methods: {
            async fetchList(){ 
               if(this.happenTimes?.length > 0) {
                   if(this.$route.query.time) {
                    this.searchConf.startTime = moment(this.happenTimes[0]).format('YYYY-MM-DD HH:mm:ss')
                    this.searchConf.endTime = moment(this.happenTimes[1]).format('YYYY-MM-DD HH:mm:ss') 
                    }else {
                    this.searchConf.startTime = this.happenTimes[0]
                    this.searchConf.endTime = this.happenTimes[1]
                    }
        
                }else {
                    this.searchConf.startTime = null
                    this.searchConf.endTime =  null
                }
                const res = await getProcessData(this.searchConf)
                if(res.code === 200) {
                  this.tableList = res.data.list; 
                  this.total = res.data.total 
                }
            },
            async getName(){ 
                const res = await listChargGroupCode();
                if(res.code === 200) {
                   this.siteList = res.data;  
                }
            },
            changeSite(val) {
                const arr = this.siteList.filter(item => item.chargGroupName === val)
                if(arr.length > 0) {
                   this.ChargingInfoSelect = []
                   this.fetchChargingInfos({id: arr[0].chargGroupId})   
                }
              
            },
            
            //充电设备查询
            async fetchChargingInfos(data) {
            const res = await getChargeBySite(data);
             if (res.code == 200) {
                this.ChargingInfoSelect = res.data;
             }
            },

            async exportOrder() {
                this.showLoading = true
                const rsp = await exportProcessData(this.searchConf)
                if(rsp && rsp.size > 0) {
                    streamToExcel(rsp, '充电过程数据')
                    this.$message({
                        type: 'success',
                        message: '导出成功'
                    })
                }else {
                     this.$message({
                        type: 'error',
                        message: '导出失败'
                    })
                }
                this.showLoading = false
            },

            toSearch() {
                this.searchConf.pageNo = 1
                this.fetchList()
            },
            resetSearch() { 
                this.searchConf = {
                    chargGroupName: null,
                    assetsNum: null,
                    startTime: null,
                    endTime: null,
                    pageSize:10,
                    pageNo:1,
                }
                this.happenTimes = []
            },
            handleCurrentChange(page) { 
               this.searchConf.pageNo = page
               this.fetchList()
            },
            handleSizeChange(pageSize) {
                this.searchConf.pageNo = 1
                this.searchConf.pageSize = pageSize
                this.fetchList()
            },
         
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/styles/global.scss";
    .chrOrderSea {
        .tableBox {
            background-color: #fff;
            border-radius: 4px;
            min-height: calc(100vh - 230px);
            margin: 10px 0;
            overflow: auto;
            .top {
                display: flex;
                align-items: center;
                justify-content: space-between;
                // margin-right: 20px;
                padding:15px 20px;
                .title {
                    display: flex;
                    align-items: center;
                    .name {
                        font-size: 16px;
                        color: $mainTextColor;
                    }
                }
               
            }
            .table {
                padding: 0 15px 15px 15px;
                .pagination {
                    margin-top: 10px;
                    display: flex;
                    justify-content: flex-end;
                }
            }
            .box {
                display: inline-block;
                width: 25px;
                height: 10px;
                background-color: #999;
                margin-right: 2px;
            }
            .btnBox a{
                display: inline-block;
                width: 50%;
                text-align: center;
            }
            .flexbox {
                height: 110px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
        }
    }
</style>
