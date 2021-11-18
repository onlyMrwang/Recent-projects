<template>
    <!--历史告警-->
    <div class="chrOrderSea">
        <!-- search box -->
        <div class="card">
            <el-form ref="searchInfo" :model="searchInfo" size="small" label-width="85px">
                <el-row :gutter="5">
                    <el-col :span="6">
                        <el-form-item label="网点">
                            <el-select v-model="searchInfo.deviceSite" clearable  placeholder="请选择充电网点">
                                <el-option
                                        v-for="item in siteList"
                                        :key="item.chargGroupId"
                                        :label="item.chargGroupName"
                                        :value="item.chargGroupId"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="机器人编号">
                            <el-input v-model="searchInfo.deviceNo"  placeholder="请输入机器人编号" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="接收组">
                            <!-- <el-input v-model="searchInfo.initiator"  placeholder="请输入接收组" />
                             -->
                              <treeselect
                                :options="deptList"
                                v-model="searchInfo.initiator"
                                :default-expand-level="1"
                                placeholder="请选择接收组"
                                :normalizer="normalizer"
                                />
                        </el-form-item>
                    </el-col>
                  <el-col :span="6">
                        <el-form-item label="通知方式">
                            <el-select v-model="searchInfo.forwargType" clearable  placeholder="请选择通知方式">
                                <el-option
                                        v-for="item in noticeType"
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
                        <el-form-item label="厂商">
                            <el-select v-model="searchInfo.deviceVender" clearable  placeholder="请选择厂商">
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
                        <el-form-item label="机器人型号">
                            <el-input v-model="searchInfo.deviceVersion" placeholder="请输入机器人型号" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                         <el-form-item label="发生时间">
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
                    <el-col :span="24" style="text-align: right;margin-bottom: 15px;">
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
                    <div class="name">告警通知日志</div>
                </div>
              
                 <div class="options">
                   <!-- <el-button @click="exportMsg" :loading="showLoading"> <i class="iconfont icon-daochu"/> 导出</el-button> -->
                </div>
            </div>
            <div class="table">
                <el-table
                        :header-cell-style="tableHeaderStyle"
                        :data="tableList"
                        border
                        style="width: 100%">
                    <el-table-column
                            fixed
                            prop="deviceSite"
                            label="网点"
                            align="center"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="deviceVender"
                            label="厂商"
                            align="center"
                            fixed
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="deviceVersion"
                            label="型号"
                            align="center"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="deviceNo"
                            label="充电机器人编号"
                            align="center"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="initiator"
                            label="接收组"
                            align="center"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="alarmTitle"
                            label="通知方式"
                            align="center"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                            prop="startTime"
                            label="发送时间"
                            align="center"
                            show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="operational"
                        label="操作内容"
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
                        :current-page="searchInfo.pageNo"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="searchInfo.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getList, exportHistory } from "@/api/alarm/BeforeHistory.js";
import { listChargGroupCode } from "@/api/alarm/alarmmonitorcenter.js";
import { getFacturer } from '@/api/asset/manufacturer'
import { mapGetters } from 'vuex'
import { streamToExcel } from "@/utils/utils";
    export default {
        data() {
            return {
                dataVal:[],
                searchInfo: {
                    type: 3,
                    pageSize:10,
                    pageNo:1,
                    startTime: null,
                    occurTime: null,
                }, 
                showLoading: false,
                happenTimes: [],
                siteList: [],
                noticeType:[
                    // { label: "短信", value: "1" },
                    { label: "APP", value: "app" },
                ],
                tableList: [], //table表格数组
                total: 0,
                vendersSelect:[],//设备厂商
            };
        },
        computed: {
            ...mapGetters(['deptList'])
        },
        created(){
            this.getList();//获取告警列表
            this.getName();//获取充电网点
            this.getChargManu()//获取设备厂商
        },
        methods: {
            normalizer(node){
            //去掉children=[]的children属性
            if(node.children && !node.children.length){
                delete node.children;
            }
            return {
                id: node.id,
                label:node.nameCN,
                children:node.children
            }
            },
            toSearch() {
              this.searchInfo.pageNo = 1
              this.getList()
            },
            async getList(){ 
                if(this.happenTimes?.length > 0) {
                  this.searchInfo.startTime = this.happenTimes[0]
                  this.searchInfo.occurTime = this.happenTimes[1]
                }else {
                  this.searchInfo.startTime = null
                  this.searchInfo.occurTime = null  
                }
                const res = await getList(this.searchInfo);
                if(res.code === 200) {
                 this.tableList = res.data.list;  
                 this.total = res.data.total 
                }
            },
            //获取机器人厂商
            async getChargManu(){
              const data = {
                pageNum: 1,
                pageSize: 1000,
                facturerType: 3
              }
                const res = await getFacturer(data);
                if(res.code == 200){
                    this.vendersSelect = res.data.result;
                }
            },

           // 获取网点
            async getName(){ 
                const res = await listChargGroupCode()
                if(res.code === 200) {
                  this.siteList = res.data;  
                }
            },

            resetSearch() { 
                this.searchInfo = {
                    type: 3,
                    pageSize:10,
                    pageNo:1,
                    startTime: null,
                    occurTime: null,
                }
                this.happenTimes = []
            },

            handleCurrentChange(page) { 
                this.searchInfo.pageNo = page
                this.getList()
            },
            handleSizeChange(pageSize) {
                this.searchInfo.pageNo = 1
                this.searchInfo.pageSize = pageSize
                this.getList()
            },

           async exportMsg() {
            this.showLoading = true
            const rsp = await exportHistory(this.searchInfo);
            if (rsp && rsp.size > 0) {
                streamToExcel(rsp, "机器人告警通知日志");
                this.$message({
                type: "success",
                message: "导出成功",
                });
            }else {
                this.$message({
                type: "error",
                message: "导出失败",
                });
            }
            this.showLoading = false
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
            min-height: calc(100vh - 270px);
            margin: 10px 0;
            overflow: auto;
            .top {
                display: flex;
                align-items: center;
                justify-content: space-between;
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
