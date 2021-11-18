<template>
  <div class="shareBox">
   
    <div class="tabs">
      <div class="tabList">
        <div
          v-for="item in tabList"
          :key="item.id"
          :class="
            item.value === accRechargeTab
              ? 'activeItem'
              : 'item'
          "
          @click="handleClick(item)"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="line"></div>
    </div>
    <div class="tables">
      <!-- 车辆 -->
      <div v-if="accRechargeTab === 'car'" class="carTable">
        <div style="margin-bottom: 10px">
         <el-button type="primary" @click="mulitRecharge('car')">批量充值</el-button>
        </div>
        <el-table ref="carTable" :data="carList" style="width: 100%"
         :header-cell-style="tableHeaderStyle" border
         @selection-change="handleCar">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="cardId"
            label="车辆账号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="carNumber"
            label="车牌号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="carVin"
            label="车辆vin码"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="carModel"
            label="车辆型号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="carType"
            label="能源类型"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ dictInfo.carTypeObj[scope.row.carType] }}
            </template>
          </el-table-column>
           <el-table-column
            prop="cardMoney"
            label="当前金额(元)"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{scope.row.cardMoney.toFixed(6)}}
          </template>
          </el-table-column>
          <el-table-column
            prop="x"
            label="操作"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-link type="primary" slot="reference" :underline="false" @click="toReCharge(scope.row)">充值</el-link>
            </template>
          </el-table-column>
        </el-table>
         <div class="pagination" v-if="carTotal > 0">
          <el-pagination
            background
            @size-change="handleCarSizeChange"
            @current-change="handleCarCurrentChange"
            :current-page="seaCarConf.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="seaCarConf.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="carTotal">
          </el-pagination>
        </div>
      </div>
      <!-- 人员 -->
      <div v-if="accRechargeTab === 'person'" class="personTable">
         <div style="margin-bottom: 10px">
          <el-button type="primary" @click="mulitRecharge('person')">批量充值</el-button>
        </div>
        <el-table ref="personTable" :data="personList" style="width: 100%"
         :header-cell-style="tableHeaderStyle" border
         @selection-change="handlePerson">
           <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="cardId"
            label="司机账号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="workName"
            label="用户名"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="staffCode"
            label="工作编号"
            align="center"
            show-overflow-tooltip
          >
          <template slot-scope="scope"> 
            {{scope.row.staffCode || scope.row.workersId}}
          </template>
          </el-table-column>
          <el-table-column
            prop="cardMoney"
            label="当前金额(元)"
            align="center"
            show-overflow-tooltip
          >
          <template slot-scope="scope">
              {{scope.row.cardMoney ? scope.row.cardMoney.toFixed(6) : 0}}
          </template>
          </el-table-column>
           <el-table-column
            prop="x"
            label="操作"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-link type="primary" slot="reference" :underline="false" @click="toReCharge(scope.row)">充值</el-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="personTotal > 0">
          <el-pagination
            background
            @size-change="handlePersonSizeChange"
            @current-change="handlePersonCurrentChange"
            :current-page="seaPersonConf.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="seaPersonConf.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="personTotal">
          </el-pagination>
        </div>
      </div>
      <!-- 实体卡 -->
      <div v-if="accRechargeTab === 'card'" class="cardTable">
       <div style="margin-bottom: 10px">
         <el-button type="primary" @click="mulitRecharge('card')">批量充值</el-button>
        </div>
        <el-table ref="cardTable" :data="cardList" style="width: 100%"
         :header-cell-style="tableHeaderStyle" border
         @selection-change="handleCard">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="cardCode"
            label="卡号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="carNumber"
            label="车牌号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
           <el-table-column
            prop="currentMoney"
            label="当前余额(元)"
            align="center"
            show-overflow-tooltip
          >
          <template slot-scope="scope">
              {{scope.row.cardMoney ? scope.row.cardMoney.toFixed(6) : 0}}
          </template>
          </el-table-column>
          <el-table-column
            prop="x"
            label="操作"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
            <el-link type="primary" slot="reference" :underline="false" @click="toReCharge(scope.row)">充值</el-link>
            </template>
          </el-table-column>
        </el-table>
         <div class="pagination" v-if="cardTotal > 0">
          <el-pagination
            background
            @size-change="handleCardSizeChange"
            @current-change="handleCardCurrentChange"
            :current-page="seaCardConf.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="seaCardConf.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="cardTotal">
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 充值弹窗 -->
    <div v-if="showRecharge">
      <el-dialog
        v-dialogDrag
        :title="dialogTitle"
        :visible.sync="showRecharge"
        width="30%"
        :destroy-on-close="true"
        :close-on-click-modal="false"
        :before-close="closeDialog">
          <div class="addBox">
            <div class="addItem">
              <div class="label">充值金额</div>
              <div class="value">
                <el-input-number :controls="false" v-model.trim="reChargeNum" placeholder="请输入充值金额"/>
              </div>
            </div>
          </div>
          <span slot="footer">
          <el-button type="primary" @click="submitRecharge" :loading="showLoading">确 定</el-button>
          <el-button type="primary" plain @click="closeDialog">取消</el-button>
        </span>
        </el-dialog>
      </div>


  </div>
</template>

<script>
import { getAccCardList, getAccPersonList, getAccCarList, reChargeMoney } from '@/api/financial/account'
import { mapGetters } from "vuex";
export default {
  props: {
    accId: {
      type: String,
      default: null
    },
    orgId: {
      type: String,
      default: null
    },
    accInfo: {
      type: Object,
      default: function() {
        return null
      }
    },
     searchConf: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      showRecharge: false,
      showLoading: false,
      seaCarConf: {
          pageNo: 1,
          pageSize: 10,
          isPage: 'yes'
      },
      seaPersonConf: {
          pageNo: 1,
          pageSize: 10,
          isPage: 'yes'
      },
      seaCardConf: {
          pageNo: 1,
          pageSize: 10,
          states: 1,
          isPage: 'yes'
      },
      tabList: [
        { id: 1, name: "车辆", value: "car" },
        { id: 2, name: "人员", value: "person" },
        { id: 3, name: "实体卡", value: "card" },
      ],
      carList: [],
      personList: [],
      cardList: [],
      carTotal: 0,
      personTotal: 0,
      cardTotal: 0,
      mulitCar: [],
      mulitPerson: [],
      mulitCard: [],
      dialogTitle: '充值',
      reChargeNum: undefined, // 充值金额
      rechargeObj: null, // 单个充值对象
      rechareType: 'car', // 批量充值对象， 人-车-卡
    }
  },
  computed: {
    ...mapGetters(['accRechargeTab', 'dictInfo'])
  },
  created() {
    if(this.accId) {
       if(this.accRechargeTab === 'car') {
        this.fetchCars()
       }else if(this.accRechargeTab === 'person') {
        this.fetchPersons()
       }else {
        this.fetchCards()
       }
    }
  },
  beforeDestroy() {
    this.$store.commit('account/changeAccRechargeTab', 'car')
  },
  methods: {
    async fetchCars() {
      this.seaCarConf.accId = this.accId
      this.seaCarConf = Object.assign(this.seaCarConf, this.searchConf)
      const rsp = await getAccCarList(this.seaCarConf)
      if(rsp.code === 200) {
        this.carList = rsp.data.list
        this.carTotal = rsp.data.total
      }
    },
    async fetchPersons() {
      this.seaPersonConf.accId = this.accId
      this.seaPersonConf = Object.assign(this.seaPersonConf, this.searchConf)
      const rsp = await getAccPersonList(this.seaPersonConf)
      if(rsp.code === 200) {
        this.personList = rsp.data.list
        this.personTotal = rsp.data.total
      }
    },
    async fetchCards() {
      this.seaCardConf.accId = this.accId
      this.seaCardConf = Object.assign(this.seaCardConf, this.searchConf)
      const rsp = await getAccCardList(this.seaCardConf)
      if(rsp.code === 200) {
        this.cardList = rsp.data.list
        this.cardTotal = rsp.data.total
      }
    },
    handleClick(item) {
     this.$store.commit("account/changeAccRechargeTab", item.value);
     this.rechareType = item.value
      if(item.value === 'car') {
        this.fetchCars()
      }else if(item.value === 'card') {
        this.fetchCards()
      }else {
        this.fetchPersons()
      }
    },
      handleCarCurrentChange(page) {
      this.seaCarConf.pageNo = page
      this.fetchCars()
    },
    handleCarSizeChange(pageSize) {
      this.seaCarConf.pageNo = 1
      this.seaCarConf.pageSize = pageSize
      this.fetchCars()
    },
    handlePersonCurrentChange(page) {
      this.seaPersonConf.pageNo = page
      this.fetchPersons()
    },
    handlePersonSizeChange(pageSize) {
      this.seaPersonConf.pageNo = 1
      this.seaPersonConf.pageSize = pageSize
      this.fetchPersons()
    },
    handleCardCurrentChange(page) {
      this.seaCardConf.pageNo = page
      this.fetchCards()
    },
    handleCardSizeChange(pageSize) {
      this.seaCardConf.pageNo = 1
      this.seaCardConf.pageSize = pageSize
      this.fetchCards()
    },
    handleCar(val) {
      this.mulitCar = val
    },
    handlePerson(val) {
      this.mulitPerson = val
    },
    handleCard(val) {
      this.mulitCard = val
    },
     mulitRecharge(type) {
      if(type === 'car' && this.mulitCar.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择充值对象'
        })
      }else if(type === 'person' && this.mulitPerson.length === 0) {
         this.$message({
          type: 'warning',
          message: '请选择充值对象'
        })
      }else if(type === 'card' && this.mulitCard.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择充值对象'
        })
      }else {
        this.dialogTitle = '批量充值'
        this.showRecharge = true
      }
    },

   toReCharge(row) {
      this.dialogTitle = '充值'
      this.rechargeObj = row
      this.showRecharge = true
    },
    closeDialog() {
      this.showRecharge = false
      this.reChargeNum = undefined
      this.rechargeObj = null
      this.dialogTitle = '充值'
    },
    // 充值提交
    async submitRecharge() {
       if(!this.reChargeNum) {
        this.$message({
          type: 'warning',
          message: '请输入充值金额'
        })
      }else if(this.reChargeNum >= 10000000){
         this.$message({
          type: 'warning',
          message: '充值金额不能大于9999999'
        })
      }else if(this.reChargeNum <= -10000000) {
         this.$message({
          type: 'warning',
          message: '充值金额不能小于-9999999'
        })
      }else {
      let data = []
      if(this.dialogTitle === '批量充值') {
          if(this.rechareType === 'car') {
            this.mulitCar.forEach(item => {
              data.push({
                 accType: 2,
                 orgId: this.orgId,
                 objId: item.objAcc,
                 cardType: 0,
                 orgName: this.accInfo.orgName,
                 arriveMoney: this.reChargeNum,
                 arriveBefore: item.cardMoney,
                 usingCardId: item.usingCardId
              })
            })
          }else if(this.rechareType === 'person') {
            this.mulitPerson.forEach(item => {
              data.push({
                 accType: 2,
                 cardId: item.cardId,
                 orgId: this.orgId,
                 objId: item.workersId,
                 cardType: 1,
                 orgName: this.accInfo.orgName,
                 arriveMoney: this.reChargeNum,
                 arriveBefore: item.cardMoney,
                 usingCardId: item.usingCardId
              })
            }) 
          }else {
             this.mulitCard.forEach(item => {
              data.push({
                 accType: 2,
                 cardId: item.cardId,
                 orgId: this.orgId,
                 objId: item.cardCode,
                 cardType: 3,
                 orgName: this.accInfo.orgName,
                 arriveMoney: this.reChargeNum,
                 arriveBefore: item.cardMoney,
                 usingCardId: item.usingCardId
              })
            })
          }
      }else {
        if(this.rechareType === 'car') {
           data = [
          {
            accType: 2,
            cardId: this.rechargeObj.cardId,
            orgId: this.orgId,
            objId: this.rechargeObj.objAcc,
            cardType: 0,
            orgName: this.accInfo.orgName,
            arriveMoney: this.reChargeNum,
            arriveBefore: this.rechargeObj.cardMoney,
            usingCardId: this.rechargeObj.usingCardId
          }
        ]
        }else if(this.rechareType === 'person') {
         data = [
          {
          accType: 2,
          cardId: this.rechargeObj.cardId,
          orgId: this.orgId,
          objId: this.rechargeObj.workersId,
          cardType: 1,
          orgName: this.accInfo.orgName,
          arriveMoney: this.reChargeNum,
          arriveBefore: this.rechargeObj.cardMoney,
          usingCardId: this.rechargeObj.usingCardId
          }
        ]
        }else {
          data = [
          {
            accType: 2,
            cardId: this.rechargeObj.cardId,
            orgId: this.orgId,
            objId: this.rechargeObj.cardCode,
            cardType: 3,
            orgName: this.accInfo.orgName,
            arriveMoney: this.reChargeNum,
            arriveBefore: this.rechargeObj.cardMoney,
            usingCardId: this.rechargeObj.usingCardId
          }
        ]
       }
      }
      this.showLoading = true
      const rsp = await reChargeMoney(data)
      if(rsp.code === 200) {
        this.$message({
          type: 'success',
          message: '充值成功'
        })
        if(this.accRechargeTab === 'car') {
            this.fetchCars()
        }else if(this.accRechargeTab === 'person') {
           this.fetchPersons()
        }else {
           this.fetchCards()
        }
        this.closeDialog()
      }
       this.showLoading = false
      }
    }
  }
}
</script>
<style lang="scss">
.el-input-number.is-without-controls .el-input__inner {
    padding-left: 15px;
    padding-right: 15px;
    text-align: left;
}
</style>
<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.shareBox {
  position: relative;
  margin-top: 30px;
  .add {
    position: absolute;
    right: 10px;
    top: -40px;
  }
  .tabs {
    display: flex;
    .tabList {
      display: flex;
      align-items: center;
      margin: -40px 0 10px 10px;
      .item {
        padding: 10px 30px;
        font-size: 14px;
        color: #666666;
        cursor: pointer;
        border-bottom: 1px solid $tableBorderColor;
      }
      .activeItem {
        padding: 10px 30px;
        font-size: 14px;
        cursor: pointer;
        color: $btnMainColor;
        border-bottom: 2px solid $btnMainColor;
      }
    }
    .line {
      height: 0.5px;
      flex: 1;
      margin-right: 10px;
      background-color: $tableBorderColor;
      margin-top: 0.5px;
    }
  }
  .tables {
    padding: 0 10px;
    .pagination {
      margin: 10px 0;
      display: flex;
      justify-content: flex-end;
    }
  }
  .settingAddBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    .addItem {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      .label {
        color: #666;
        margin-right: 10px;
        // &::before {
        //   content: '*';
        //   color: red;
        // }
      }
      .value {
          flex: 1;
          .cardDuan {
            display: flex;
            align-items: center;
            .gap {
                margin: 0 15px;
            }
          }
      }
    }
  }
    .addBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    .addItem {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      .label {
        color: #666;
        margin-right: 10px;
      }
    }
  }
}
</style>
