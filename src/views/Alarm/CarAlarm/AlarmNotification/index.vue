<!--告警通知策略-->
<template>
  <!--//告警过滤策略-->
  <div class="chrOrderSea">
    <!-- table box-->
    <div class="tableBox">
      <div class="top">
        <div class="title">
          <div class="sign"></div>
          <div class="name">告警通知策略</div>
        </div>
        <div class="options">
          <el-button type="primary" icon="el-icon-plus" @click="upDateEdit(1)"
            >新增</el-button
          >
        </div>
      </div>
      <div class="table">
        <el-table
          :header-cell-style="tableHeaderStyle"
          :data="tableList"
          border
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" width="120" align="center">
          </el-table-column>
          <el-table-column prop="ruleName" label="通知策略名称" align="center">
          </el-table-column>
          <el-table-column prop="validTag" label="状态" align="center">
            <template slot-scope="scope">
              {{ scope.row.validTag == 1 ? '启用' : '禁用' }}
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            fixed="right"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                <el-link
                  :underline="false"
                  @click="upDateEdit(2, scope.row)"
                  type="primary"
                  style="margin-right: 10px;"
                  >修改</el-link
                >
                <el-link
                  :underline="false"
                  @click="handleEdit(scope.row)"
                  type="primary"
                  style="margin-right: 10px;"
                >
                  {{ scope.row.validTag == 1 ? '禁用' : '启用' }}</el-link
                >
                <el-link
                  :underline="false"
                  @click="clearEdit(scope.row)"
                  type="primary"
                  style="margin-right: 10px;"
                  >删除</el-link
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="tableList.length > 0">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="serachInfo.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="serachInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <div v-if="showSetting">
      <el-dialog
        v-dialogDrag
        :title="titles"
        :visible.sync="showSetting"
        width="60%"
        :destroy-on-close="true"
        :close-on-click-modal="false"
        :before-close="closeSetting"
      >
        <AddList
          :levelLists="levelList"
          :ruleForms="ruleForm"
          :subTypes="subType"
          @cleraDialog="closeSetting(arguments)"
          :treeType="2"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getList, //获取列表
  doStartKnowledgeConfig, //启用列表
  stopWledgeConfig, //停用列表
  clertList //删除列表
} from '@/api/alarm/BeforeFiltering.js'
import AddList from './addList'
export default {
  components: {
    AddList
  },
  data() {
    return {
      titles: '',
      total: 0, //数据总条数
      subType: 1, //控制列表新增还是修改
      serachInfo: {
        //检索域对象参数
        type: 2,
        alarmSeverity: null, // 告警级别
        alarmTitle: null, // 告警名称
        pageNo: 1, // 页数
        pageSize: 10 // 页面数量
      },
      currentPage: 1, //分页当前页数
      equipList: [], //告警名称下拉框
      levelList: [
        //级别下拉框数组
        { label: '1级', value: 1 },
        { label: '2级', value: 2 },
        { label: '3级', value: 3 }
      ],
      tableList: [], //table表格列表数组
      showSetting: false, //弹出框得显示隐藏
      ruleForm: {}
    }
  },
  created() {
    this.getList() //获取列表
  },
  methods: {
    handleSizeChange(pageSize) {
      this.serachInfo.pageNo = 1
      this.serachInfo.pageSize = pageSize
      this.getList()
    },
    //获取列表
    async getList() {
      const res = await getList(this.serachInfo)
      if (res.code == 200) {
        this.tableList = res.data.list
        this.total = res.data.total
      }
    },

    //打开弹出框新增修改公用
    upDateEdit(num, val) {
      //通过sybType状态去控制当前时新增还是修改
      if (num == 1) {
        this.ruleForm = {}
        this.titles = '新增告警通知策略'
      } else {
        this.ruleForm = JSON.parse(JSON.stringify(val))
        this.titles = '修改告警通知策略'
      }
      this.subType = num
      this.showSetting = true
    },

    //删除弹出框得方法
    clearEdit(val) {
      this.$confirm('是否删除当前所选告警通知策略', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.clearLists(val)
      })
    },

    //删除列表得方法
    async clearLists(val) {
      const res = await clertList(val)
      if (res.code == 200) {
        if (this.tableList.length <= 1 && this.serachInfo.pageNo > 1) {
          this.serachInfo.pageNo -= 1
        }
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getList()
      }
    },

    //列表停用启用方法
    handleEdit(val) {
      if (val.validTag == 1) {
        val.validTag = 0
        //调用停用得方法
        this.stopList(val)
      } else {
        val.validTag = 1
        //调用启用得方法
        this.enableList(val)
      }
    },

    //启用告警知识库
    async enableList(val) {
      const res = await doStartKnowledgeConfig(val)
      if (res.code == 200) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getList()
      }
    },

    //停用告警知识库
    async stopList(val) {
      const res = await stopWledgeConfig(val)
      if (res.code == 200) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getList()
      }
    },

    handleCurrentChange(page) {
      this.serachInfo.pageNo = page
      this.getList()
    },
    //关闭弹出框得方法
    closeSetting(val) {
      if (val) {
        if (val[0] === 1) {
          this.getList()
        }
        this.showSetting = false
        this.ruleForm = {}
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.chrOrderSea {
  .tableBox {
    background-color: #fff;
    border-radius: 4px;
    min-height: calc(100vh - 100px);
    margin: 10px 0;
    overflow: auto;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 20px;
      padding: 15px 0 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .name {
          font-size: 16px;
          color: $mainTextColor;
        }
      }
    }
    .table {
      padding: 0 15px 15px 15px;
      .pagination {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
      }
    }
    .box {
      display: inline-block;
      width: 25px;
      height: 10px;
      background-color: #999;
      margin-right: 2px;
    }
    .flexbox {
      height: 110px;
      display: flex;
      /* align-items: center; */
      flex-direction: column;
      justify-content: center;
    }
  }
  .formContent {
    display: flex;
    margin-bottom: 10px;
  }
  .formList {
    flex: 1;
    max-width: 49%;
    main-width: 49%;
  }
}
</style>
