<template>
  <div class="chrOrderSea">
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
              <el-select v-model="searchConf.stationNo" :clearable="true" filterable @change="changeSite" placeholder="请选择充电网点">
                <el-option
                  v-for="item in siteList"
                  :key="item.recSiteNum"
                  :label="item.chargGroupName"
                  :value="item.recSiteNum"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item label="充电设备名称">
              <el-select v-model="searchConf.deviceName" :clearable="true" filterable @change="changeEquipment" 
              :placeholder="searchConf.stationNo ? '请选择充电设备名称' : '请先选择充电网点'">
                <el-option
                  v-for="item in equipList"
                  :key="item.assetsNum"
                  :label="item.chargName"
                  :value="item.chargName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="充电设备编号">
               <el-input v-model="searchConf.deviceNo" placeholder="请填写充电设备编号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item label="枪号">
                <el-select ref="stageSelect" v-model="searchConf.gunNo" clearable 
                 :placeholder="searchConf.deviceName ? '请选择枪号' : '请先选择充电设备'">
                <el-option
                  v-for="item in gunList"
                  :key="item.gunNum"
                  :label="item.gunNum"
                  :value="item.gunNum"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item label="订单号">
               <el-input v-model="searchConf.orderNo" placeholder="请输入交易订单号" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="卡号">
              <el-input v-model="searchConf.cardNo" placeholder="请输入卡号" />
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item label="姓名">
             <el-input v-model="searchConf.workerName" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始充电时间">
               <el-date-picker
                popper-class="dateRange"
                v-model="rechargeTimeList"
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
            <el-form-item label="充电上报时间">
                <el-date-picker
                  popper-class="dateRange"
                  v-model="settleTimeList"
                  type="datetimerange"
                  size="small"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
                </el-date-picker>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
           <el-col :span="6">
            <el-form-item label="上报车牌号">
              <el-input v-model="searchConf.carNo" placeholder="请输入上报车牌号"/>
            </el-form-item>
           </el-col>
            <el-col :span="18" style="text-align: right">
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
          <div class="name">充电记录列表</div>
        </div>
        <div class="options">
          <el-button @click="exportOrder" :loading="showLoading"> <i class="iconfont icon-daochu"></i> 导出</el-button>
        </div>
      </div>
      <div class="table">
          <el-table
           :header-cell-style="tableHeaderStyle"
            :data="orderList"
            border
            max-height="620"
            style="width: 100%;">
            <el-table-column
            fixed
            prop="orderNo"
            label="订单号"
            width="200"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="groupName"
            label="充电机构"
            width="200"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="stationName"
            label="充电网点"
            width="180"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="deviceName"
            label="充电设备名称"
            width="180"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
             <el-table-column
            prop="deviceNo"
            label="充电设备编码"
            width="180"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="gunNum"
            label="枪号"
            width="80"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="cardCode"
            label="卡号"
            width="160"
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
            label="上报车牌号"
            width="120"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="upVin"
            label="上报VIN"
            width="180"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="bindCarNo"
            label="绑定车牌号"
            width="120"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="bindVin"
            label="绑定VIN"
            width="180"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="consumeType"
            label="消费方式"
            width="100"
            align="center"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              {{consumeObj[scope.row.consumeType]}}
            </template>
            </el-table-column>
             <el-table-column
             prop="startSoc"
             label="开始充电SOC(%)"
             width="160"
             align="center"
             show-overflow-tooltip
            >
            <template slot-scope="scope">
              {{(scope.row.startSoc == '255' || scope.row.startSoc == '-1') ? '--' : scope.row.startSoc}}
            </template>
            </el-table-column>
            <el-table-column
            prop="endSoc"
            label="结束充电SOC(%)"
            width="160"
            align="center"
            show-overflow-tooltip
            >
             <template slot-scope="scope">
              {{(scope.row.endSoc == '255' || scope.row.endSoc == '-1') ? '--' : scope.row.endSoc}}
            </template>
            </el-table-column>
            <el-table-column
            prop="startTime"
            label="开始充电时间"
            width="160"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="endTime"
            label="结束充电时间"
            width="160"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="dealTime"
            label="交易时间"
            width="160"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="insertTime"
            label="充电记录上报时间"
            width="180"
            align="center"
            show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="chargeTime"
            label="充电时长"
            width="160"
            align="center"
            show-overflow-tooltip
            >  
             <template slot-scope="scope">
                <!-- {{Number(scope.row.chargeTime) > 0 ? (scope.row.chargeTime / 60).toFixed(2) : 0}} -->
                {{Number(scope.row.chargeTime) > 0 ? formatSeconds(scope.row.chargeTime) : 0}}
            </template>
            </el-table-column>
            <el-table-column
            prop="startEleValue"
            label="开始电表度数(kWh)"
            width="180"
            align="center"
            show-overflow-tooltip
            >
             <template slot-scope="scope">
              {{Number(scope.row.startEleValue) > 0 ? scope.row.startEleValue.toFixed(3) : 0}}
            </template>
            </el-table-column>
            <el-table-column
            prop="endEleValue"
            label="结束电表度数(kWh)"
            width="180"
            align="center"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              {{Number(scope.row.endEleValue) > 0 ? scope.row.endEleValue.toFixed(3) : 0}}
            </template>
            </el-table-column>
            <el-table-column
            prop="useEleValue"
            label="消耗电量(kWh)"
            width="160"
            align="center"
            >
             <template slot-scope="scope">
                 <!-- <el-button type="text" @click="toShowEleType(scope.row)">
                     {{Number(scope.row.useEleValue) > 0 ? scope.row.useEleValue.toFixed(3) : 0}}
                   </el-button> -->
              <el-link type="primary" :underline="false">
                <div class="useTitle" @click="toShowEleType(scope.row)">
                 {{Number(scope.row.useEleValue) > 0 ? scope.row.useEleValue.toFixed(3) : 0}}
                </div>
              </el-link>
             </template>
            </el-table-column>
            <el-table-column
            prop="chargeEleCost"
            label="用电费用(元)"
            width="160"
            align="center"
            >
             <template slot-scope="scope">
                 <el-link type="primary" :underline="false">
                <div class="useTitle" @click="toShowFeeType(scope.row)">
                  {{Number(scope.row.chargeEleCost) > 0 ? scope.row.chargeEleCost.toFixed(6) : 0}}
                </div>
              </el-link>
             </template>
            </el-table-column>
            <el-table-column
            prop="chargeServiceCost"
            label="充电服务费(元)"
            width="160"
            align="center"
            >
             <!-- <template slot-scope="scope">
              {{Number(scope.row.chargeServiceCost) > 0 ? scope.row.chargeServiceCost.toFixed(6) : 0}}
            </template> -->
            <template slot-scope="scope">
                 <el-link type="primary" :underline="false">
                <div class="useTitle" @click="toShowSeviceType(scope.row)">
                  {{Number(scope.row.chargeServiceCost) > 0 ? scope.row.chargeServiceCost.toFixed(6) : 0}}
                </div>
              </el-link>
             </template>
            </el-table-column>
            <el-table-column
            prop="sumCost"
            label="本次收费总计(元)"
            width="160"
            align="center"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              {{Number(scope.row.sumCost) > 0 ? scope.row.sumCost.toFixed(6) : 0}}
            </template>
            </el-table-column>
        </el-table>
        <div class="pagination" v-if="orderList.length > 0">
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

    <!-- 峰平谷尖用电量 -->
  <div v-if="showEleTypeInfo">
   <el-dialog
    v-dialogDrag
    title="充电电量明细"
    :visible.sync="showEleTypeInfo"
    width="35%"
    :destroy-on-close="true"
    :close-on-click-modal="false"
   
  >
   <div class="typeBox"> 
   <table>
    <tr>
      <th>峰(kWh)</th>
      <th>平(kWh)</th>
      <th>谷(kWh)</th>
      <th>尖(kWh)</th>
   </tr>
   <tr>
    <td>{{Number(rowInfo.peakUnitEle) > 0 ? rowInfo.peakUnitEle.toFixed(3) : 0}}</td>
    <td>{{Number(rowInfo.flatUnitEle) > 0 ? rowInfo.flatUnitEle.toFixed(3) : 0}}</td>
    <td>{{Number(rowInfo.valleyUnitEle) > 0 ? rowInfo.valleyUnitEle.toFixed(3) : 0}}</td>
    <td>{{Number(rowInfo.tipUnitEle) > 0 ? rowInfo.tipUnitEle.toFixed(3) : 0}}</td>
    </tr>
   </table>
      <div slot="footer" style="text-align: center">
         <el-button type="primary" plain @click="showEleTypeInfo = false">关闭</el-button>
      </div>
   </div>
   </el-dialog>
   </div>

    <!-- 峰平谷尖用电电费 -->
  <div v-if="showFeeTypeInfo">
   <el-dialog
    v-dialogDrag
    title="充电费用明细"
    :visible.sync="showFeeTypeInfo"
    width="35%"
    :destroy-on-close="true"
    :close-on-click-modal="false"
   
  >
   <div class="typeBox"> 
   <table>
    <tr>
      <th>峰(元)</th>
      <th>平(元)</th>
      <th>谷(元)</th>
      <th>尖(元)</th>
   </tr>
   <tr>
    <td>{{Number(rowInfo.peakUnitChargeFee) > 0 ? rowInfo.peakUnitChargeFee.toFixed(6) : 0}}</td>
    <td>{{Number(rowInfo.flatUnitChargeFee) > 0 ? rowInfo.flatUnitChargeFee.toFixed(6) : 0}}</td>
    <td>{{Number(rowInfo.valleyUnitChargeFee) > 0 ? rowInfo.valleyUnitChargeFee.toFixed(6) : 0}}</td>
    <td>{{Number(rowInfo.tipUnitChargeFee) > 0 ? rowInfo.tipUnitChargeFee.toFixed(6) : 0}}</td>
    </tr>
   </table>
      <div slot="footer" style="text-align: center">
         <el-button type="primary" plain @click="showFeeTypeInfo = false">关闭</el-button>
      </div>
   </div>
   </el-dialog>
   </div>

   <!-- 峰平谷尖服务费 -->
  <div v-if="showServiceInfo">
   <el-dialog
    v-dialogDrag
    title="服务费用明细"
    :visible.sync="showServiceInfo"
    width="35%"
    :destroy-on-close="true"
    :close-on-click-modal="false"
  >
   <div class="typeBox"> 
   <table>
    <tr>
      <th>峰(元)</th>
      <th>平(元)</th>
      <th>谷(元)</th>
      <th>尖(元)</th>
   </tr>
   <tr>
    <td>{{Number(rowInfo.peakUnitServiceFee) > 0 ? rowInfo.peakUnitServiceFee.toFixed(6) : 0}}</td>
    <td>{{Number(rowInfo.flatUnitServiceFee) > 0 ? rowInfo.flatUnitServiceFee.toFixed(6) : 0}}</td>
    <td>{{Number(rowInfo.valleyUnitServiceFee) > 0 ? rowInfo.valleyUnitServiceFee.toFixed(6) : 0}}</td>
    <td>{{Number(rowInfo.tipUnitServiceFee) > 0 ? rowInfo.tipUnitServiceFee.toFixed(6) : 0}}</td>
    </tr>
   </table>
      <div slot="footer" style="text-align: center">
         <el-button type="primary" plain @click="showServiceInfo = false">关闭</el-button>
      </div>
   </div>
   </el-dialog>
   </div> 

  </div>
</template>

<script>
import { getEleOrderList, getSelectGunList, getChargingExcel } from '@/api/financial/order'
// 网点列表接口
import { chargGroupInfo } from '@/api/asset/charggroupinfo'
// 网点设备列表
import { chargGroup } from '@/api/asset/charggroup'
import { mapGetters } from 'vuex'
import { streamToExcel, formatSeconds } from '@/utils/utils'
export default {
  data() {
    return {
     orgId: null, // 组织机构id
     searchConf: {
      groupId: null, // 组织机构id
      stationNo: null, // 充电网点编码
      deviceName: null, // 充电设备名称
      deviceNo: null, // 充电设备编号
      gunNo: null, // 枪id
      orderNo: null, // 交易流水号
      cardNo: null, // 卡号
      workerName: null, // 姓名
      carNo: null, // 车牌号
      startRechargeTime: null, // 开始充电时间
      endRechargeTime: null, // 结束充电时间
      settleTime: null, // 结算开始时间
      endSettleTime: null, // 结算结束时间
      pageNo: 1,
      pageSize: 10,
     }, 
     showLoading: false,
     settleTimeList: [], 
     rechargeTimeList: [],
     rowInfo: null,
     showEleTypeInfo: false, // 是否展示具体电量
     showFeeTypeInfo: false, // 是否展示具体费用
     showServiceInfo: false, // 是否展示服务费用
     consumeObj: {
         1: 'APP',
         2: '刷卡',
         3: 'VIN'
     },
      siteList: [],
      equipList: [],
      total: 0,
      gunList: [],
      orderList: []
    }
  },
  computed: {
    ...mapGetters(['deptList'])
  },
  created() {
    // this.searchConf.groupId = this.deptList.length > 0  ? this.deptList[0].id : null
    // if(this.searchConf.groupId) {
    //    this.fetchOrderList() 
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
     openOrgList() {
      this.$refs.stageSelect.blur();
    },
    // 获取订单列表
    async fetchOrderList() {
        const rsp = await getEleOrderList(this.searchConf)
        if(rsp.code === 200) {
            this.total = rsp.data.total
            this.orderList = rsp.data.list
        }
    },
    // 获取网点列表
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
    // 获取网点设备列表
    async fetchEquipmentList(name) {
      const data = {
        pageNum: 1,
        pageSize: 1000,
        chargGroupName: name
      }
      const rsp = await chargGroup(data)
      if(rsp.code === 200) {
        this.equipList = rsp.data.result
      }
    },
    // 获取枪号列表
    async fetchGunList(num) {
      const rsp = await getSelectGunList(num)
      if(rsp.code === 200) {
        this.gunList = rsp.data
      }
    },
    toSearch() {
      // const id = this.deptList.length > 0 ? this.deptList[0].id : null
      // this.searchConf.groupId = this.orgId || id
      this.searchConf.groupId = this.orgId
      this.searchConf.pageNo = 1
      this.searchConf.startRechargeTime = this.rechargeTimeList.length > 0 ? this.rechargeTimeList[0] : null
      this.searchConf.endRechargeTime = this.rechargeTimeList.length > 0 ? this.rechargeTimeList[1] : null
      this.searchConf.settleTime = this.settleTimeList.length > 0 ? this.settleTimeList[0] : null
      this.searchConf.endSettleTime = this.settleTimeList.length > 0 ? this.settleTimeList[1] : null
      this.fetchOrderList()
    },
    toShowEleType(row) {
      this.rowInfo = row
      this.showEleTypeInfo = true
    },
    toShowFeeType(row) {
      this.rowInfo = row
      this.showFeeTypeInfo = true
    },
    toShowSeviceType(row) {
      this.rowInfo = row
      this.showServiceInfo = true
    },
    // 切换网点
    changeSite(val) {
        this.equipList = [];
        this.searchConf.deviceName = null
        this.searchConf.deviceNo = null
        if(val) {
          const arr = this.siteList.filter(item => item.recSiteNum === val)
          if(arr.length > 0) {
            this.fetchEquipmentList(arr[0].chargGroupName)
          }
        }
    },
    //切换充电设备
    changeEquipment(val) {
      this.gunList = []
      this.searchConf.gunNo = null
      this.searchConf.deviceNo = null
      const arr = this.equipList.filter(item => item.chargName === val)
      this.searchConf.deviceNo = arr.length > 0 ? arr[0].assetsNum : null
      if(this.searchConf.deviceNo) {
        this.fetchGunList(this.searchConf.deviceNo)
      }
      
    },
    async exportOrder() {
      this.showLoading = true
      const rsp = await getChargingExcel(this.searchConf)
      if(rsp && rsp.size > 0) {
          streamToExcel(rsp, '充电记录')
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
    resetSearch() {
      this.searchConf = {
         groupId: null,
         stationNo: null, 
         deviceName: null,
         deviceNo: null,
         gunNo: null,
         orderNo: null,
         cardNo: null,
         workerName: null,
         carNo: null, 
         startRechargeTime: null, // 开始充电时间
         endRechargeTime: null, // 结束充电时间
         settleTime: null, // 结算开始时间
         endSettleTime: null, // 结算结束时间
         pageNo: 1,
         pageSize: 10,
      }
      this.rechargeTimeList = []
      this.settleTimeList = []
      this.orgId = null
    },
    handleCurrentChange(page) {
        this.searchConf.pageNo = page
        this.fetchOrderList()
    },
    handleSizeChange(pageSize) {
      this.searchConf.pageNo = 1
      this.searchConf.pageSize = pageSize
      this.fetchOrderList()
    }
  }
}
</script>
<style lang="scss">
.value .el-input__prefix .el-input__icon{
  margin-top: -3px;
}
.useTitle {
  width: 140px;
  margin: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
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
            &:last-child {
              margin-right: 0;
            }
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
