<template>
  <div class="app-container">
    <!--表格渲染-->
    <el-card style="margin: 10px 0 15px 0" v-if="!showAdd">
      <div class="head-container">
        <div style="margin-bottom: 8px;">
          <el-button size="mini" icon="el-icon-plus" @click="toAdd" class="btn" type="primary">上传</el-button>
        </div>
      </div>
      <div class="content">
      <el-table
        :data="tableData"
        border
        :header-cell-style="tableHeaderStyle"
        style="width: 100%"
      >
        <el-table-column
          label="版本号"
          prop="versionCode"
          align="center"
          show-overflow-tooltip 
        >
        </el-table-column>
        <el-table-column label="版本名称" align="center" prop="versionName" show-overflow-tooltip></el-table-column>
        <el-table-column label="发布平台" align="center">
          <template slot-scope="scope">
            {{ scope.row.os === 0 ? "ios" : "android" }}
          </template>
        </el-table-column>
        <el-table-column label="更新内容" align="center" prop="content" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-html="scope.row.content || null"></div>
          </template>
        </el-table-column>
        <el-table-column label="是否强制更新" align="center">
          <template slot-scope="scope">
            {{ scope.row.ifForce === 0 ? "否" : "是" }}
          </template>
        </el-table-column>
        <el-table-column label="更新地址" align="center" prop="appAddre">
          <template slot-scope="scope">
           <el-tooltip  popper-class="item" effect="dark" placement="top">
              <div slot="content">{{scope.row.appAddre}} 
                <el-link
                type="primary"
                title="复制更新地址"
                :underline="false"
                v-clipboard:copy="scope.row.appAddre"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                icon="el-icon-copy-document"
                ></el-link
              >
              </div>
              <div class="oneLine">{{scope.row.appAddre}}</div>
            </el-tooltip>
            </template>
        </el-table-column>
        <el-table-column label="上传时间" align="center" prop="time" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.time | formatTime}}
          </template>
        </el-table-column>
      </el-table>
      </div>
      <!-- <div class="pagination-container" v-if="total > 0">
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchConf.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="searchConf.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
      </div> -->
    </el-card>

    <AddItem v-if="showAdd" @closeAdd="closeAdd"/>
   
  </div>
</template>

<script>
import { appUpdateList } from '@/api/system/app'
import AddItem from './addItem.vue'
import { mapGetters } from 'vuex'
import  moment from 'moment'
export default {
 components: { AddItem },
  data() {
    return {
        tableData: [],
        // total: 0,
        // searchConf: {
        //     pageNum: 1,
        //     pageSize: 10
        // },
        showAdd: false,
    }
  },
  computed: {
   ...mapGetters(['dictInfo'])
  },
  filters: {
    formatTime(val) {
      if(val) {
        return moment(parseInt(val)).format('YYYY-MM-DD hh:mm:ss')
      }else {
        return null
      }
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      const rsp = await appUpdateList()
      if(rsp.code === 200) {
        this.tableData = rsp.data
      }
    },
   toAdd(){
       this.showAdd = true;
   },
   closeAdd() {
       this.showAdd = false
       this.fetchList()
   },
    onCopy() {
      // 复制成功
      this.$message({
        message: "复制成功",
        type: "success",
      })
    },
    onError() {
      // 复制失败
      this.$message({
        message: "复制失败",
        type: "error",
      });
    },
  //  handleSizeChange(pageSize) {
  //      this.searchConf.pageSize = pageSize
  //      this.searchConf.pageNum = 1
  //  },
  //  handleCurrentChange(page) {
  //      this.searchConf.pageNo = page
  //  }
  }
}
</script>
<style lang="scss">
.oneLine {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
<style scoped lang="scss">
.content {
  min-height: calc(100vh - 180px); 
}
.input-width {
  width: 250px;
}
.topCard {
  margin-top: 10px;
}
</style>
