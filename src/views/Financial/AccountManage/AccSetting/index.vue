<template>
  <div class="accSetting">
     <el-form size="small" label-width="80px" style="background-color: #fff;padding: 20px 30px 0 30px">
        <el-row :gutter="5">
           <el-col :span="6">
            <el-form-item label-width="100px" label="所属组织机构">
              <treeselect
              :options="deptList"
              v-model="orgId"
              :default-expand-level="2"
              placeholder="请选择所属组织机构"
              :normalizer="normalizer"
              :clearable="false"
              @select="selectOrg"
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
            <!-- <div class="sign"></div> -->
            <div class="name">账户信息</div>
          </div>
          <div class="options">
            <el-button
              v-if="!showEdit"
              type="primary"
              icon="el-icon-edit"
              @click="editAccInfo"
              >编辑</el-button
            >
            <div v-else>
            <el-button
              type="primary"
              @click="saveAccInfo"
              >保存</el-button
            >
             <el-button
              plain
              @click="cancelSave"
              >取消</el-button
            >
            </div>
            
          </div>
        </div>

        <div class="accEdit" v-if="showEdit">
            <div class="editItem">
                <div class="label">组织机构:</div>
                <div class="value">{{accountInfo.orgName}}</div>
            </div>
             <div class="editItem">
                <div class="label">账户用途:</div>
                <div class="value">
                    <el-select v-model="accountInfo.accUse" placeholder="请选择账户用途" @change="changeAccUse">
                        <el-option label="公有" :value="0"></el-option>
                        <el-option label="私用" :value="1"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="editItem">
               <div class="label">账户类型:</div>
               <div class="value" v-if="accountInfo.accUse === 1">
                     <el-select v-model="accountInfo.accType" disabled placeholder="请选择账户类型">
                        <el-option label="私有" :value="3"></el-option>
                    </el-select>
                </div>
                <div class="value" v-else>
                     <el-select v-model="accountInfo.accType" placeholder="请选择账户类型">
                        <el-option label="共享" :value="0"></el-option>
                        <el-option label="配额" :value="2"></el-option>
                    </el-select>
                </div>
            </div>
        </div>

        <div class="accInfo" v-else>
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
                <span class="label">数量:</span>
                <span class="value">车辆 <span class="num" @click="changeActiveTab(type = 'car')">{{accountInfo.objNumVo.pubCarNum}}</span></span>
                <span class="value">人员 <span class="num" @click="changeActiveTab(type = 'person')">{{accountInfo.objNumVo.pubPersonNum}}</span></span>
                <span class="value">实体卡 <span class="num" @click="changeActiveTab(type = 'card')">{{accountInfo.objNumVo.pubCardNum}}</span></span>
                <span class="value" v-if="accountInfo.accType === 0">总金额(元) <span style="color: red;margin-left: 10px">{{Number(accountInfo.totalAmount) !== 0 ? accountInfo.totalAmount.toFixed(6) : 0}}</span></span>
            </div>
            <div class="item" v-else>
                  <span class="label">数量:</span>
                  <span class="value"><span class="num">{{accountInfo.objNumVo.priObjNum}}</span></span>
            </div>
        </div>
      </div> 
       <!-- 充电对象 -->
        <div class="accContent" v-if="!showEdit && accountInfo">
            <!-- 共享 -->
            <ShareItem v-if="accountInfo.accType === 0" :searchConf="searchConf" @fetchAccInfo="fetchAccountInfo" 
            :accId="accountInfo.accId" :activeTab="accSettingTab" :orgId="accountInfo.orgId" ref="shareItem"/>
            <!-- 配额 -->
            <QuotalItem v-if="accountInfo.accType === 2" :searchConf="searchConf"  @fetchAccInfo="fetchAccountInfo"
             :accId="accountInfo.accId" :activeTab="accSettingTab" :orgId="accountInfo.orgId" ref="quotaItem"/>
            <!-- 私有 -->
            <PrivateItem v-if="accountInfo.accType === 3" :searchInfo="searchConf" :accId="accountInfo.accId"
             @fetchAccInfo="fetchAccountInfo" :orgId="accountInfo.orgId" ref="privateItem"/>
        </div>
      </div>

      <div class="noAccount" v-if="!showAccount && showContent">
        <OpenItem v-if="showOpen"
         :groupId="orgId" :groupName="orgName"
          @closeOpenBox="showOpen = false" 
          @sucOpenAccount="sucOpenAccount" 
        />
        <div class="toOpen" v-else>此账户暂未开通,点击
            <span style="color: #5dbcdb;cursor: pointer;margin-left: 3px" @click="showOpen = true">开通</span>
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
import ShareItem from './components/shareItem.vue'
import QuotalItem from './components/quotaItem.vue'
import PrivateItem from './components/privateItem.vue'
import OpenItem from './components/openAccount.vue' 
import { mapGetters } from 'vuex'
import { getCurrentOrgAccountInfo, editAccount } from '@/api/financial/account'
export default {
  components: {
      ShareItem, QuotalItem, PrivateItem, OpenItem
  },
  data() {
    return {
      orgId: null, // 组织机构id
      orgName: null, // 组织机构名称
      groupId: null, // 组织机构id
      showContent: false, // 是否显示内容区域
      showAccount: true, // 是否开通账户
      showOpen: false, // 展示开通
      searchConf: {
        cardCode: "",
        carNumber: "",
        workName: "",
      },
      showEdit: false, 
      accTypeObj: {
          0: '共享',
          2: '配额',
          3: '私用'
      },
      accountInfo: null,
      activeTab: null,
      sortValueBy: "ORDER_SELECTED",
      originAccUse: null, // 原始账户用途
      originAccType: null, // 原始账户类型
    };
  },
  computed: {
    ...mapGetters(['deptList', 'userInfo', 'accSettingTab'])
  },
  created() {
    this.groupId = this.deptList.length > 0 ? this.deptList[0].id : null
    this.orgName = this.deptList.length > 0 ? this.deptList[0].nameCN : null
    this.orgId = this.deptList.length > 0 ? this.deptList[0].id : null
    if(this.groupId) {     
      this.firstFetchAccountInfo()
    }
  },
  beforeDestroy() {
    this.$store.commit('account/changeAccSettingTab', 'car')
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
    async firstFetchAccountInfo() {
     const rsp = await getCurrentOrgAccountInfo({orgId: this.groupId})
     this.accountInfo = null
     this.showContent = false
     if(rsp.code === 200) { 
       if(!rsp.data || JSON.stringify(rsp.data) === '{}') {
          this.showContent = true
          this.showAccount = false
       }else {
          this.accountInfo = rsp.data
          this.originAccUse = rsp.data.accUse
          this.originAccType = rsp.data.accType
          this.showContent = true
          this.showAccount = true 
          this.$nextTick(() => {
          if(rsp.data.accType === 0) {
            if(this.accSettingTab === 'car') {
              this.$refs.shareItem.fetchCars()
            }else if(this.accSettingTab === 'person') {
              this.$refs.shareItem.fetchPersons()
            }else {
               this.$refs.shareItem.fetchCards()
            }
          }else if(rsp.data.accType === 2) {
             if(this.accSettingTab === 'car') {
              this.$refs.quotaItem.fetchCars()
            }else if(this.accSettingTab === 'person') {
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
   async fetchAccountInfo() {
     const rsp = await getCurrentOrgAccountInfo({orgId: this.groupId})
     if(rsp.code === 200) { 
       if(!rsp.data || JSON.stringify(rsp.data) === '{}') {
          this.showContent = true
          this.showAccount = false
       }else {
          this.accountInfo = rsp.data
          this.originAccUse = rsp.data.accUse
          this.originAccType = rsp.data.accType
       }
     }
    },
    toSearch() {
      const id = this.deptList.length > 0 ? this.deptList[0].id : null
      this.groupId = this.orgId || id
      this.firstFetchAccountInfo()
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
    changeAccUse(value) {
       this.accountInfo.accUse = value
       if(value === 1) {
           this.accountInfo.accType = 3
       }else {
           this.accountInfo.accType = 0
       }
    },
    selectOrg(val) {
      this.orgName = val.nameCN
    },
    editAccInfo() {
        this.showEdit = true
    },
    saveAccInfo() {
        if(this.originAccUse !== this.accountInfo.accUse || this.originAccType !== this.accountInfo.accType) {
           this.$confirm('此操作将会删除账号下的充电对象, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
            }).then(() => {
            this.submitSaveAccInfo()
          })
        } else {
            this.fetchAccountInfo()
            this.showEdit = false
        }
    },
    cancelSave(){
      this.fetchAccountInfo()
      this.showEdit = false
    },
    async submitSaveAccInfo() {
       const data = {
         accId: this.accountInfo.accId,
         orgId: this.accountInfo.orgId,
         accType: this.accountInfo.accType,
         accUse: this.accountInfo.accUse,
       }
        const rsp = await editAccount(data)
        if(rsp.code === 200) {
            this.$message({
                type: 'success',
                message: '保存成功'
            }) 
          this.fetchAccountInfo() 
          this.showEdit = false
        }
    },
    changeActiveTab(type) {
        this.$store.commit('account/changeAccSettingTab', type)
    },
    // 账户开通成功 todo
    sucOpenAccount() {
       this.firstFetchAccountInfo()
       this.showOpen = false
    }
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
  border: 1px solid #999;
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
          margin: -10px 10px 0 0;
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
