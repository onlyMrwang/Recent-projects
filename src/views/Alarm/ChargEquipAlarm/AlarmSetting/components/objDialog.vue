<template>
<div class="objDialog">
  <el-dialog v-dialogDrag :title="objType === 1 ? '车辆列表' : '充电设备列表'" :visible.sync="isShow" 
   width="80%" :before-close="handleClose" :close-on-click-modal="false">
   <div class="tableBox" v-if="objType === 1">
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
          <div class="table">
            <el-table
            border
            :data="carList"
            :header-cell-style="tableHeaderStyle"
            max-height="360"
            style="width: 100%;height: 360px"
            @selection-change="handleSelectCar">
              <el-table-column
                type="selection"
                width="50">
                </el-table-column>
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
         </el-table> 
         <div class="pagination" v-if="carList.length > 0">
           <el-pagination
            background
            @size-change="handleCarSizeChange"
            @current-change="handleCarPage"
            :current-page="carSearchConf.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="carSearchConf.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="carTotal">
          </el-pagination>
        </div>
        </div>
   </div>
  
  <!-- 充电设备 -->
    <div class="tableBox" v-if="objType === 2">
          <div class="searchBox">
            <div class="itemBox">
             <div class="item">
                <div class="label">充电网点</div>
                <div class="value">
                     <el-select v-model="chargingSearchConf.chargGroupName" placeholder="请选择充电网点">
                         <el-option
                            v-for="item in siteList"
                            :key="item.chargGroupId"
                            :label="item.chargGroupName"
                            :value="item.chargGroupName"
                            >
                        </el-option>
                    </el-select>
                </div>
            </div>
            <!-- <div class="item">
                <div class="label">充电设备名称</div>
                <div class="value">
                    <el-input v-model="chargingSearchConf.chargName" placeholder="请输入充电设备名称"/>
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
          <div class="table">
            <el-table
            border
            :data="chargeList"
            :header-cell-style="tableHeaderStyle"
            max-height="360"
            style="width: 100%;height: 360px" 
            @selection-change="handleSelectCharge">
              <el-table-column
                type="selection"
                width="50">
                </el-table-column>
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
            prop="chargEquipTypeName"
            label="设备类型"
            align="center"
            show-overflow-tooltip
          >
          <!-- <template slot-scope="scope">
              {{dictInfo.chargEquipTypeObj[scope.row.chargEquipType]}}
          </template> -->
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
            width="160"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
            <el-table-column
            prop="voltageTop"
            label="额定电压上限"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
           <el-table-column
            prop="carModel"
            align="center"
            label="支持车型"
            show-overflow-tooltip
          >
          </el-table-column>
         </el-table> 
          <div class="pagination" v-if="chargeList.length > 0">
           <el-pagination
            background
            @size-change="handleChargeSizeChange"
            @current-change="handleChargePage"
            :current-page="chargingSearchConf.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="chargingSearchConf.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="chargeTotal">
          </el-pagination>
        </div>
        </div>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="submitSelect">确 定</el-button> 
    <el-button @click="handleClose">取 消</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
import { getCarInfo } from '@/api/asset/vehiclefiles'
import { chargGroup } from '@/api/asset/charggroup'
import { arrToObj } from '@/utils/utils'
import { mapGetters } from 'vuex'
export default {
    props: {
        objType: {
            type: Number,
            default: 1
        },
        siteList: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    data() {
        return {
            isShow: true,
            carSearchConf: {
               pageNum: 1,
               pageSize: 10,
               orgId: null,
               carNumber: null,
           },
            chargingSearchConf: {
               pageNum: 1,
               pageSize: 10,
               chargName: null,
               assetsNum: null,
               chargGroupName: null,
           },
           carList: [],
           carTotal: 0,
           chargeList: [], // 设备列表
           chargeTotal: 0,
           selectCarList: [], // 多选车辆列表
           selectChargeList: [] // 多选充电设备列表
        }
    },
    computed: {
        ...mapGetters(['deptList', 'dictInfo'])
    },
    created() {
        if(this.objType === 1) {
            this.fetchCarList()
        }else {
            this.fetchChargeList()
        }
    },
   methods: {
        async fetchCarList() {
           const rsp = await getCarInfo(this.carSearchConf)
           if(rsp.code === 200) {
               this.carList = rsp.data.list
               this.carTotal = rsp.data.total
           }
       },
       async fetchChargeList() {
           const rsp = await chargGroup(this.chargingSearchConf)
           if(rsp.code === 200) {
               this.chargeList = rsp.data.result 
               this.chargeTotal = rsp.total
           }
    },

    handleCarPage(page) {
        this.carSearchConf.pageNum = page
        this.fetchCarList()
    },
    handleCarSizeChange(pageSize) {
        this.carSearchConf.pageSize = pageSize
        this.carSearchConf.pageNum = 1
        this.fetchCarList()
    },
    handleChargePage(page) {
        this.chargingSearchConf.pageNum = page
        this.fetchChargeList()
    },
    handleChargeSizeChange(pageSize) {
        this.chargingSearchConf.pageSize = pageSize
        this.chargingSearchConf.pageNum = 1
        this.fetchChargeList()
    },
    handleClose() {
        this.$emit('closeDialog')
     },
     submitSelect() {
         if(this.objType === 1 && this.selectCarList.length === 0) {
             this.$message({
                 type: 'warning',
                 message: '请选择车辆'
             })
         }else if(this.objType === 2 && this.selectChargeList.length === 0) {
             this.$message({
                 type: 'warning',
                 message: '请选择充电设备'
             })
         }else {
             if(this.objType === 1) {
                this.$emit('submitAdd', this.selectCarList)  
             }else {
                this.$emit('submitAdd', this.selectChargeList)    
             }
            
         }
     },
    toSearchCar() {
        this.carSearchConf.pageNum = 1
        this.fetchCarList()      
    },
    resetCar() {
    this.carSearchConf = {
        pageNum: 1,
        pageSize: 10,
        orgId: null,
        carNumber: null,
        }
    },
       toSearchCharging() {
           this.chargingSearchConf.pageNum = 1
           this.fetchChargeList()
       },
     resetCharging() {
        this.chargingSearchConf = {
               pageNum: 1,
               pageSize: 10,
               chargName: null,
               assetsNum: null,
               chargGroupName: null,
           }
        },
     handleSelectCar(val) {
         this.selectCarList = val
     },
     handleSelectCharge(val) {
         this.selectChargeList = val
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
<style lang="scss">
.objDialog {
  .el-dialog__body {
    background-color: #fff;
 }
 .el-dialog__footer {
      background-color: #fff;
 }
}
</style>
<style lang="scss" scoped>
.tableBox {
    .searchBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
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
}
</style>