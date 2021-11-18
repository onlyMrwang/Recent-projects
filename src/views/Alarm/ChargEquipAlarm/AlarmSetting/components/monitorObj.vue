<template>
  <div class="monitorBox">
      <div class="tabs">
      <div class="tabList">
        <div v-for="item in tabList" :key="item.id" 
        :class=" item.value === activeIndex ? 'activeItem' : 'item'"
         @click="handleClick(item)">
         {{ item.name }}
        </div>
      </div>
      <div class="line"></div>
    </div>
    <!-- 车辆 -->
    <div v-show="activeIndex === 1" class="tabBox">
        <div class="searchBox">
            <div class="itemBox">
             <div class="item">
                <div class="label">组织机构</div>
                <div class="value">
                      <treeselect
                        :options="deptList"
                        v-model="carSearchConf.orgId"
                        :default-expand-level="1"
                        placeholder="请选择组织机构"
                        :normalizer="normalizer"
                        />
                </div>
            </div>
            <div class="item">
                <div class="label">车牌号</div>
                <div class="value">
                    <el-input v-model="carSearchConf.carNumber" placeholder="请输入充电设备名称"/>
                </div>
            </div>
         </div>
         <div class="options">
             <el-button type="primary" @click="toSearchCar">查询</el-button>
             <el-button @click="resetCar">重置</el-button>
         </div>
        </div>
        <div class="add">
            <el-button type="primary" icon="el-icon-plus" @click="addCar">新增</el-button>
        </div>
        <div class="table">
            <el-table
             border
            :data="carList"
            :header-cell-style="tableHeaderStyle"
            max-height="360px"
            style="width: 100%;height: 360px">
            <el-table-column
                prop="nameCn"
                label="组织机构"
                align="center"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="carNumber"
                label="车牌号"
                align="center"
                show-overflow-tooltip
                >
            </el-table-column>
            <el-table-column
                prop="carVin"
                label="车辆VIN码"
                align="center"
                show-overflow-tooltip
            >
            </el-table-column>
               <el-table-column
                prop="carModel"
                label="车辆型号"
                align="center"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="userBroaHead"
            label="车辆类型"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
               {{Number(scope.row.userBroaHead) >= 0 ? dictInfo.usebroaHeadObj[scope.row.userBroaHead] : null }}
            </template>
          </el-table-column>
          <el-table-column
            prop="userSubcHead"
            label="车辆用途"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{(Number(scope.row.userBroaHead) >= 0 && Number(scope.row.userSubcHead) >= 0) ? formatSubName(scope.row.userBroaHead, scope.row.userSubcHead) : null}}
            </template>
          </el-table-column>
            <el-table-column
                prop="x"
                label="操作"
                align="center"
                show-overflow-tooltip
            >
            <template slot-scope="scope">
                <el-link :underline="false" type="primary" @click="removeCar(scope.row, scope.$index)">
                    移除
                </el-link>
            </template>
            </el-table-column>
         </el-table> 
          <div class="pagination" v-if="carList.length > 0">
           <el-pagination
              background
              @size-change="handleCarSizeChange"
              @current-change="handleCarPage"
              :current-page="carSearchConf.pageNo"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="carSearchConf.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="carTotal">
          </el-pagination>
        </div>
        </div>
    </div>
    <!-- 设备 -->
    <div v-show="activeIndex === 2" class="tabBox">
         <div class="searchBox">
            <div class="itemBox">
             <div class="item">
                <div class="label">充电网点</div>
                <div class="value">
                     <el-select v-model="chargingSearchConf.chargGroupCode" placeholder="请选择充电网点">
                         <el-option
                            v-for="item in siteList"
                            :key="item.chargGroupId"
                            :label="item.chargGroupName"
                            :value="item.recSiteNum"
                            >
                        </el-option>
                    </el-select>
                </div>
            </div>
            <!-- <div class="item">
                <div class="label">充电设备名称</div>
                <div class="value"> -->
                      <!-- <el-select v-model="chargingSearchConf.chargName" placeholder="请选择充电设备名称">
                        <el-option
                            v-for="item in chargingNameList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select> -->
                    <!-- <el-input v-model="chargingSearchConf.chargName" placeholder="请输入充电设备名称"/>
                </div>
            </div> -->
            <div class="item">
                <div class="label">充电设备编号</div>
                <div class="value">
                    <el-input v-model="chargingSearchConf.assetsNum" placeholder="请输入充电设备编号" />
                </div>
            </div>
         </div>
         <div class="options">
             <el-button type="primary" @click="toSearchCharging">查询</el-button>
             <el-button @click="resetCharging">重置</el-button>
         </div>
        </div>
            <div class="add">
            <el-button type="primary" icon="el-icon-plus" @click="addCharge">新增</el-button>
        </div>
        <div class="table">
            <el-table
            border
            :data="chargeList"
            :header-cell-style="tableHeaderStyle"
            max-height="360px"
            style="width: 100%;height: 360px">
            <el-table-column
                prop="chargGroupName"
                label="网点名称"
                align="center"
                show-overflow-tooltip
                >
            </el-table-column>
            <el-table-column
                prop="chargGroupCode"
                label="充电网点编号"
                align="center"
                show-overflow-tooltip
                >
            </el-table-column>
            <el-table-column
                prop="chargName"
                label="设备名称"
                align="center"
                show-overflow-tooltip
            >
            </el-table-column>
               <el-table-column
                prop="assetsNum"
                label="设备编码"
                align="center"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
            prop="chargEquipType"
            label="设备类型"
            align="center"
            show-overflow-tooltip
          >
          <template slot-scope="scope">
              {{Number(scope.row.chargEquipType) >= 0 ? dictInfo.chargEquipTypeObj[scope.row.chargEquipType] : null}}
          </template>
          </el-table-column>
          <el-table-column
            prop="chargInterNum"
            label="接口数量"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
           <el-table-column
            prop="ratedPow"
            label="设备额定功率(W)"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
            <el-table-column
            prop="voltageTop"
            align="center"
            label="额定电压上限"
            show-overflow-tooltip
          >
          </el-table-column>
           <el-table-column
            prop="carModel"
            label="支持车型"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
            <el-table-column
                prop="x"
                label="操作"
                align="center"
                show-overflow-tooltip
            >
            <template slot-scope="scope">
                <el-link :underline="false" type="primary" @click="removeCharge(scope.row, scope.$index)">
                    移除
                </el-link>
            </template>
            </el-table-column>
         </el-table> 
          <div class="pagination" v-if="chargeList.length > 0">
          <el-pagination
              background
              @size-change="handleChargeSizeChange"
              @current-change="handleChargingPage"
              :current-page="chargingSearchConf.pageNo"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="chargingSearchConf.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="chargeTotal">
          </el-pagination>
        </div>
        </div>
    </div>

  <!-- 增加弹窗 -->
  <ObjDialog v-if="showAddDialog" :objType="objType" @submitAdd="objAdd(arguments)" @closeDialog="closeDialog" :siteList="siteList"/>
  </div>
</template>

<script>
import { listChargGroupCode } from "@/api/alarm/alarmmonitorcenter"
import { getPreCarList, getPreChargeList } from '@/api/alarm/preAlarm'
import { mapGetters } from 'vuex'
import { arrToObj } from '@/utils/utils'
import ObjDialog from './objDialog.vue'
export default {
    components: { ObjDialog },
    props: {
        type: {
            type: Number,
            default: 1
        },
        rowInfo: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
   data() {
       return {
           tabList: [
               { id: 1, name: '已添加车辆', value: 1 },
               { id: 2, name: '已添加设备', value: 2 },
           ],
           activeIndex: 1,
           carSearchConf: {
               pageNo: 1,
               pageSize: 10,
               orgId: null,
               carNumber: null,
               warningRuleId: ''
           },
            chargingSearchConf: {
               pageNo: 1,
               pageSize: 10,
               chargName: null,
               assetsNum: null,
               chargGroupCode: null,
               warningRuleId: ''
           },
           carList: [],
           carTotal: 0,
           chargeList: [], // 设备列表
           chargeTotal: 0,
           siteList: [], // 网点列表
           chargingNameList: [], // 设备名称列表
           showAddDialog: false, // 是否展示增加弹窗
           objType: null, // 1: 车辆, 2：充电设备  

       }
   },
   computed: {
       ...mapGetters(['deptList', 'dictInfo'])
   },
   created() {
       this.fetchSiteList()
       if(this.type === 2) {
           this.carSearchConf.warningRuleId = this.rowInfo.id
           this.chargingSearchConf.warningRuleId = this.rowInfo.id
           this.fetchCarList()
           this.fetchChargeList()
       }
   },
   methods: {
       async fetchSiteList() {
           const rsp = await listChargGroupCode()
           if(rsp.code === 200) {
                this.siteList = rsp.data;  
           }
       },
       async fetchCarList() {
           const rsp = await getPreCarList(this.carSearchConf)
           if(rsp.code === 200) {
               this.carList = rsp.data.list
               this.carTotal = rsp.data.total
           }
       },
       async fetchChargeList() {
           const rsp = await getPreChargeList(this.chargingSearchConf)
           if(rsp.code === 200) {
               this.chargeList = rsp.data.list 
               this.chargeTotal = rsp.data.total
           }
       },
       toSearchCar() {
           this.carSearchConf.warningRuleId = this.rowInfo.id
           this.carSearchConf.pageNo = 1
           this.fetchCarList()      
       },
       // 移除车辆
       removeCar(row, index) { 
           this.carTotal = this.carList.length - 1
           this.carList.splice(index, 1)
       },
       handleCarPage(page) {
           this.carSearchConf.pageNo = page
           this.fetchCarList()
       },
        handleCarSizeChange(pageSize) {
           this.carSearchConf.pageSize = pageSize
           this.carSearchConf.pageNo = 1
           this.fetchCarList()
       },
       resetCar() {
        this.carSearchConf = {
            pageNo: 1,
            pageSize: 10,
            orgId: null,
            carNumber: null,
          }
       },
       toSearchCharging() {
           this.chargingSearchConf.warningRuleId = this.rowInfo.id
           this.chargingSearchConf.pageNo = 1
           this.fetchChargeList()
       },
       handleChargingPage(page) {
           this.chargingSearchConf.pageNo = page
           this.fetchChargeList()
       },
        handleChargeSizeChange(pageSize) {
           this.chargingSearchConf.pageSize = pageSize
           this.chargingSearchConf.pageNo = 1
           this.fetchChargeList()
       },
       removeCharge(row, index) {
          this.chargeTotal = this.chargeList.length - 1
          this.chargeList.splice(index, 1)
       },
        resetCharging() {
        this.chargingSearchConf = {
               pageNo: 1,
               pageSize: 10,
               chargName: null,
               assetsNum: null,
               chargGroupCode: null,
           }
        },
       handleClick(item) {
           this.activeIndex = item.id
           this.objType = item.id
       },
       addCar() {
           this.objType = 1
           this.showAddDialog = true
       },
       addCharge() {
           this.objType = 2
           this.showAddDialog = true
       },
       objAdd(val) {
           if(val) {
             if(this.objType === 1) {
                 this.carList = this.carList.concat(val[0])
                 this.carTotal = this.carList.length
             }else {
                 this.chargeList = this.chargeList.concat(val[0])
                 this.chargeTotal = this.chargeList.length
             } 
           }
           this.showAddDialog = false
       },
    // 关闭增加弹窗
    closeDialog() {
        this.showAddDialog = false
        this.objType = null
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
     formatSubName(pVal, sVal) {
      if(Number(pVal) >= 0 && Number(sVal) >= 0 && this.dictInfo.usesubcHead.length > 0 && this.dictInfo.usebroaHead.length > 0) {
          const parr = this.dictInfo.usebroaHead.filter(item => item.value == pVal)
          let arr = []
          if(parr.length > 0) {
            arr = this.dictInfo.usesubcHead.filter(item => item.parentValue == parr[0].id)   
          }
          if(arr.length > 0) {
            const obj = arrToObj(arr)
            return obj[sVal]   
          }else {
              return null
          }
      }else {
          return null
      }
    }
   }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.monitorBox {
    padding-top: 20px;
    //  
 .tabs {
    display: flex;
    .tabList {
      display: flex;
      align-items: center;
      margin: -40px 0 10px 0;
      .item {
        padding: 10px 30px;
        font-size: 13px;
        color: #666666;
        cursor: pointer;
        border-bottom: 1px solid $tableBorderColor;
      }
      .activeItem {
        padding: 10px 30px;
        font-size: 13px;
        cursor: pointer;
        color: $btnMainColor;
        border-bottom: 2px solid $btnMainColor;
      }
    }
    .line {
      height: 0.5px;
      margin-top: -1px;
      flex: 1;
      background-color: $tableBorderColor;
    }
  }
  .tabBox {
      border: 1px solid #dedede;
      border-top: none;
      padding: 15px;    
      margin-top: -12px;
  }
  .searchBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;
     .itemBox {
          display: flex;
          align-items: center;
          .item {
            display: flex;
            align-items: center;
            margin-right: 30px;
            .label {
                color: #484848;
                font-size: 13px;  
                margin-right: 10px;  
            }
          }
      }
  }
  .add {
      margin: 20px 0 10px 0;
  }
   .pagination {
      margin: 10px 0;
      display: flex;
      justify-content: flex-end;
    }
}
</style>