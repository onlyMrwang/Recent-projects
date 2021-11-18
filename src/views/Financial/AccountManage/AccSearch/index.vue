<template>
  <div class="accSearch">
    <div v-if="!showDetail">
    <!-- 搜索 -->
    <div class="searchAccSearch">
      <div class="inputBox">
        <div class="inputItem">
          <div class="label">所属组织机构</div>
          <div class="value">
            <treeselect
              :options="deptList"
              v-model="searchConf.orgId"
              :default-expand-level="1"
              placeholder="请选择组织机构"
              :normalizer="normalizer"
            />
          </div>
        </div>
        <div class="inputItem">
          <div class="label">账户用途</div>
          <div class="value">
            <el-select v-model="searchConf.accUse" placeholder="请选择账户用途" :clearable="true">
              <el-option label="公用" :value="0"></el-option>
              <el-option label="私用" :value="1"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="search">
        <el-button type="primary" @click="toSearch">查询</el-button>
        <el-button  @click="resetSearch">重置</el-button>
      </div>
    </div>

    <!-- 账户列表 -->
    <div class="content">
      <div class="top">
        <div class="title">
          <!-- <div class="sign"></div> -->
          <div class="name">账户信息</div>
        </div>
      </div>
      <div class="table">
        <el-table :data="accountList" style="width: 100%" border
         :header-cell-style="tableHeaderStyle">
          <el-table-column
            prop="orgName"
            label="组织机构"
            align="center"
          ></el-table-column>
          <el-table-column prop="accUse" label="账户用途" align="center">
            <template slot-scope="scope">
              {{ scope.row.accUse === 0 ? "公用" : "私用" }}
            </template>
          </el-table-column>
          <el-table-column prop="accType" label="账户类型" align="center">
            <template slot-scope="scope">
              {{ accTypeObj[scope.row.accType] }}
            </template>
          </el-table-column>
          <el-table-column prop="x" label="数量" align="center">
            <template slot-scope="scope">
              <div @click="seeDetail(scope.row)">
              <div v-if="scope.row.accUse === 1" class="num">对象: {{scope.row.objNumVo.priObjNum}}</div>
              <div v-else class="num">车辆: {{scope.row.objNumVo.pubCarNum}} 人员: {{scope.row.objNumVo.pubPersonNum}} 实体卡: {{scope.row.objNumVo.pubCardNum}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalAmount"
            label="总金额(元)"
            align="center"
          >
          <template slot-scope="scope">
              {{Number(scope.row.totalAmount) > 0 ? (scope.row.totalAmount).toFixed(6) : 0}}
          </template>
          </el-table-column>
          <el-table-column prop="accState" label="状态" align="center">
            <template slot-scope="scope">
              {{ scope.row.accState === 0 ? "启用" : "停用" }}
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="total > 0">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handlePage"
            :current-page="searchConf.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="searchConf.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
      </div>
    </div>

    <!-- 账户详情(充电对象列表) -->
    <div class="detailBox" v-else>
        <div class="back" @click="goBack">
          <img src="@/assets/images/fanhui.png"/>
          <span>返回上一级</span>
        </div>
        <div class="detailTable">
             <div class="top">
                <div class="title">
                <div class="sign"></div>
                <div class="name">{{detailTitle}}</div>
                </div>
            </div>
            <!-- 共享 -->
            <ShareItem v-if="detailAccType === 0" :accId="accId" @fetchList="fetchAccountList"/> 
            <!-- 配额 -->
            <QuotaItem v-if="detailAccType === 2" :accId="accId" @fetchList="fetchAccountList"/>
            <!-- 私有 -->
            <PrivateItem v-if="detailAccType === 3" :accId="accId" @fetchList="fetchAccountList"/>
        </div>
    </div>

  </div>
</template>

<script>
import QuotaItem from './components/quotaItem.vue'
import ShareItem from './components/shareItem.vue'
import PrivateItem from './components/privateItem.vue'
import { getAccountList } from '@/api/financial/account'
import { mapGetters } from 'vuex'
export default {
    components: {
       QuotaItem,  ShareItem,  PrivateItem
    },
  data() {
    return {
      groupId: null,
      seaUseType: null, // 搜索账户用途
      showDetail: false,
      detailAccType: null, // 查看详情账户类型
      detailTitle: '', // 详情title
      sortValueBy: "ORDER_SELECTED",
      accTypeObj: {
        0: "共享",
        2: "配额",
        3: "私有",
      },
      total: 0,
      accountList: [],
      accId: null,
      searchConf: {
        pageNo: 1,
        pageSize: 10,
        orgId: null,
        accUse: null,
      }
    }
  },
  computed: {
    ...mapGetters(['deptList'])
  },
  created() {
    this.fetchAccountList()
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
    async fetchAccountList() {
      const rsp = await getAccountList(this.searchConf)
      if(rsp.code === 200) {
        this.accountList = rsp.data.list
        this.total = rsp.data.total
      } 
    },
    toSearch() {
      this.searchConf.pageNo = 1
      this.fetchAccountList()
    },
    resetSearch() {
      this.searchConf.orgId = null
      this.searchConf.accUse = null
      this.searchConf.pageNo = 1
      this.fetchAccountList() 
    },
    handlePage(page) {
       this.searchConf.pageNo = page
       this.fetchAccountList()
    },
    handleSizeChange(pageSize) {
      this.searchConf.pageSize = pageSize
      this.searchConf.pageNo = 1
      this.fetchAccountList()
    },
    seeDetail(row) {
      this.accId = row.accId
      this.detailAccType = row.accType
      this.detailTitle = `充电对象列表(${row.orgName})`
      this.showDetail = true
    },
    goBack() {
      this.showDetail = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.accSearch {
  .searchAccSearch {
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
    .top {
      padding: 15px;
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
    }
    .table {
      padding: 10px 20px;
      .num {
        color: $btnMainColor;
        cursor: pointer;
      }
      .pagination {
        margin: 10px 0;
        display: flex;
        justify-content: flex-end;
      }
    }
  }

  .detailBox {
   .back {
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    img {
      width: 20px;
      height: 20px;
    } 
    span {
        padding-left: 10px;
        color: $topMenuActiveColor;
        font-size: 13px;
      }
  }
  .detailTable {
      background-color: #fff;
      padding: 5px 15px 15px 15px;
    .top {
      padding: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 5px;
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
    }
  }
  }
}
</style>
