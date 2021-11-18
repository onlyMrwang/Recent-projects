<template>
    <div class="chrOrderSea">
        <div class="card">
            <el-form ref="searchConf" :model="searchConf" size="small" label-width="85px">
                <el-row :gutter="5">
                    <el-col :span="6">
                        <el-form-item label="网点">
                            <el-select v-model="searchConf.siteName" clearable  placeholder="请选择网点">
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
                        <el-form-item label="设备厂商">
                             <el-select v-model="searchConf.deviceCommpany" clearable placeholder="请选择设备厂商">
                                <el-option
                                    v-for="item in vendersSelect"
                                    :key="item.facturerId"
                                    :label="item.facturerName"
                                    :value="item.facturerId"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="设备型号">
                            <el-input v-model="searchConf.deviceModel" placeholder="请输入设备型号" />
                        </el-form-item>
                    </el-col>
                      <el-col :span="6">
                        <el-form-item label="停机原因">
                              <el-select v-model="searchConf.stopType" clearable  placeholder="请选择停机原因">
                                <el-option
                                        v-for="item in stopTypeList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                 <el-row :gutter="5">
                    <el-col :span="6">
                        <el-form-item label="设备编码">
                            <el-input v-model="searchConf.deviceNo" placeholder="请输入设备编码" />
                        </el-form-item>
                    </el-col>
                  <el-col :span="6">
                        <el-form-item label="卡号">
                            <el-input v-model="searchConf.cardCode" placeholder="请输入卡号" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号">
                            <el-input v-model="searchConf.carNum" placeholder="请输入车牌号" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="姓名">
                            <el-input v-model="searchConf.staffName" placeholder="请输入姓名" />
                        </el-form-item>
                    </el-col>
                 
                </el-row>
                <el-row :gutter="5">
                    <el-col :span="12">
                        <el-form-item label="停机时间">
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
                    <el-col :span="12" style="text-align: right;">
                      <el-button type="primary" @click="toSearch">查询</el-button>
                      <el-button @click="resetSearch" >重置</el-button>      
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!-- table box-->
        <div class="tableBox">
            <div class="top">
                <div class="title">
                    <div class="name">停机日志</div>
                </div>
            </div>
            <div class="table">
                <el-table
                        :data="tableList"
                        :header-cell-style="tableHeaderStyle"
                        border
                        style="width: 100%">
                    <el-table-column
                        fixed="left"
                        prop="siteName"
                        label="网点"
                        width="200"
                        align="center"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="cardCode"
                        label="卡号"
                        align="center"
                        width="200"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="carNum"
                        label="车牌号"
                        align="center"
                        width="130"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                      <el-table-column
                        prop="staffName"
                        label="姓名"
                        align="center"
                        width="130"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="gunNo"
                        label="枪号"
                        width="120"
                        align="center"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="deviceNo"
                        label="设备编码"
                        align="center"
                         width="200"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="deviceName"
                        label="设备名称"
                        align="center"
                        width="200"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="insertTime"
                        label="停机时间"
                        align="center"
                        width="170"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="stopReason"
                            label="停机原因"
                            align="center"
                            width="200"
                            show-overflow-tooltip
                    >
                    <template slot-scope="scope">
                        {{scope.row.stopType ? stopTypeObj[scope.row.stopType] : null}}
                    </template>
                    </el-table-column>
                    <el-table-column
                            width="100"
                            prop="x"
                            label="操作"
                            align="center"
                            fixed="right"
                    >
                    <template slot-scope="scope">
                        <el-link type="primary" :disabled="scope.row.stopType != 1 && scope.row.stopType != 2" :underline="false" @click="seeDetail(scope.row)">详情</el-link>
                    </template>
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


     <div v-if="showDetail">
         <el-dialog v-dialogDrag title="停机详情信息" width="50%" :visible="show" :before-close="closeDetail">
               <el-table
                    :data="[detailInfo]"
                    :header-cell-style="tableHeaderStyle"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="deviceNo"
                        label="设备编码"
                        align="center"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                     <el-table-column
                        prop="alarmTitle"
                        label="告警名称"
                        align="center"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                     <el-table-column
                        prop="severity"
                        label="告警级别"
                        align="center"
                        show-overflow-tooltip
                    >
                     <template slot-scope="scope">
                         {{typeObj[scope.row.severity]}}
                     </template>
                    </el-table-column>
               </el-table>   
               <div style="text-align: center;margin: 30px 0 15px 0">
                   <el-button @click="closeDetail">取消</el-button>
                </div>  
         </el-dialog>
     </div>   
    </div>
</template>

<script>
    import { getChargManu } from "@/api/alarm/faultalarmBase.js";
    import { listChargGroupCode } from "@/api/alarm/alarmmonitorcenter.js";
    import { getStoplogs, getStoplogsDetail } from '@/api/alarm/celve'
    export default {
        data() {
            return {
                searchConf: {
                    siteName: null,
                    stopType: null,
                    deviceModel: null,
                    deviceCommpany: null,
                    deviceNo: null,
                    insertTimeStart: null,
                    insertTimeEnd: null,
                    cardCode: null,
                    carNum: null,
                    staffName: null,
                    pageNo: 1,
                    pageSize: 10
                },
                happenTimes: [],
                vendersSelect: [],
                total: 0,
                siteList: [],
                tableList: [],
                showDetail: false,
                detailList: [],
                detailInfo: {
                    deviceNo: null,
                    alarmTitle: null,
                    severity: null
                },
                show: true,
                typeObj: {
                    1: '1级',
                    2: '2级',
                    3: '3级',
                },
                stopTypeList: [
                    {label: '设备告警', value: 1},
                    {label: '安全预警', value: 2},
                ],
                stopTypeObj: {
                    1: '设备告警',
                    2: '安全预警',
                },
                chargeModelList: [], // 设备型号列表
            };
        },
        created(){
            this.fetchList();
            this.fetchSiteList();
            this.fetchChargManu()
        },
        methods: {
               //获取设备厂商
            async fetchChargManu(){
                const res = await getChargManu({type: 1});
                if(res.code == 200){
                    this.vendersSelect = res.data;
                }
            },
            toSearch() {
                this.searchConf.pageNo = 1
                this.fetchList()
            },
            async fetchList(){ 
                 if(this.happenTimes?.length > 0) {
                    this.searchConf.insertTimeStart = this.happenTimes[0]
                    this.searchConf.insertTimeEnd =  this.happenTimes[1] 
                }else {
                    this.searchConf.insertTimeStart = null
                    this.searchConf.insertTimeEnd =  null
                }
                const res = await getStoplogs(this.searchConf);
                if(res.code === 200) {
                    this.tableList = res.data.list; 
                    this.total = res.data.total
                }
            },

            // 获取网点
            async fetchSiteList(){ 
                const res = await listChargGroupCode()
                if(res.code === 200) {
                  this.siteList = res.data;  
                }
            },

            seeDetail(row) {
                this.detailInfo.deviceNo = row.deviceNo
                this.fetchDetail(row.stopObjId)
            },

            async fetchDetail(id) {
                const rsp = await getStoplogsDetail(id)
                if(rsp.code === 200) {
                    if(rsp.data) {
                      this.detailInfo.severity = rsp.data.severity  
                      this.detailInfo.alarmTitle = rsp.data.alarmTitle  
                    }
                    this.showDetail = true
                }
            },

            closeDetail() {
                this.showDetail = false
                this.detailInfo = {
                    deviceNo: null,
                    alarmTitle: null,
                    severity: null
                }
            },

            resetSearch() { 
                this.searchConf = {
                    siteName: null,
                    stopType: null,
                    deviceModel: null,
                    deviceCommpany: null,
                    deviceNo: null,
                    insertTimeStart: null,
                    insertTimeEnd: null,
                    cardCode: null,
                    carNum: null,
                    staffName: null,
                    pageNo: 1,
                    pageSize: 10
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
<style lang="scss">
.el-date-editor .el-range-separator {
    color: #999;
}
</style>
<style lang="scss" scoped>
    @import "@/assets/styles/global.scss";
    .chrOrderSea {
        .tableBox {
            background-color: #fff;
            border-radius: 4px;
            min-height: calc(100vh - 260px);
            margin: 10px 0;
            overflow: auto;
            .top {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-right: 20px;
                padding:15px 20px;
                .title {
                    display: flex;
                    align-items: center;
                    .name {
                        font-size: 16px;
                        color: $mainTextColor;
                    }
                }
                .options {
                    margin-top: -10px;
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
