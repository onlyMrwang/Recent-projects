<template>
  <div class="chrOrderSea">
    <!-- search box -->
    <div class="seaBox">
       <el-form size="small" label-width="100px">
           <el-row :gutter="5">
            <el-col :span="6">
                 <el-form-item label="充电机构">
                    <treeselect
                      :options="deptList"
                      v-model="orgId"
                      :default-expand-level="1"
                      placeholder="请选择充电机构"
                      :normalizer="normalizer"
                      @open="openOrgList"
                    />
                 </el-form-item>
            </el-col>
             <el-col :span="6">
                 <el-form-item label="充电网点">
                    <el-select v-model="searchInfo.stationNo" :clearable="true" placeholder="请选择充电网点">
                    <el-option
                      v-for="item in siteList"
                      :key="item.chargGroupId"
                      :label="item.chargGroupName"
                      :value="item.recSiteNum"
                    >
                    </el-option>
                  </el-select>
                 </el-form-item>
            </el-col>
             <el-col :span="6">
                 <el-form-item label="充电设备编号">
                    <el-input v-model="searchInfo.deviceNo" placeholder="请输入充电设备编号" />
                 </el-form-item>
            </el-col>
             <el-col :span="6">
                 <el-form-item label="订单状态">
                   <el-select v-model="searchInfo.dealStatus" :clearable="true" placeholder="请选择订单状态">
                    <el-option
                      v-for="item in statusList"
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
                 <el-form-item label="错误类型">
                     <el-select ref="stageSelect" v-model="searchInfo.errorType" :clearable="true" placeholder="请选择错误类型">
                      <el-option
                        v-for="item in dictInfo.errorMessage"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                 </el-form-item>
            </el-col>
             <el-col :span="6">
                 <el-form-item label="卡号">
                    <el-input v-model="searchInfo.cardNo" placeholder="请输入卡号" />
                 </el-form-item>
            </el-col>
              <el-col :span="6">
                 <el-form-item label="姓名">
                   <el-input v-model="searchInfo.workerName" placeholder="请输入姓名" />
                 </el-form-item>
            </el-col>
             <el-col :span="6">
                <el-form-item label="车牌号">
                  <el-input v-model="searchInfo.carNo" placeholder="请输入车牌号" />
                 </el-form-item>
            </el-col>
           </el-row>
           <el-row :gutter="5">
             <el-col :span="12">
                <el-form-item label="充电开始时间">
                   <el-date-picker
                    popper-class="dateRange"
                    v-model="startRechargeTime"
                    type="datetimerange"
                    size="small"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间">
                  </el-date-picker>
                 </el-form-item>
            </el-col>
             <el-col :span="12">
                <el-form-item label="异常上报时间">
                    <el-date-picker
                    popper-class="dateRange"
                    v-model="errorTime"
                    size="small"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间">
                  </el-date-picker>
                 </el-form-item>
            </el-col>
           </el-row>
          <el-row>
            <el-col :span="6">
               <el-form-item label="交易流水号">
                   <el-input v-model="searchInfo.orderNo" placeholder="请输入交易流水号" />
                </el-form-item>
            </el-col>
            <el-col style="text-align: right" :span="18">
                <el-button type="primary" @click="toSearch">查询</el-button>
                <el-button plain @click="resetSearch">重置</el-button>
             </el-col>
          </el-row>
       </el-form>
    </div>
   
    <!-- table box-->
    <div class="tableBox">
     <div class="top">
        <div class="title">
          <!-- <div class="sign"></div> -->
          <div class="name">异常订单处理列表</div>
        </div>
        <div class="options">
          <el-button @click="toDownload" :loading="showLoading"> <i class="iconfont icon-daochu"></i> 导出</el-button>
        </div>
      </div>
      <div class="table">
          <el-table
           :header-cell-style="tableHeaderStyle"
            :data="orderList"
            border
            max-height="600"
            style="width: 100%">
            <el-table-column
            fixed
            prop="orderNo"
            label="交易流水号"
            width="160"
            align="center"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" @click="seeUnDetail(scope.row)">{{scope.row.orderNo}}</el-link>
            </template>
            </el-table-column>
            <el-table-column
            prop="errorType"
            label="异常信息"
            width="180"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="groupName"
            label="充电机构"
            width="180"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="cardCode"
            label="卡号"
            width="180"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="staffName"
            label="姓名"
            width="100"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="carNo"
            label="车牌号"
            width="100"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="siteName"
            label="充电网点"
            width="160"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="deviceName"
            label="充电设备名称"
            width="160"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="deviceNo"
            label="充电设备编号"
            width="160"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="gunNum"
            label="枪号"
            width="60"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="useEleValue"
            label="本次累计充电能(kWh)"
            width="180"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="errorTimes"
            label="错误记录数"
            width="100"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
             <el-table-column
            prop="consumeType"
            label="消费方式"
            width="80"
            align="center"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              {{consumeObj[scope.row.consumeType]}}
            </template>
            </el-table-column>
             <el-table-column
            prop="startTime"
            label="充电开始时间"
            width="160"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
               <el-table-column
            prop="endTime"
            label="充电结束时间"
            width="160"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="dealStatus"
            label="订单状态"
            width="105"
            align="center"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
                {{dealStatusObj[scope.row.dealStatus]}}
            </template>
            </el-table-column>
            <el-table-column
            prop="x"
            label="操作"
            width="105"
            align="center"
            fixed="right"
            >
             <template slot-scope="scope">
               <el-link type="primary" :underline="false" :disabled="scope.row.dealStatus !== 1" @click="toRepair(scope.row)">修复</el-link>
             </template>
            </el-table-column>
        </el-table>
        <div class="pagination" v-if="orderList.length > 0">
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
    
    <Detail v-if="showDetail" :orderInfo="rowInfo" @closeDialog="closeDialog(arguments)"/>

    <!-- 异常订单详细字段信息 -->
    <div v-if="showUnInfo">
     <el-dialog
      v-dialogDrag
      title="异常订单详细字段"
      :close-on-click-modal="false"
      :visible.sync="showUnInfo"
       width="80%"
      >
        <el-table
           :header-cell-style="tableHeaderStyle"
            :data="rowList"
            border
            style="width: 100%">
            <el-table-column
             prop="startSoc"
             label="开始充电SOC(%)"
             width="150"
             align="center"
             show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="endSoc"
            label="结束充电SOC(%)"
            width="150"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="startTime"
            label="充电开始时间"
            width="170"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="endTime"
            label="充电结束时间"
            width="170"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
             <el-table-column
            prop="startEleValue"
            label="开始电表度数(kWh)"
            width="160"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
             <el-table-column
            prop="endEleValue"
            label="结束电表度数(kWh)"
            width="160"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="tipUnitChargeFee"
            label="电费尖段(元)"
            width="100"
            align="center"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              {{scope.row.tipUnitChargeFee ? scope.row.tipUnitChargeFee.toFixed(6) : 0}}
            </template>
            </el-table-column>
            <el-table-column
            prop="peakUnitChargeFee"
            label="电费峰段(元)"
            width="100"
            align="center"
            show-overflow-tooltip
            >
              <template slot-scope="scope">
              {{scope.row.peakUnitChargeFee ? scope.row.peakUnitChargeFee.toFixed(6) : 0}}
            </template>
            </el-table-column>
            <el-table-column
            prop="flatUnitChargeFee"
            label="电费平段(元)"
            width="100"
            align="center"
            show-overflow-tooltip
            >
              <template slot-scope="scope">
              {{scope.row.flatUnitChargeFee ? scope.row.flatUnitChargeFee.toFixed(6) : 0}}
            </template>
            </el-table-column>
            <el-table-column
            prop="valleyUnitChargeFee"
            label="电费谷段(元)"
            width="100"
            align="center"
            show-overflow-tooltip
            >
              <template slot-scope="scope">
              {{scope.row.valleyUnitChargeFee ? scope.row.valleyUnitChargeFee.toFixed(6) : 0}}
            </template>
            </el-table-column>
            <el-table-column
            prop="chargeTime"
            label="充电时长"
            align="center"
            show-overflow-tooltip
            >
             <template slot-scope="scope">
                {{Number(scope.row.chargeTime) > 0 ? formatSeconds(scope.row.chargeTime) : 0}}
            </template>
            </el-table-column>
           
        </el-table>
         
      <div slot="footer" style="text-align: center; margin: 30px 0 5px 0">
        <el-button @click="showUnInfo = false">关闭</el-button>
      </div> 
    </el-dialog>
   </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getErrorOrderList, errorOrderDownload } from '@/api/financial/order'
// 网点列表接口
import { chargGroupInfo } from '@/api/asset/charggroupinfo'
import { streamToExcel, formatSeconds } from '@/utils/utils'
import Detail from './detail.vue'

export default {
  components: {
    Detail
  },
  data() {
    return {
     showDetail: false,
     showUnInfo: false, // 异常详情字段 
     orgId: null,
     searchInfo: {
      groupId: null, // 组织机构id
      orderNo: null, // 订单号
      deviceNo: null, // 充电设备编号
      cardNo: null, // 卡号
      workerName: null, // 姓名
      errorType: null, // 错误类型
      carNo: null, // 车牌号
      dealStatus: null, // 订单状态
      stationNo: null, // 网点
      startRechargeTime1: null, 
      startRechargeTime2: null, 
      errorTime1: null,
      errorTime2: null,
      pageNo: 1,
      pageSize: 10,
     },  
     showLoading: false, 
     startRechargeTime: [], 
     errorTime: [],
     rowInfo: null,
     rowList: [],
     siteList: [], // 网点列表
     consumeObj: {
         1: 'APP',
         2: '刷卡',
         3: 'VIN'
     },
     dealStatusObj: {
       1:'未处理',
       2: '已处理',
       3: '处理完成'
     },
      statusList: [
        {label: '未处理', value: 1},
        {label: '已处理', value: 2},
        {label: '处理完成', value: 3},
      ],
      total: 0,
      orderList: []
    }
  },
  computed: {
    ...mapGetters(['deptList', 'dictInfo'])
  },
  created() {
    // this.searchInfo.groupId = this.deptList.length > 0 ? this.deptList[0].id : null
    // if(this.searchInfo.groupId) {
    //   this.fetchOrderList()
    // }
    this.fetchOrderList()
    this.fetchSiteList()
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
     formatSeconds(val){
      return formatSeconds(val)
    },
    async fetchOrderList() {
      const rsp = await getErrorOrderList(this.searchInfo)
      if(rsp.code === 200) {
        this.orderList = rsp.data.list
        this.total = rsp.data.total
      }
    },
    async fetchSiteList() {
       const data = {
         pageNum: 1,
         pageSize: 1000
       }
        const rsp = await chargGroupInfo(data)
        if(rsp.code === 200) {
          this.siteList = rsp.data.result
        }
    },
    toSearch() {
      // const id = this.deptList.length > 0 ? this.deptList[0].id : null
      // this.searchInfo.groupId = this.orgId || id
      this.searchInfo.groupId = this.orgId
      this.searchInfo.pageNo = 1
      if(this.startRechargeTime && this.startRechargeTime.length > 0) {
        this.searchInfo.startRechargeTime1 = this.startRechargeTime[0]
        this.searchInfo.startRechargeTime2 = this.startRechargeTime[1]
      }else {
        this.searchInfo.startRechargeTime1 = null
        this.searchInfo.startRechargeTime2 = null
      }
      if(this.errorTime && this.errorTime.length > 0) {
        this.searchInfo.errorTime1 = this.errorTime[0]
        this.searchInfo.errorTime2 = this.errorTime[1]
      }else {
        this.searchInfo.errorTime1 = null
        this.searchInfo.errorTime2 = null
      }
      this.fetchOrderList()
    },
    toRepair(row) {
      this.showDetail = true
      this.rowInfo = JSON.parse(JSON.stringify(row)) 
    },
    openOrgList() {
      this.$refs.stageSelect.blur();
    },
    resetSearch() {
      this.searchInfo = {
        groupId: null, // 组织机构id
        orderNo: null, // 订单号
        deviceNo: null, // 充电设备编号
        cardNo: null, // 卡号
        workerName: null, // 姓名
        errorType: null,
        carNo: null, // 车牌号
        dealStatus: null, // 订单状态
        stationNo: null, // 网点
        startRechargeTime1: null, 
        startRechargeTime2: null, 
        errorTime1: null,
        errorTime2: null,
        pageNo: 1,
        pageSize: 10,
      }
      this.orgId = null
     this.startRechargeTime = []
     this.errorTime = []
    },
    handleCurrentChange(page) {
      this.searchInfo.pageNo = page
      this.fetchOrderList()
    },
     handleSizeChange(pageSize) {
      this.searchInfo.pageNo = 1
      this.searchInfo.pageSize = pageSize
      this.fetchOrderList()
    },
    closeDialog(item) {
      if(item && item[0] === 2) {
        this.fetchOrderList()
      }
      this.showDetail = false
      this.rowInfo = null
    },
    async toDownload() {
    this.showLoading = true
    const rsp = await errorOrderDownload(this.searchInfo)
      if(rsp && rsp.size > 0) {
          streamToExcel(rsp, '异常订单')
          this.$message({
            type: 'success',
            message: '导出成功'
          })
      }
      this.showLoading = false
    },
    seeUnDetail(row) {
      this.rowList = [row]
      this.showUnInfo = true
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.chrOrderSea {
  .seaBox {
    background-color: #fff;
    border-radius: 4px;
    padding: 20px 20px 0 20px;
    .seaLine {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
         .seaItem {
            display: flex;
            align-items: center; 
            margin-right: 30px;   
            .label {
                color: $mainTextColor;
                font-size: $fontSize14;
                width: 100px;
                margin-right: 10px;
                text-align: right;
            } 
        }
    }
  }
  .tableBox {
    background-color: #fff;
    border-radius: 4px;
    min-height: calc(100vh - 340px);
    margin: 10px 0;
    overflow: auto;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px  20px 0 20px;
     .title {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        .name {
          font-size: $fontSize16;
          color: $mainTitleColor;
          font-weight: 400;
        }
      }
      .options {
       margin-bottom: 10px;
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
  }
  table {
  border-collapse: collapse;
  width: 100%;
  margin: 10px 0 20px 0;
}

th, td {
  text-align: center;
  padding: 8px;
  color: #666;
  border: 1px solid #cfcfcf;
}

th {
  background-color: #f2f2f2;
  color: #666;
}
}
</style>
