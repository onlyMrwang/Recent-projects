<template>
  <div class="shareBox">
    <div class="filterBox">
    <el-radio-group v-model="radio" style="margin-left: 15px" @change="checkType">
      <el-radio-button label="车辆"></el-radio-button>
      <el-radio-button label="人员"></el-radio-button>
      <el-radio-button label="实体卡"></el-radio-button>
    </el-radio-group>
    <div class="searchBox">
       <div class="item" v-show="radio === '车辆'">
         <div class="label">车牌号</div>
         <div class="value">
           <el-input v-model="seaCarConf.carNumber" placeholder="请输入车牌号"/>
         </div>
       </div>
        <div class="item" v-show="radio === '人员'">
         <div class="label">姓名</div>
         <div class="value">
           <el-input v-model="seaPersonConf.workName" placeholder="请输入姓名"/>
         </div>
       </div>
        <div class="item" v-show="radio === '实体卡'">
         <div class="label">卡号</div>
         <div class="value">
           <el-input v-model="seaCardConf.cardCode" placeholder="请输入卡号"/>
         </div>
       </div>
       <el-button type="primary" @click="toSearch">查询</el-button>
       <el-button @click="reset">重置</el-button>
    </div>
   </div>
    <div class="shareContent">
        <div class="table" v-if="radio === '车辆'">
          <el-table :data="carList" style="width: 100%" border
          :header-cell-style="tableHeaderStyle">
          <el-table-column
            prop="objAcc"
            label="车辆帐号"
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
            :current-page="seaCarConf.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="seaCarConf.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="carTotal">
          </el-pagination>
        </div>
        </div>
         <div class="table" v-if="radio === '人员'">
          <el-table :data="personList" style="width: 100%" border
           :header-cell-style="tableHeaderStyle">
          <el-table-column
            prop="cardId"
            label="司机账号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="workName"
            label="姓名"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="staffCode"
            label="工作编号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
        <div class="pagination" v-if="personList.length > 0">
          <el-pagination
            background
            @size-change="handlePersonSizeChange"
            @current-change="handlePersonPage"
            :current-page="seaPersonConf.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="seaPersonConf.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="personTotal">
          </el-pagination>
        </div>
        </div>
        <div class="table" v-if="radio === '实体卡'">
          <el-table :data="cardList" style="width: 100%" border
           :header-cell-style="tableHeaderStyle">
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
            prop="status"
            label="状态"
            align="center"
          >
          <template slot-scope="scope">
            {{dictInfo.cardStatusObj[scope.row.status]}}
          </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="cardList.length > 0">
         <el-pagination
            background
            @size-change="handleCardSizeChange"
            @current-change="handleCardPage"
            :current-page="seaCardConf.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="seaCardConf.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="cardTotal">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAccCardList, getAccPersonList, getAccCarList } from '@/api/financial/account'
import { arrToObj } from '@/utils/utils'
import { mapGetters } from 'vuex'
export default {
  props: {
    accId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      radio: '车辆',
      // 卡状态
      carTotal: 0,
      cardTotal: 0,
      personTotal: 0,
      seaCarConf: {
          pageNo: 1,
          pageSize: 10,
          carNumber: null,
          isPage: 'yes'
      },
      seaPersonConf: {
          pageNo: 1,
          pageSize: 10,
          workName: null,
          isPage: 'yes'
      },
      seaCardConf: {
          pageNo: 1,
          pageSize: 10,
          cardCode: null,
          states: 1,
          isPage: 'yes'
      },
      carList: [],
      personList: [],
      cardList: [],
    }
  },
  computed: {
    ...mapGetters(['dictInfo'])
  },
  created() {
    if(this.accId) {
      this.fetchCarList()
    }
  },
  methods: {
     async fetchCarList() {
      this.seaCarConf.accId = this.accId
      const rsp = await getAccCarList(this.seaCarConf)
      if(rsp.code === 200) {
        this.carList = rsp.data.list
        this.carTotal = rsp.data.total
      }
    },
     async fetchPersonList() {
      this.seaPersonConf.accId = this.accId
      const rsp = await getAccPersonList(this.seaPersonConf)
      if(rsp.code === 200) {
        this.personList = rsp.data.list
        this.personTotal = rsp.data.total
      }
    },
    async fetchCardList() {
      this.seaCardConf.accId = this.accId
      const rsp = await getAccCardList(this.seaCardConf)
      if(rsp.code === 200) {
        this.cardList = rsp.data.list
        this.cardTotal = rsp.data.total
      }
    },
    toSearch() {
        if(this.radio === '车辆') {
           this.seaCarConf.pageNo = 1
           this.fetchCarList()
        }else if(this.radio === '人员') {
           this.seaPersonConf.pageNo = 1
           this.fetchPersonList()
        }else {
           this.seaCardConf.pageNo = 1
           this.fetchCardList()
        }
    },
    reset() {
      this.seaCarConf.carNumber = null
      this.seaPersonConf.workName = null
      this.seaCardConf.cardCode = null
    },
    checkType(val) {
      if(val === '车辆') {
        this.seaCarConf.pageNo = 1
        this.seaPersonConf.workName = null
        this.seaCardConf.cardCode = null
        this.fetchCarList()
      }else if(val === '人员'){
        this.seaPersonConf.pageNo = 1
        this.seaCarConf.carNumber = null
        this.seaCardConf.cardCode = null
        this.fetchPersonList()
      }else {
        this.seaCardConf.pageNo = 1
        this.seaPersonConf.workName = null
        this.seaCarConf.carNumber = null
        this.fetchCardList()
      }
    },
    handleCarPage(page) {
      this.seaCarConf.pageNo = page
      this.fetchCarList()
    },
    handleCarSizeChange(pageSize) {
      this.seaCarConf.pageSize = pageSize;
      this.seaCarConf.pageNo = 1
      this.fetchCarList()
    },
    handlePersonPage(page) {
      this.seaPersonConf.pageNo = page
      this.fetchPersonList()
    },
    handlePersonSizeChange(pageSize) {
      this.seaPersonConf.pageSize = pageSize;
      this.seaPersonConf.pageNo = 1
      this.fetchPersonList()
    },
    handleCardPage(page) {
      this.seaCardConf.pageNo = page
      this.fetchCardList()
    },
     handleCardSizeChange(pageSize) {
      this.seaCardConf.pageSize = pageSize;
      this.seaCardConf.pageNo = 1
      this.fetchCardList()
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
@import '@/assets/styles/global.scss';
.el-radio-button__orig-radio:checked+.el-radio-button__inner {
    color: #FFF;
    background-color: $btnMainColor;
    border-color: $btnMainColor;
    box-shadow: -1px 0 0 0 $btnMainColor;
}
.el-radio-button__inner:hover {
    color:  $btnMainColor;
}
</style>
<style lang="scss" scoped>
.shareBox {
  .shareContent {
      padding: 15px;
      .pagination {
        margin: 10px 0;
        display: flex;
        justify-content: flex-end;
      }
  }
  .filterBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 20px;
    .searchBox {
      display: flex;
      align-items: center;
      .item {
         display: flex;
         align-items: center;
         margin-right: 30px;
        .label {
          width: 60px;
          font-size: 14px;
          color: #666;
        }
      }
      
    }
  }
}
</style>