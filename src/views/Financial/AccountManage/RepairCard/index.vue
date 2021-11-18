<template>
  <div class="cardLoss">
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

    <div class="content">
      <div class="infoBox" v-if="accInfo">
        <div class="top">
          <div class="title">
            <!-- <div class="sign"></div> -->
            <div class="name">账户信息</div>
          </div>
        </div>
        <div class="accInfo">
          <div class="item">
            <span class="label">组织机构:</span>
            <span class="value">{{ accInfo.orgName }}</span>
          </div>
          <div class="item">
            <span class="label">账户用途:</span>
            <span class="value">{{
              accInfo.accUse === 0 ? "公有" : "私有"
            }}</span>
          </div>
          <div class="item">
            <span class="label">账户类型:</span>
            <span class="value">{{ accTypeObj[accInfo.accType] }}</span>
          </div>
          <!-- <div class="item" v-if="accInfo.accUse === 0">
            <span class="label">数量:</span>
            <span class="value">车辆 <span class="num">{{accInfo.objNumVo.pubCarNum}}</span></span>
            <span class="value">人员 <span class="num">{{accInfo.objNumVo.pubPersonNum}}</span></span>
            <span class="value">实体卡 <span class="num">{{accInfo.objNumVo.pubCardNum}}</span></span>
            <span class="value" v-if="accInfo.accType === 0"
              >总金额
              <span style="color: red;margin-left: 10px">{{accInfo.totalAmount || 0}}</span></span
            >
          </div>
          <div class="item" v-else>
            <span class="label">数量:</span>
            <span class="value"><span class="num">{{accInfo.objNumVo.priObjNum}}</span></span>
          </div> -->
        </div>

        <!-- 卡列表 -->
        <div class="table">
            <ShareItem v-if="accInfo.accType === 0" :searchInfo="searchConf" :accInfo="accInfo" :accId="accInfo.accId" ref="share" />
            <QuotaItem v-if="accInfo.accType === 2" :searchInfo="searchConf" :accInfo="accInfo" :accId="accInfo.accId" ref="quota" />
            <PrivateItem v-if="accInfo.accType === 3" :searchInfo="searchConf" :accInfo="accInfo" :accId="accInfo.accId" ref="private" />
        </div>

      </div>

    <!-- 账户未开通 -->
      <div v-else style="text-align: center;margin-top: 50px;color: #484848;">
        {{msgTip}}
      </div>
    </div>
  </div>
</template>

<script>
import ShareItem  from './components/shareItem.vue'
import QuotaItem from './components/quotaItem.vue'
import PrivateItem from './components/privateItem.vue'
import { mapGetters } from 'vuex'
import { getCurrentOrgAccountInfo } from '@/api/financial/account'
export default {
 components: {
     ShareItem, QuotaItem, PrivateItem
 },
  data() {
    return {
      orgId: null,
      groupId: null,
      cardNo: null,
      carNum: null,
      workName: '',
      afterGroupName: "",
      searchConf: {
        cardCode: "",
        carNumber: "",
        workName: "",
      },
      accTypeObj: {
        0: "共享",
        2: "配额",
        3: "私用",
      },
      accInfo: null,
      showAccount: true,
      msgTip: null,
    }
  },
  computed: {
    ...mapGetters(['deptList'])
  },
  created() {
    this.groupId = this.deptList.length > 0 ? this.deptList[0].id : null
    if(this.groupId) {     
      this.fetchAccountInfo()
    }
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
     this.accInfo = null
     const rsp = await getCurrentOrgAccountInfo({orgId: this.groupId})
     if(rsp.code === 200) {
       if(!rsp.data || JSON.stringify(rsp.data) === '{}') {
          this.showAccount = false
          this.msgTip = '此账户暂未开通'
       }else {
          this.accInfo = rsp.data
          this.$nextTick(() => {
           if(rsp.data.accType === 0) {
            this.$refs.share.fetchCards()
           }else if(rsp.data.accType === 2) {
            this.$refs.quota.fetchCards()
          }else {
            this.$refs.private.fetchCards()
          }
          })
           this.showAccount = true
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
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.cardLoss {
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
  .content {
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
        border-bottom: 1px solid #e8eef4;
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
  }
}
</style>
