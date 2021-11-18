<!--
  充电设备配置日志查询
-->
<template>
  <div class="app-container" style="">
    <div class="card">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="80px"
      >
        <el-row :gutter="20">
          <el-col :span="7">
            <el-form-item prop="businessType" label="操作类型">
              <el-select
                v-model="queryParams.outlets"
                placeholder="请选择操作类型"
                clearable
                size="small"
                style="width: 200px"
              >
                <el-option
                  v-for="dict in outletslist"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="date" label="日期">
              <el-date-picker
                v-model="queryParams.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:300px"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="5" align="right">
            <el-button type="primary" size="mini" @click="handleQuery">
              查询
            </el-button>
            <el-button size="mini" @click="resetQuery">
              重置
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          icon="el-icon-download"
          size="mini"
          @click="reset"
          :disabled="toconfig"
          >复位</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row> -->
    <div class="card boxremote">
      <el-table
        ref="table"
        border
        :stripe="true"
        :header-cell-style="tableHeaderStyle"
        :data="newlist"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="时间" align="center" prop="handleTime" />
        <el-table-column label="操作类型" align="center" prop="handleType">
          <template slot-scope="scope">
            {{ outletslist[scope.row.handleType].label }}
          </template>
        </el-table-column>
        <el-table-column label="操作对象" align="center" prop="deviceName" />
        <el-table-column label="内容" align="center" prop="msg">
          <template slot-scope="scope">
            {{
              scope.row.handleType === 0
                ? `签到时间间隔:${scope.row.msg}`
                : scope.row.msg
            }}
            <!-- {{msg}} -->
          </template>
        </el-table-column>
        <el-table-column label="操作结果" align="center" prop="handleResult">
          <template slot-scope="scope">
            {{ scope.row.handleResult == 0 ? '成功' : '失败' }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="复位时间" align="center" prop="handleTime" /> -->
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getLogs"
      />
    </div>

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
import { seachLogs } from '@/api/remotecontrol/otherconfig/logsearch.js'
import moment from 'moment'
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
      outletslist: [
        { value: '0', label: '设备参数下发' },
        { value: '1', label: '充电设备时间同步' },
        { value: '2', label: '工作参数设置' },
        { value: '3', label: '心跳包信息设置' },
        { value: '4', label: '刷卡流程参数设置' },
        { value: '5', label: '运营参数管理' },
        { value: '6', label: '上报时间间隔设置' },
        { value: '7', label: '充电设备重启' },
        { value: '8', label: '充电设备远程控制' },
        { value: '9', label: '固件升级' }
      ],
      //   判断是否可点击
      toconfig: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        outlets: '',
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
  watch: {
    'queryParams.date'(newVal, oldVal) {
      if (newVal == null) {
        this.queryParams.date = []
      }
    }
  },
  created() {
    this.getLogs()
  },
  methods: {
    // 查询日志
    getLogs() {
      this.loading = true
      let obj = {}
      // if(!this.queryParams.outlets === ""){

      obj.handleType = this.queryParams.outlets
      if (this.queryParams.date.length > 1) {
        obj.startTime = moment(this.queryParams.date[0]).format('YYYY-MM-DD')
        obj.endTime = moment(this.queryParams.date[1]).format('YYYY-MM-DD')
      }
      obj.pageNum = this.queryParams.pageNum
      obj.pageSize = this.queryParams.pageSize
      // if (obj.startTime == obj.endTime) {
      //   obj.startTime = ''
      //   obj.endTime = ''
      // }
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
        outlets: '',
        date: []
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
.boxremote {
  min-height: calc(100vh - 150px);
  overflow: auto;
  margin-top: 10px;
}
</style>
