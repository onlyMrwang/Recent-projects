<!--
  机器人复位日志
-->
<template>
  <div class="app-container" style="">
    <div class="card">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="125px"
      >
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item prop="outlets" label="机器人名称">
              <el-select
                v-model="queryParams.outlets"
                placeholder="请选择机器人名称"
                clearable
                size="small"
                style="width: 200px"
                @change="getCode"
              >
                <el-option
                  v-for="item in outletslist"
                  :key="item.assetNum"
                  :label="item.robotName"
                  :value="item.assetNum"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item prop="code" label="机器人编号">
              <el-input
                v-model="queryParams.code"
                placeholder="请输入机器人编号"
                clearable
                style="width: 200px"
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item prop="chargId" label="所属充电设备编号">
              <el-input
                v-model="queryParams.chargId"
                placeholder="请输入所属充电设备编号"
                clearable
                style="width: 200px"
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-button type="primary" size="mini" @click="handleQuery">
                查询
              </el-button>
              <el-button size="mini" @click="resetQuery">
                重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-card style="margin-top:10px">
      <el-table
        ref="table"
        border
        :stripe="true"
        :header-cell-style="tableHeaderStyle"
        :data="newlist"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          label="网点名称"
          align="center"
          prop="chargGroupName"
        />
        <el-table-column
          label="充电机器人名称"
          align="center"
          prop="robotName"
        />
        <el-table-column
          label="充电机器人编号"
          align="center"
          prop="assetNum"
        />
        <el-table-column
          label="所属充电设备编号"
          align="center"
          prop="chargeAssetNum"
        />
        <el-table-column label="复位人" align="center" prop="operator" />
        <el-table-column label="复位时间" align="center" prop="createTime" />

        <!-- <el-table-column label="复位时间" align="center" prop="handleTime" /> -->
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getLogs"
      />
    </el-card>

    <!-- 配置弹框 -->
    <el-dialog
      title="复位信息"
      :visible.sync="open"
      width="700px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="dialogform"
        label-width="100px"
        size="mini"
        :inline="true"
      >
        <div style="margin：0 auto">{{ msg }}</div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="down">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRobotName,
  seachLogs
} from '@/api/remotecontrol/remotecontrol/resetlogs.js'
export default {
  name: 'RobotReset',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示查询条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      newlist: [],
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      typeOptions: [],
      // 类型数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      msg: '复位成功/失败',
      //   网点列表
      outletslist: [],
      //   判断是否可点击
      toconfig: true,
      // 查询参数
      queryParams: {
        code: '',
        pageNum: 1,
        pageSize: 10,
        outlets: null,
        date: []
      },
      //
      timevalue: '',
      dialogform: {
        communication: '',
        timevalue: ''
      }
    }
  },
  // watch: {
  //   'queryParams.outlets'() {
  //     const e = this.queryParams.outlets
  //     this.queryParams.code = e
  //     this.queryParams.chargId = e
  //       ? this.outletslist.filter((item) => (item.robotId = e))[0].chargId
  //       : ''
  //   }
  // },
  created() {
    getRobotName().then((res) => {
      this.outletslist = res.data.result
    })
    this.getLogs()
  },
  methods: {
    // 级联机器人编号
    getCode(e) {
      // 机器人编号
      this.queryParams.code = e
        ? this.outletslist.filter((item) => {
            return item.assetNum === e
          })[0].assetNum
        : ''
      // 所属充电设备编号
      this.queryParams.chargId = e
        ? this.outletslist.filter((item) => {
            return item.assetNum === e
          })[0].chargeAssetNum
        : ''
    },
    // 查询日志
    getLogs() {
      this.loading = true
      let obj = {}
      obj.robotName = this.queryParams.outlets
        ? this.outletslist.filter((item) => {
            return item.assetNum == this.queryParams.outlets
          })[0].robotName
        : ''
      obj.assetNum = this.queryParams.code
      obj.chargeAssetNum = this.queryParams.chargId
      obj.pageNum = this.queryParams.pageNum
      obj.pageSize = this.queryParams.pageSize
      seachLogs(obj).then((res) => {
        this.total = res.data.result.total || 0
        this.loading = false
        this.newlist = res.data.result.records
      })
    },
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = 10
      this.getLogs()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        outlets: null,
        code: '',
        chargId: ''
      }
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.toconfig = selection.length > 0 ? false : true
      this.ids = selection.map((item) => item.id)
      this.multiple = !selection.length
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true
      this.form = row
    },
    /** 点击配置按钮 */
    reset() {
      this.open = true
    },
    // 点击下发
    down() {
      this.open = false
    }
  }
}
</script>
<style lang="scss" scoped>
.btn {
  margin-left: 1.875rem;
}
</style>
