<template>
  <div class="accSetting">
    <el-form size="small" label-width="80px" style="background-color: #fff;padding: 20px 30px 0 30px">
        <el-row :gutter="5">
           <el-col :span="6">
            <el-form-item label-width="100px" label="所属组织机构">
              <treeselect
              :options="deptList"
              v-model="groupId"
              :default-expand-level="2"
              placeholder="请选择所属组织机构"
              :normalizer="normalizer"
              :clearable="false"
             />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="卡号">
              <el-input v-model="searchConf.cardCode" placeholder="请输入卡号" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input v-model="searchConf.workName" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车牌号">
              <el-input v-model="searchConf.carNumber" placeholder="请输入车牌号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="24" style="text-align: right">
            <el-form-item label="">
                <el-button type="primary" @click="toSearch">查询</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
    </el-form>

    <div class="accSettingContent">
     <div v-if="showAccount && showContent">
      <div class="infoBox">
        <div class="top">
          <div class="title">
            <div class="name">账户信息</div>
          </div>
        </div>

        <div class="accInfo">
            <div class="item">
                <span class="label">组织机构:</span>
                <span class="value">{{accountInfo.orgName}}</span>
            </div>
            <div class="item">
                <span class="label">账户用途:</span>
                <span class="value">{{accountInfo.accUse === 0 ? '公有' : '私有'}}</span>
            </div>
            <div class="item">
                <span class="label">账户类型:</span>
                <span class="value">{{accTypeObj[accountInfo.accType]}}</span>
            </div>
             <div class="item" v-if="accountInfo.accUse === 0">
                <!-- <span class="label">数量:</span>
                <span class="value">车辆 <span class="num" @click="changeActiveTab(type = 'car')">{{accountInfo.objNumVo.pubCarNum}}</span></span>
                <span class="value">人员 <span class="num" @click="changeActiveTab(type = 'person')">{{accountInfo.objNumVo.pubPersonNum}}</span></span>
                <span class="value">实体卡 <span class="num" @click="changeActiveTab(type = 'card')">{{accountInfo.objNumVo.pubCardNum}}</span></span> -->
                <span class="value" v-if="accountInfo.accType === 0">总金额(元) <span style="color: red;margin-left: 10px">{{Number(accountInfo.totalAmount) !== 0 ? (accountInfo.totalAmount).toFixed(6) : 0}}</span></span>
            </div>
            <!-- <div class="item" v-else>
                  <span class="label">数量:</span>
                  <span class="value"><span class="num">{{accountInfo.objNumVo.priObjNum}}</span></span>
            </div> -->
        </div>
      </div> 
       <!-- 充电对象 -->
        <div class="accContent">
            <!-- 共享 -->
            <ShareItem v-if="accountInfo.accType === 0" :searchConf="searchConf" @fetchAccInfo="refreshAccountInfo" :accId="accountInfo.accId" 
            :activeTab="accRechargeTab" :totalMoney="accountInfo.totalAmount" :orgId="groupId" :accInfo="accountInfo" ref="shareItem"/>
            <!-- 配额 -->
            <QuotalItem v-if="accountInfo.accType === 2" :searchConf="searchConf"  @fetchAccInfo="fetchAccountInfo"
             :accId="accountInfo.accId" :activeTab="accRechargeTab" :orgId="groupId" :accInfo="accountInfo" ref="quotaItem"/>
            <!-- 私有 -->
            <PrivateItem v-if="accountInfo.accType === 3" :searchPrivateConf="searchConf" :accId="accountInfo.accId" @fetchAccInfo="fetchAccountInfo"
            :orgId="groupId" :accInfo="accountInfo" ref="privateItem"/>
        </div>
      </div>

      <div class="noAccount" v-if="!showAccount && showContent">
        <div class="toOpen">{{msgTip}}</div> 
      </div>
    </div>
  </div>
</template>

<script>
import ShareItem from './components/shareItem.vue'
import QuotalItem from './components/quotaItem.vue'
import PrivateItem from './components/privateItem.vue'
import { mapGetters } from 'vuex'
import { getCurrentOrgAccountInfo } from '@/api/financial/account'
export default {
  components: {
      ShareItem, QuotalItem, PrivateItem
  },
  data() {
    return {
      showContent: false, // 是否显示内容区域
      showAccount: true, // 是否开通账户
      orgId: null,
      groupId: null, 
      searchConf: {
        cardCode: "",
        carNumber: "",
        workName: "",
      },
      accTypeObj: {
          0: '共享',
          2: '配额',
          3: '私用'
      },
      accountInfo: null,
      sortValueBy: "ORDER_SELECTED",
      originAccUse: null, // 原始账户用途
      originAccType: null, // 原始账户类型
      msgTip: null,
    };
  },
  computed: {
    ...mapGetters(['deptList', 'userInfo', 'accRechargeTab'])
  },
  created() {
    this.groupId = this.deptList.length > 0 ? this.deptList[0].id : null
    if(this.groupId) {
      this.fetchAccountInfo()
    }
  },
  beforeDestroy() {
    this.$store.commit('account/changeAccRechargeTab', 'car')
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
    async fetchAccountInfo() {
     const rsp = await getCurrentOrgAccountInfo({orgId: this.groupId})
     this.accountInfo = null
     this.showContent = false
     if(rsp.code === 200) {
        this.showContent = true
       if(!rsp.data) {
          this.showContent = true
          this.showAccount = false
          this.msgTip = '此账户暂未开通'
       }else {
          this.accountInfo = rsp.data
          this.originAccUse = rsp.data.accUse
          this.originAccType = rsp.data.accType
          this.showContent = true
          this.showAccount = true
          this.msgTip = null
          this.$nextTick(() => {
          if(rsp.data.accType === 0) {
            if(this.accRechargeTab === 'car') {
              this.$refs.shareItem.fetchCars()
            }else if(this.accRechargeTab === 'person') {
              this.$refs.shareItem.fetchPersons()
            }else {
              this.$refs.shareItem.fetchCards()
            }
          }else if(rsp.data.accType === 2) {
             if(this.accRechargeTab === 'car') {
              this.$refs.quotaItem.fetchCars()
            }else if(this.accRechargeTab === 'person') {
              this.$refs.quotaItem.fetchPersons()
            }else {
               this.$refs.quotaItem.fetchCards()
            }
          }else if(rsp.data.accType === 3) {
            this.$refs.privateItem.fetchPrivateInfo()
          }
        })
       }
     }
    },
    async refreshAccountInfo() {
     this.searchConf.orgId = this.groupId
     const rsp = await getCurrentOrgAccountInfo({orgId: this.groupId})
     if(rsp.code === 200) {
       if(rsp.data) {
          this.accountInfo = rsp.data
          this.originAccUse = rsp.data.accUse
          this.originAccType = rsp.data.accType
          this.msgTip = null
       }
     }
    },
    toSearch() {
      // const id = this.deptList.length > 0 ? this.deptList[0].id : null
      // this.groupId = this.orgId || id
      this.fetchAccountInfo()
    },
    reset() {
      // this.groupId = null
      // this.orgId = null
      this.searchConf = {
        cardCode: "",
        carNumber: "",
        workName: "",
      }
    },
    changeActiveTab(type) {
        this.$store.commit('account/changeAccRechargeTab', type)
    },
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/global.scss";
.searchAccSetting .el-input__inner {
  width: 178px !important;
}
.inputItem .vue-treeselect__control {
  border-radius: 2px;
}
.inputItem .vue-treeselect {
  font-size: 13px;
}
.inputItem .vue-treeselect__single-value {
  font-size: 13px;
}
.inputItem .vue-treeselect__placeholder {
  color: #c5c2c2;
}
.inputItem .vue-treeselect__x-container:hover {
  color: $topMenuActiveColor;
}
.editItem .el-input__inner {
    width: 100px;
    height: 30px !important;
}
.editItem .el-select .el-input .el-select__caret {
    margin-top: 5px;
}
</style>
<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.accSetting {
  .searchAccSetting {
    background-color: #fff;
    height: 55px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 35px 0 30px;
    .inputBox {
      display: flex;
      align-items: center;
      .inputItem {
        display: flex;
        align-items: center;
        margin-right: 38px;
        .label {
          color: $mainTextColor;
          font-size: $fontSize14;
          margin-right: 12px;
        }
      }
    }
  }
  .accSettingContent {
    background-color: #fff;
    border-radius: 4px;
    min-height: calc(100vh - 150px);
    margin: 10px 0;
    overflow: auto;
    .infoBox {
      padding: 15px;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 5px;
        border-bottom: 1px solid #E8EEF4;
        .title {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          .sign {
            width: 7px;
            height: 20px;
            background: $btnMainColor;
            margin-right: 8px;
          }
          .name {
      
          font-size: $fontSize16;
          color: $mainTitleColor;
          font-weight: 400;
        }
        }
        .options {
          margin: -10px 20px 0 0;
        }
      }
      .accEdit {
          display: flex;
          align-items: center;
             padding: 18px 10px;
           .editItem {
              margin-right: 20px;
               display: flex;
              align-items: center;
              .label {
                  margin-right: 15px;
                  color: #999;
                  font-size: 13px;
              }
              .value {
                  color: #666;
                  font-size: 13px;
                  margin-right: 10px;
              }
          }
      }
      .accInfo {
          display: flex;
          align-items: center;
          padding: 18px 10px;
          .item {
              margin-right: 20px;
              .label {
                  margin-right: 15px;
                  color: #999;
                  font-size: 13px;
              }
              .value {
                  color: #666;
                  font-size: 13px;
                  margin-right: 10px;
                  .num {
                      color: $btnMainColor;
                      margin-left: 5px;
                      cursor: pointer;
                  }
              }
          }
      }
    }

    .accContent {
        padding: 0 15px 15px 15px;
    }
  }

  .noAccount {
      .toOpen {
          text-align: center;
          font-size: 13px;
          color: #666;
          margin-top: 50px;
      }
       .accEdit {
          display: flex;
          align-items: center;
             padding: 18px 10px;
           .editItem {
              margin-right: 20px;
               display: flex;
              align-items: center;
              .label {
                  margin-right: 15px;
                  color: #999;
                  font-size: 13px;
              }
              .value {
                  color: #666;
                  font-size: 13px;
                  margin-right: 10px;
              }
          }
      }
  }
}
</style>
