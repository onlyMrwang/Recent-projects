<template>
  <div class="netBox">
    <div v-if="!showDetail">
      <div class="searchBox">
        <div class="inputBox">
          <div class="inputItem">
            <div class="label">网点</div>
            <div class="value">
              <el-select
                v-model="searchConf.recSiteId"
                placeholder="请选择网点"
                filterable 
                :clearable="true"
              >
                <el-option
                  v-for="item in chargGroupList"
                  :key="item.resSiteId"
                  :label="item.resSiteName"
                  :value="item.resSiteId"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="search">
          <el-button type="primary" @click="toSearch">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>
      <div class="netListBox">
        <div class="top">
          <div class="title">
            <!-- <div class="sign"></div> -->
            <div class="name">网点白名单配置列表</div>
          </div>
        </div>
        <div class="tableBox">
          <el-table
            :data="whileList"
            style="width: 100%"
            :header-cell-style="tableHeaderStyle"
            border
            max-height="523"
          >
            <el-table-column
              prop="recSiteName"
              label="网点名称"
              align="center"
              width="280"
            >
              <template slot-scope="scope">
                <el-link type="primary" :underline="false" @click="toDetail(scope.row)">
                  {{scope.row.recSiteName}}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="deptVos"
              label="白名单"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{scope.row.deptVos | formatSite}}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center" width="160">
              <template slot-scope="scope">
                {{ scope.row.status === '0' ? "停用" : "启用" }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160">
              <template slot-scope="scope">
                <div>
                  <el-link type="primary" :underline="false" @click="toSetting(scope.row)" slot="reference" style="margin-right: 10px"
                    >配置</el-link
                  >
                  <el-popconfirm
                    :title="scope.row.status === '1' ? '确定要停用该网点白名单' : '确定要启用该网点白名单'"
                    @confirm="changeState(scope.row)"
                  >
                    <el-link :underline="false" type="primary" slot="reference">{{
                      scope.row.status === '1' ? "停用" : "启用"
                    }}</el-link>
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination" v-if="whileList.length > 0">
               <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
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

    <!-- 新增网点资费 -->
    <div v-if="showSetting">
    <el-dialog
      title="配置白名单"
      v-dialogDrag
      :visible.sync="showSetting"
      width="40%"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :before-close="closeSetting"
    >
      <div class="addDialogBox">
        <div class="addItem">
          <div class="label">组织机构</div>
          <div class="value">
           <treeselect
            :multiple="true"
            :options="deptList"
            :flat="true"
            :sort-value-by="sortValueBy"
            :default-expand-level="1"
            placeholder="请选择组织机构"
            v-model="checkGroup"
            :normalizer="normalizer"
            />
          </div>
        </div>
      </div>
      <span slot="footer" style="margin: 20px 0;">
        <el-button type="primary" @click="submitSetting">确 定</el-button>
        <el-button plain @click="closeSetting">取消</el-button>
      </span>
    </el-dialog>
    </div>
    <!-- 详情 -->
    <Detail v-if="showDetail" :rowRecSiteId="rowRecSiteId" @closeDetail="closeDetail"/>

  </div>
</template>

<script>
import Detail from './detail.vue'
import {getWhiteList, whiteUpdateStatus, whiteSetting} from '@/api/financial/white'
import { getCurOrgList } from '@/api/financial/tariffSetting'
import { mapGetters } from 'vuex'
import { getArrayProps } from '@/utils/utils'
export default {
  components: {
      Detail
  },
  data() {
    return {
      showSetting: false,
      // resSiteId: null, // 搜索网点id
      showDetail: false,
      whiteId: null,
      whileList: [],
      chargGroupList: [],
      checkGroup: [],
      rowRecSiteId: null, // row网点id
      rowInfo: null, 
      sortValueBy: 'ORDER_SELECTED',
      total: 0,
      searchConf: {
        pageNo: 1,
        pageSize: 10,
        username: null,
        recSiteId: null, // 搜索网点id
      }
    }
  },
  computed: {
    ...mapGetters(['deptList', 'userInfo']),
  },
  filters: {
     formatSite(data) {
      if(data.length > 0) {
        return getArrayProps(data, 'orgName').join(',')
      }else {
        return null
      } 
    }
  },
  created() {
    if(this.userInfo.userName) {
      this.searchConf.username = this.userInfo.userName
      this.fetchWhiteList()
    }
    this.fetchSiteList()
  },
  methods: {
    async fetchWhiteList() {
      this.searchConf.username = this.userInfo.userName
      const rsp = await getWhiteList(this.searchConf)
      if(rsp.code === 200) {
         this.whileList = rsp.data.list
         this.total = rsp.data.total
      }
    },
    async fetchSiteList() {
      const rsp = await getCurOrgList()
      if(rsp.code === 200) {
         this.chargGroupList = rsp.data
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
    toSearch() {
     this.searchConf.pageNo = 1
      this.fetchWhiteList()
    },
    reset() {
       this.searchConf = {
        pageNo: 1,
        pageSize: 10,
        recSiteId: null, 
      }
      // this.fetchWhiteList()
    },
    handleCurrentChange(page) {
      this.searchConf.pageNo = page;
      this.fetchWhiteList()
    },
     handleSizeChange(pageSize) {
      this.searchConf.pageNo = 1
      this.searchConf.pageSize = pageSize
      this.fetchWhiteList()
    },
    closeSetting() {
      this.showSetting = false;
      this.checkGroup = []
    },
    async changeState(row) {
      // 将string 转成 number (精度丢失)
      let params = new URLSearchParams()
      params.append('recSiteId', row.recSiteId)
      params.append('status', row.status === '0' ? '1' : '0')
      const msg = row.status === '0' ? '启用成功' : '停用成功'
      const rsp = await whiteUpdateStatus(params)
      if(rsp.code === 200) {
        this.$message({
          type: 'success',
          message: msg
        })
        this.fetchWhiteList()
      }  
    },
    toSetting(row) {
       this.rowInfo = row
        if(row.deptVos.length > 0) {
          this.checkGroup = getArrayProps(row.deptVos, 'orgId')
        }
        this.showSetting = true
    },
    async submitSetting() {
      if(this.checkGroup.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择组织机构'
        })
      }else {
        const data = {
          enterpriseId: this.userInfo.tenantId,
          recSiteId: this.rowInfo.recSiteId,
          orgIds: this.checkGroup.length > 0 ? this.checkGroup.join(',') : null
        }
        const rsp = await whiteSetting(data)
        if(rsp.code === 200) {
          this.$message({
            type: 'success',
            message: '配置成功'
          }) 
          this.showSetting = false
          this.fetchWhiteList()
          this.rowInfo = null
       } 
      }   
    },
    toDetail(row) {
        this.rowRecSiteId = row.recSiteId
        this.showDetail = true
    },
    closeDetail() {
        this.rowRecSiteId = null
        this.showDetail = false
    }
  },
};
</script>
<style lang="scss">
@import "@/assets/styles/global.scss";
.addDialogBox .el-dialog__body {
    height: 120px !important;
    overflow-y: auto;
}
.el-popconfirm__main {
  margin-bottom: 15px;
}

 .addDialogBox .vue-treeselect__menu-container {
    width: 300px !important;
}
 .addDialogBox .vue-treeselect__control {
    width: 300px !important;
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
    padding: 0 35px 0 30px;
    justify-content: space-between;
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
    min-height: calc(100vh - 180px);
    padding: 17px 10px 10px 10px;
    border-radius: 4px;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 20px;
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
  .addDialogBox {
    display: flex;
    align-items: center;
    margin-left: 100px;
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
