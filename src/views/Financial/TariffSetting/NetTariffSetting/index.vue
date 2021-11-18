<template>
  <div class="netBox">
    <div v-if="!showSetting">
    <div class="searchBox">
      <div class="inputBox">
        <div class="inputItem">
          <div class="label">网点</div>
          <div class="value">
            <el-input v-model="searchConf.siteName" placeholder="请输入网点" />
          </div>
        </div>
        <div class="inputItem">
          <div class="label">年份</div>
          <div class="value">
            <el-select v-model="searchConf.year" placeholder="请选择年份">
              <el-option
                v-for="item in yearList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="search">
        <el-button type="primary" @click="toSearch">查询</el-button>
        <el-button plain @click="resetSearch">重置</el-button>
      </div>
    </div>
    <div class="netListBox">
      <div class="top">
        <div class="title">
          <!-- <div class="sign"></div> -->
          <div class="name">网点资费配置列表</div>
        </div>
        <div class="options">
          <el-button type="primary" icon="el-icon-plus" @click="addNet">新增</el-button>
        </div>
      </div>
      <div class="tableBox">
        <el-table :data="siteFeeList" style="width: 100%"
         :header-cell-style="tableHeaderStyle" border
         max-height="523"
         >
          <el-table-column prop="recSiteName" label="网点名称" align="center">
             <template slot-scope="scope">
        <el-link  type="primary" :underline="false"
          @click="settingRow(scope.row)"
         >{{scope.row.recSiteName}}</el-link>
      </template>
          </el-table-column>
          <el-table-column prop="cYear" label="配置年份" align="center">
          </el-table-column>
          <el-table-column prop="updateTime" label="配置时间" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
           <el-popconfirm title="确定删除该网点资费配置?"
           @confirm="deleteRow(scope.row)">
              <el-link type="danger" :underline="false" slot="reference">删除</el-link> 
            </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="siteFeeTotal > 0">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchConf.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="searchConf.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="siteFeeTotal">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
 
  <!-- 新增网点资费 -->
  <div v-if="showAdd">
  <el-dialog
    v-dialogDrag
    title="新增"
    :visible.sync="showAdd"
    width="30%"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :before-close="closeAddDialog">
      <div class="addBox">
        <div class="addItem">
          <div class="label">网点</div>
          <div class="value">
            <el-select v-model="addNetObj" placeholder="请选择网点" :clearable="true" @change="changeAddNet">
              <el-option
                v-for="item in orgSiteList"
                :key="item.resSiteId"
                :label="item.resSiteName"
                :value="{value:item.resSiteId,label:item.resSiteName}"
              >
              </el-option>
            </el-select>
          </div>
        </div>
          <div class="addItem">
          <div class="label">年份</div>
          <div class="value">
              <el-select v-model="addYear" placeholder="请选择年份" :clearable="true" @change="changeAddYear">
              <el-option
                v-for="item in yearList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
       <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitAdd">确 定</el-button>
    </span>
    </el-dialog>
  </div>
   <!-- 网点资费配置 -->
  <Setting v-if="showSetting" :netTitle="netTitle" :cid="cid" :cyear="cyear" @closeSetting="closeSetting"/>

  </div>   

</template>

<script>
import Setting from './setting.vue'
import { getNetFeeList, addSiteFee, getCurOrgList, delSiteFeeSetting } from '@/api/financial/tariffSetting'
import { mapGetters } from 'vuex'
export default {
  components: { Setting },
  data() {
    return {   
      yearIndex: 0,
      showSetting: false,
      showAdd: false,
      addNetId: null,
      addNetObj: null,
      addNetName: null,
      addYear: null,
      netTitle: '',
      cid: null,
      cyear: null,
      siteFeeList: [],
      orgSiteList: [],
      siteFeeTotal: 0,
      searchConf: {
        siteName: null,
        year: null,
        username: null,
        pageNo: 1, 
        pageSize: 10
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'deptList']),
    yearList() {
      const arr = [];
      const currentYear = new Date().getFullYear();
      for (let i = currentYear + 10; i > currentYear - 10; i--) {
        arr.push(i);
      }
      return arr;
    },
  },
  created() {
    if(this.userInfo.userName) {
      this.fetchSiteList()
    }
  },
  methods: {
    async fetchSiteList() {
      this.searchConf.username = this.userInfo.userName
      const rsp = await getNetFeeList(this.searchConf)
      if(rsp.code === 200) {
         this.siteFeeList = rsp.data.list
         this.siteFeeTotal = rsp.data.total
      }
    },
     async fetchOrgSiteList() {
      // const rsp = await getCurOrgList({orgId: this.deptList[0].id})
      const rsp = await getCurOrgList()
      if(rsp.code === 200) {
          this.orgSiteList = rsp.data
      }
    },
    toSearch() {
      this.searchConf.pageNo = 1
      this.fetchSiteList()
    },
    resetSearch() {
      this.searchConf.siteName = null
      this.searchConf.year = null
      this.searchConf.pageNo = 1
      this.fetchSiteList()
    },
    handleCurrentChange(page) {
       this.searchConf.pageNo = page
       this.fetchSiteList()
    },
     handleSizeChange(pageSize) {
      this.searchConf.pageNo = 1
      this.searchConf.pageSize = pageSize
      this.fetchSiteList()
    },
    async deleteRow(row) {
      const rsp = await delSiteFeeSetting(row.cId)
      if(rsp.code === 200) {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.fetchSiteList()
      }
    },
    settingRow(item) {
      this.netTitle = `${item.recSiteName}网点资费配置`
      this.cid = item.cId 
      this.cyear = item.cYear
      this.showSetting = true
    },
    closeSetting() {
      this.showSetting = false
    },
    addNet() {
        this.fetchOrgSiteList()
        this.showAdd = true
    },
    changeAddNet(val) {
      const { label, value } = val
      this.addNetObj = val
      this.addNetId = value
      this.addNetName = label
    },
    changeAddYear(value) {
        this.addYear = value
    },
    closeAddDialog() {
      this.addNetObj = null
      this.addNetId = null
      this.addYear = null
      this.showAdd = false
    },
   async submitAdd() {
        if(!this.addNetId) {
          this.$message({
            type: 'warning',
            message: '请选择网点' 
          })
        }else if(!this.addYear) {
            this.$message({
            type: 'warning',
            message: '请选择年份' 
          })
        }else {
        const data = {
          cyear: this.addYear,
          recSiteId: this.addNetId,
          recSiteName: this.addNetName,
          enterpriseId: this.userInfo.tenantId
        }
          const rsp = await addSiteFee(data)
          if(rsp.code === 200) {
            this.$message({
              type: 'success',
              message: '新增成功'
            })
             this.closeAddDialog()
             this.fetchSiteList()
          }
         
        }
    }
  },
};
</script>
<style lang="scss">
@import "@/assets/styles/global.scss";

.el-popconfirm__main {
  margin-bottom: 15px;
}

</style>
<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.netBox {
  .searchBox {
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
  .netListBox {
    margin: 10px 0;
    background-color: #fff;
    min-height: calc(100vh - #{$headerHeight + 135px});
    padding: 27px 10px 10px 10px;
    border-radius: 4px;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
       margin-top: -10px;
      }
    }
    .tableBox {
      .pagination {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
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
        // font-size: 14px;
        margin-right: 10px;
        &::before {
          content: '*';
          color: red;
        }
      }

    }
  }

}
</style>
