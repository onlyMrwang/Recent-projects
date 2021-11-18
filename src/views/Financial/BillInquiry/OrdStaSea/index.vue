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
             />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="卡号">
             <el-input
              v-model="searchInfo.cardNo"
              placeholder="请输入卡号"
            />
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item label="姓名">
             <el-input
              v-model="searchInfo.workerName"
              placeholder="请输入姓名"
            />
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item label="车牌号">
              <el-input
              v-model="searchInfo.carNo"
              placeholder="请输入车牌号"
            />
            </el-form-item>
          </el-col>
         </el-row>
         <el-row :gutter="5">
           <el-col :span="6">
            <el-form-item label="充电设备编号">
              <el-input
                v-model="searchInfo.deviceNo"
                placeholder="请填写充电设备编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单状态">
             <el-select v-model="searchInfo.orderStatus" :clearable="true" placeholder="请选择订单状态">
              <el-option
                v-for="item in dictInfo.orderStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item label="订单号">
              <el-input
              v-model="searchInfo.orderNo"
              placeholder="请输入订单号"
            />
            </el-form-item>
          </el-col>
           <el-col :span="6" style="text-align: right">
            <el-form-item label="">
               <el-button type="primary" @click="toSearch">查询</el-button>
               <el-button plain @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-col>
         </el-row>
         <el-row>
           <el-col :span="12">
              <el-form-item label="订单创建时间">
                <el-date-picker
                  popper-class="dateRange"
                  v-model="timeList"
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
       </el-form>
    </div>
    <!-- table box-->
    <div class="tableBox">
      <div class="top">
        <div class="title">
          <div class="name">订单状态列表</div>
        </div>
        <div class="options">
          <el-button type="primary" @click="batchSettle" :disabled="searchInfo.orderStatus != '8'">批量结算</el-button>
        </div>
      </div>
      <div class="table">
        <el-table
         :header-cell-style="tableHeaderStyle"
         border
         max-height="600"
          ref="multipleTable"
          :data="orderList"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" width="55">
          </el-table-column>
          <el-table-column align="center" prop="orderNo" fixed label="订单号" width="150">
          </el-table-column>
          <el-table-column
            align="center"
            prop="groupName"
            label="充电机构"
            width="160"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="stationName"
            label="网点名称"
            width="160"
            show-overflow-tooltip
          >
          </el-table-column>
           <el-table-column
            align="center"
            prop="deviceName"
            label="充电设备名称"
            width="160"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="deviceNo"
            label="充电设备编号"
            width="160"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="gunNum"
            label="枪号"
            width="80"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="carNum"
            label="车牌号"
            width="120"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="cardCode"
            label="卡号"
            width="180"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="staffName"
            label="姓名"
            width="80"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="createdTime"
            label="订单创建时间"
            width="180"
            show-overflow-tooltip
          >
          </el-table-column>
           <el-table-column
            align="center"
            prop="orderStatus"
            label="订单状态"
            width="100"
            show-overflow-tooltip
          >
          <template slot-scope="scope">
              {{dictInfo.orderStatusObj[scope.row.orderStatus]}}
          </template>
          </el-table-column>
          <el-table-column prop="x" align="center" width="100" fixed="right" label="操作">
            <template slot-scope="scope">
              <el-link
                :underline="false"
                :disabled="scope.row.orderStatus !== 8"
                @click="toSettle(scope.row)"
                type="primary"
              >
                结算
              </el-link>
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
  </div>
</template>

<script>
import { getOrderStatusList, mulitOrderSettle } from '@/api/financial/order'
import { getArrayProps } from '@/utils/utils'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      orgId: null, // 组织机构id
      searchInfo: {
        orderNo: null, // 订单号
        groupId: null, // 组织机构id
        deviceNo: null, // 充电设备编号
        gunNo: null, // 枪号
        cardNo: null, // 卡号
        workerName: null, // 职工姓名
        carNo: null, // 车牌号
        startRechargeTime1: null, // 开始充电时间
        startRechargeTime2: null, // 开始充电时间
        orderStatus: null, // 充电状态
        stationNo: null, // 网点编码
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      orderList: [],
      timeList: [],
      multipleSelection: [],
      sortValueBy: "ORDER_SELECTED",
    }
  },
  computed: {
      ...mapGetters(['deptList', 'dictInfo'])
  },
  created() {
    // this.searchInfo.groupId = this.deptList.length > 0  ? this.deptList[0].id : null
    // if(this.searchInfo.groupId) {
    //    this.fetchOrderList() 
    // }
     this.fetchOrderList()
  },    
  methods: {
    async fetchOrderList() {
        const rsp = await getOrderStatusList(this.searchInfo)
        if(rsp.code === 200) {
            this.total = rsp.data.total
            this.orderList = rsp.data.list
        }
    },
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
    // 批量结算
    async batchSettle() {
        if(this.multipleSelection.length === 0) {
            this.$message({
                type: 'warning',
                message: '请选择结算订单'
            })
        }else {
          const data = getArrayProps(this.multipleSelection, 'orderNo')
          if(this.multipleSelection.some(item => item.orderStatus !== 8)) {
             this.$message({
                type: 'warning',
                message: '只有待结算订单才能结算'
              })
              return 
          }
          const rsp = await mulitOrderSettle(data)
          if(rsp.code === 200) {
              this.$message({
                type: 'success',
                message: '订单结算成功'
              })
              this.fetchOrderList()
          }
        }
    },
    toSearch() {
      // const id = this.deptList.length > 0 ? this.deptList[0].id : null
      // this.searchInfo.groupId = this.orgId || id
      this.searchInfo.groupId = this.orgId
      this.searchInfo.pageNo = 1
      if(this.timeList && this.timeList.length > 0) {
        this.searchInfo.startRechargeTime1 = this.timeList[0]
        this.searchInfo.startRechargeTime2 = this.timeList[1]
      }else {
        this.searchInfo.startRechargeTime1 = null
        this.searchInfo.startRechargeTime2 = null
      }
      this.fetchOrderList()
    },
    resetSearch() {
      this.searchInfo = {
        orderNo: null,
        groupId: null, // 组织机构id
        deviceNo: null, // 充电设备编号
        gunNo: null, // 枪号
        cardNo: null, // 卡号
        workerName: null, // 职工姓名
        carNo: null, // 车牌号
        startRechargeTime1: null, // 开始充电时间
        startRechargeTime2: null,
        orderStatus: null, // 充电状态
        stationNo: null, // 网点编码
        pageNo: 1,
        pageSize: 10,
      }
      this.orgId = null
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async toSettle(row) {
      const rsp = await mulitOrderSettle([row.orderNo])
      if(rsp.code === 200) {
        this.$message({
          type: 'success',
          message: '订单结算成功'
        })
        this.fetchOrderList()
      }
    }
  }
}
</script>
<style lang="scss">
.value .el-input__prefix .el-input__icon{
  margin-top: -3px;
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
    min-height: calc(100vh - 290px);
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
}
</style>
