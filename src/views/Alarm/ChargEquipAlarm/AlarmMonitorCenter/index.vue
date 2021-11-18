<template>
  <div class="chrOrderSea">
    <div class="card">
      <el-form ref="searchConf" :model="searchConf" size="small" label-width="80px">
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item label="充电网点">
                <el-select v-model="searchConf.deviceSite" clearable @change="changeSite"  placeholder="请选择充电网点">
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
              <!-- <el-input v-model="searchConf.deviceName" placeholder="请输入设备名称" /> -->
                <el-select
                  v-model="searchConf.deviceName"
                  clearable
                  @change="changeCharge"
                  placeholder="请选择设备名称"
                >
                <el-option
                  v-for="item in chargList"
                  :key="item.chargId"
                  :label="item.chargName"
                  :value="item.chargName"
                  >
                  </el-option>
              </el-select>       
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备编号">
              <el-input v-model="searchConf.deviceNo" placeholder="请输入设备编号" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="告警类型">
              <el-select v-model="searchConf.alarmType" clearable   placeholder="请选择告警类型">
                <el-option
                        v-for="item in dictInfo.alarmType"
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
           <el-col :span="12">
            <el-form-item label="告警时间">
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
          <el-col :span="6">
            <el-form-item label="告警级别">
              <el-select v-model="searchConf.severity" clearable @change="severityClick" placeholder="请选择告警级别">
                <el-option
                        v-for="item in levelList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="告警名称">
                <el-select
                  v-model="searchConf.alarmTitle"
                  clearable
                  filterable
                  :placeholder="searchConf.severity ? '请选择告警名称' : '请先选择告警级别'"
                >
                  <el-option
                    v-for="item in alarmTitleSelect"
                    :key="item.alarmCode"
                    :label="item.alarmTitle"
                    :value="item.alarmTitle"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
          </el-col>
         
        </el-row>
        <el-row :gutter="5">
          <el-col :span="24" style="text-align: right;margin-bottom: 15px;">
          <el-button type="primary" @click="toSearch" >查询</el-button>
          <el-button @click="resetSearch" >重置</el-button>
          </el-col>
      </el-row>
      </el-form>
    </div>
    <!-- table box-->
    <div class="tableBox">
      <div class="top">
        <div class="title">
          <div class="name">告警监控中心</div>
        </div>
        <div class="options">
          <el-button  @click="exportOrder" :loading="showLoading"><i class="iconfont icon-daochu"/> 导出</el-button>
        </div>
      </div>
      <div class="table">
        <el-table
                :data="tableList"
                :header-cell-style="tableHeaderStyle"
                border
                style="width: 100%">
          <el-table-column
                  fixed
                  prop="deviceSite"
                  label="充电网点"
                  width="180"
                  align="center"
                  show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
                  prop="deviceName"
                  label="设备名称"
                  width="150"
                  align="center"
                  fixed
                  show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
                  prop="deviceNo"
                  label="设备编号"
                  width="180"
                  align="center"
                  show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
              prop="severity"
              label="告警等级"
              width="160"
              align="center"
              show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div class="severity" v-if="scope.row.severity === 1">
                <div class="severityItem item1"></div>
                <div class="severityItem">
                  <div class="ji">{{scope.row.severity === 1 ? '1级' : scope.row.severity === 2 ? '2级' : scope.row.severity === 3 ? '3级' : null}}</div>
                </div>
                <div class="severityItem"></div>
              </div>
              <div class="severity" v-if="scope.row.severity === 2">
                <div class="severityItem"></div>
                <div class="severityItem item2">
                  <div class="ji">{{scope.row.severity === 1 ? '1级' : scope.row.severity === 2 ? '2级' : scope.row.severity === 3 ? '3级' : null}}</div>
                </div>
                <div class="severityItem"></div>
              </div>
              <div class="severity" v-if="scope.row.severity === 3">
                <div class="severityItem"></div>
                <div class="severityItem">
                  <div class="ji">{{scope.row.severity === 1 ? '1级' : scope.row.severity === 2 ? '2级' : scope.row.severity === 3 ? '3级' : null}}</div>
                </div>
                <div class="severityItem item3"></div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
                  prop="alarmTitle"
                  label="告警名称"
                  width="180"
                  align="center"
          >
          <template slot-scope="scope">
            <el-link type="primary" :underline="false">
             <div class="alarmTitle" @click="toAlarmDetail(scope.row)">{{scope.row.alarmTitle}}</div>
            </el-link>
          </template>
          </el-table-column>
            <el-table-column
                  prop="alarmType"
                  label="告警类型"
                  width="120"
                  align="center"
                  show-overflow-tooltip
          >
          <template slot-scope="scope">
            {{scope.row.alarmType ? dictInfo.alarmTypeObj[scope.row.alarmType] : null}}
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
                  prop="count"
                  label="告警计数"
                  width="100"
                  align="center"
                  show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
                  prop="startTime"
                  label="首次告警发生时间"
                  width="180"
                  align="center"
                  show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
                  prop="lastTime"
                  label="最后一次告警时间"
                  width="180"
                  align="center"
                  show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
                  prop="treatMeasures"
                  label="处理方案"
                  width="180"
                  align="center"
                  show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
                  prop="dispStatus"
                  label="派单结果"
                  width="120"
                  align="center"
                  show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{scope.row.dispStatus === 0 ? '未派单' : '已派单'}}
            </template>
          </el-table-column>
          <el-table-column
                  prop="dispTime"
                  label="派单时间"
                  width="170"
                  align="center"
                  show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
                  label="操作"
                  width="270"
                  align="center"
                  fixed="right"
          >
            <template slot-scope="scope">
               <el-link
                      :underline="false"
                      @click="handleDelete(scope.row)"
                      type="primary"
                      style="margin-right: 10px;">清除</el-link>
              <el-link
                       :underline="false"
                      type="primary"
                      @click="toSendorder(scope.row)"
                      :disabled="scope.row.dispStatus === 1"
                      style="margin-right: 10px;">派单</el-link>
                       <el-link
                         :underline="false"
                        type="primary"
                        style="margin-right: 10px;" @click="toProcess(scope.row)">过程数据</el-link>
                <el-link
                         :underline="false"
                        type="primary"
                        style="margin-right: 10px;" @click="toMessage(scope.row)">查询报文</el-link>
            <!-- <div style="display: flex;">
            <div class="btnBox">
              <el-link
                      :underline="false"
                      @click="handleDelete(scope.row)"
                      type="primary"
                      style="margin-right: 10px;">清除</el-link>
              <el-link
                       :underline="false"
                      type="primary"
                      @click="toSendorder(scope.row)"
                      :disabled="scope.row.dispStatus === 1"
                      style="margin-right: 10px;">派单</el-link>
            </div>
              <div class="btnBox">
                <el-link
                         :underline="false"
                        type="primary"
                        style="margin-right: 10px;" @click="toProcess(scope.row)">过程数据</el-link>
                <el-link
                         :underline="false"
                        type="primary"
                        style="margin-right: 10px;" @click="toMessage(scope.row)">查询报文</el-link>
              </div>
              </div> -->
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

    <div v-if="dialogShow">
    <el-dialog
            v-dialogDrag
            :visible.sync="dialogShow"
            @closed="closeView"
            width="850px"
            title="告警派单"
    >
      <SendOrders
              :siteList="siteList"
              :rowInfo="rowInfo"
              @closeView="closeView" @freshList="getList">
      </SendOrders>
    </el-dialog>
    </div>

    <!-- 告警详情 -->
    <div v-if="showAlarmDetail">
         <el-dialog
            v-dialogDrag
            :visible.sync="showAlarmDetail"
            @closed="closeDialog"
            width="60%"
            title="告警详情"
    >
        <alarm-detail :alarmTitle="alarmTitle" @closeDialog="closeDialog"/>
    </el-dialog>
    </div>
  </div>
</template>

<script>
    import{ mapGetters } from 'vuex'
    import { listChargGroupCode, listPoleRtrecord, getExprot, clearClearAway } from "@/api/alarm/alarmmonitorcenter.js";
    import { getAlarmTitle } from "@/api/alarm/celve.js";
    import { getChargeBySite } from '@/api/alarm/faultalarmBase'
    import SendOrders from './SendOrders'
    import { streamToExcel } from '@/utils/utils'
    import AlarmDetail from './alarmDetail.vue'
    import moment from 'moment'
    export default {
        components:{
            SendOrders, AlarmDetail
        },
        data() {
            return {
                dialogShow:false,//控制弹出框是否弹出
                searchConf: {
                    deviceSite: null, // 网点
                    deviceName: null, // 设备名称
                    deviceNo: null, // 设备编码
                    lastTime: null, // 结束时间
                    severity: null, // 告警级别
                    alarmType: null, // 告警类型
                    startTime: null, // 开始时间
                    alarmTitle: null,
                    gunNum:null,
                    pageSize: 10,
                    pageNo: 1,
                },
                total: 0,
                showLoading: false,
                rowInfo: null,
                happenTimes: [], // 发生时间
                siteList: [],
                levelList: [
                    { label: "1级", value: "1" },
                    { label: "2级", value: "2" },
                    { label: "3级", value: "3" },
                ],
                alarmTitleSelect: [],
                tableList: [],//table表格数组
                showAlarmDetail: false,
                alarmTitle: null,
                chargList: [], // 设备列表
            };
        },
        computed: {
            ...mapGetters(['userInfo', 'dictInfo'])
        },
        created(){ 
            this.getName();//获取充电网点
            this.searchConf.severity = this.$route.query.type || null
            this.searchConf.deviceName = this.$route.query.poleName || null
            this.searchConf.deviceSite = this.$route.query.websiteName || null
            this.searchConf.deviceNo = this.$route.query.poleNo || null
            this.searchConf.gunNum = this.$route.query.gunNum || null
            if(this.$route.query.startTime && this.$route.query.endTime) {
              this.happenTimes = [new Date(this.$route.query.startTime), new Date(this.$route.query.endTime)]
            }
            this.getList();
        },
        methods: {
          //告警等级点击事件
          severityClick(val) {
            this.alarmTitleSelect = []
            this.searchConf.alarmTitle = null
            if (val) {
              this.getAlarmTitle(val);
            }
          },
          // 切换网点
          changeSite(val) {
            this.chargeList = []
            this.searchConf.deviceName = null
            this.searchConf.no = null
            if(val) {
              const arr = this.siteList.filter(item => item.chargGroupName === val)
              if(arr.length > 0) {
                this.fetchChargeList(arr[0].chargGroupId)
              }
            }
          },
          // 获取充电设备
          async fetchChargeList(val) {
            const rsp =  await getChargeBySite({id: val})
            if(rsp.code === 200) {
              this.chargList = rsp.data
            }
          },

          // 切换充电设备
          changeCharge(val) {
            this.searchConf.deviceNo = null
            const arr = this.chargList.filter(item => item.chargName === val)
            if(arr.length  > 0) {
              this.searchConf.deviceNo = arr[0].assetsNum
            }
          },

          //获取告警名称
          async getAlarmTitle(val) {
            const res = await getAlarmTitle({ alarmSeverity: val, type: 1 });
            if (res.code == 200) {
              this.alarmTitleSelect = res.data;
            }
          },

          toSearch() {
              this.searchConf.pageNo = 1
              this.getList()
          },
          toSendorder(row) {
              this.rowInfo = JSON.parse(JSON.stringify(row))
              this.dialogShow =  true;
            },
            //关闭弹出框
            closeView(){
                this.dialogShow =  false;
                this.getList();
            },
            //告警清除
             handleDelete(val){
               this.$confirm('是否确定清除该告警事件', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning',
                  center: true
                }).then(async () => {
                   const res = await clearClearAway({
                    recordId:val.recordId
                });
                if(res.code==200){
                    this.msgSuccess('清除成功');
                    this.getList();
                }
                }).catch(() => {})

            },
            // 过程数据
            toProcess(row) {
              let routeUrl = this.$router.resolve({
                path: "/airweb/chargeLogs/processLog",
                query: {time: row.lastTime, deviceName: row.deviceName}
              });
              window.open(routeUrl.href, '_blank');
            },

            // 历史报文
            toMessage(row) {
                const data = {
                  msgCode: row.msgCode,
                  startTime: row.startTime,
                  lastTime: row.lastTime,
                  deviceName: row.deviceName,
                }
                let routeUrl = this.$router.resolve({
                path: "/airweb/chargeLogs/originMsgLog",
                query: data
              });
              window.open(routeUrl.href, '_blank');
            },

            toAlarmDetail(row) {
              this.alarmTitle = row.alarmTitle
              this.showAlarmDetail = true
            },

            closeDialog() {
              this.alarmTitle = null
              this.showAlarmDetail = false
            },

            //excel导出功能
            async exportOrder(){
              this.showLoading = true
              const rsp = await getExprot(this.searchConf)
              if(rsp && rsp.size > 0) {
                streamToExcel(rsp, '告警事件信息')
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

            //分页点击得方法
            handleCurrentChange(page) {
                this.searchConf.pageNo = page
                this.getList()
            },
            handleSizeChange(pageSize) {
              this.searchConf.pageSize = pageSize
              this.searchConf.pageNo = 1
              this.getList()
            },
            //获取实时告警列表
            async getList(){
                 if(this.happenTimes?.length > 0) {
                  if(this.$route.query.startTime && this.$route.query.endTime) {
                    this.searchConf.startTime = moment(this.happenTimes[0]).format('YYYY-MM-DD HH:mm:ss')
                    this.searchConf.lastTime = moment(this.happenTimes[1]).format('YYYY-MM-DD HH:mm:ss') 
                  }else {
                    this.searchConf.startTime = this.happenTimes[0]
                    this.searchConf.lastTime = this.happenTimes[1]
                  }
                  
                }else {
                  this.searchConf.startTime = null
                  this.searchConf.lastTime =  null
                }
                const res = await listPoleRtrecord(this.searchConf);
                if(res.code === 200) {
                  this.tableList = res.data.list;
                  this.total = res.data.total
                  if(this.$route.query.siteName) {
                    this.changeSite(this.$route.query.siteName)
                  }
                }
            },

            //获取网点下拉数据
            async getName(){
                const res = await listChargGroupCode();
                if(res.code === 200) {
                  this.siteList = res.data;
                   if(this.$route.query.websiteName) {
                    const arr = this.siteList.filter(item => item.chargGroupName === this.$route.query.websiteName)
                    if(arr.length > 0) {
                      this.fetchChargeList(arr[0].chargGroupId)
                    }
                  }
                }
            },

            //清空检索框数据得方法
            resetSearch() {
                this.searchConf = {
                    deviceSite: null, // 网点
                    deviceName: null, // 设备名称
                    deviceNo: null, // 设备编码
                    lastTime: null, // 结束时间
                    severity: null, // 告警级别
                    alarmType: null, // 告警类型
                    startTime: null, // 开始时间
                    alarmTitle: null,
                    gunNum:null,
                    pageSize:10,
                    pageNo:1,
                },
                this.happenTimes = []
            },
        }
    }
</script>
<style lang="scss">
.alarmTitle {
  width: 160px;
  margin: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
<style lang="scss" scoped>
  @import "@/assets/styles/global.scss";
  .chrOrderSea {
    .tableBox {
      background-color: #fff;
      border-radius: 4px;
      min-height: calc(100vh - 312px);
      margin: 10px 0;
      overflow: auto;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-right: 20px;
        padding:15px 0 0 20px;
        .title {
          display: flex;
          align-items: center;

          .sign {
            width: 7px;
            height: 20px;
            background: #18bbda;
            margin-right: 8px;
          }
          .name {
            font-size: 16px;
            color: #666666;
          }
        }
        .options {
          margin-bottom: 8px;
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
