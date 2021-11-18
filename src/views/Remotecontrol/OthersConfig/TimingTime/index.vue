<!--
定时时间同步
-->
<template>
  <div class="app-container" style="">
    <div class="card">
      <el-form
        ref="form"
        size="small"
        :model="queryParams"
        :inline="true"
        v-show="showSearch"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="businessType" label="充电网点">
              <el-select
                v-model="queryParams.outlets"
                placeholder="请选择网点"
                clearable
                size="small"
                style="width: 200px"
              >
                <el-option
                  v-for="dict in outletslist"
                  :key="dict.chargGroupId"
                  :label="dict.chargGroupName"
                  :value="dict.chargGroupId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="time" label="同步时间区间">
              <el-time-picker
                class="picker"
                size="mini"
                is-range
                arrow-control
                v-model="queryParams.time"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
              >
              </el-time-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
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
    <div class="card boxremote">
      <el-row class="mb8">
        <el-col :span="20">
          <el-button type="primary" size="mini" @click="newAdd">
            新增
          </el-button>
        </el-col>
      </el-row>
      <el-table
        ref="table"
        border
        :stripe="true"
        :header-cell-style="tableHeaderStyle"
        :data="newlist"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="充电网点" align="center" prop="siteName" />
        <el-table-column label="操作日期" align="center" prop="updateTime" />
        <el-table-column label="同步时间" align="center" prop="syncTime" />
        <el-table-column label="同步状态" align="center" prop="syncState">
          <template slot-scope="scope">
            {{ scope.row.syncState === 1 ? '开启' : '关闭' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="code">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <el-button
                icon="el-icon-edit"
                circle
                @click="handleUpdate(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-button
                icon="el-icon-delete"
                circle
                @click="handleDelete(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <!-- 增加弹框 -->
    <div v-if="open">
      <el-dialog
        :title="dialogTitle"
        :visible.sync="open"
        width="700px"
        append-to-body
      >
        <el-form
          :rules="rules"
          ref="form"
          :model="dialogform"
          label-width="135px"
          size="mini"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="充电网点" prop="outlets">
                <el-select
                  v-if="dialogTitle === '修改同步配置' ? false : true"
                  v-model="dialogform.outlets"
                  placeholder="请选择充电网点"
                  clearable
                  :multiple="dialogTitle === '修改同步配置' ? false : true"
                  size="small"
                  style="width: 200px"
                >
                  <el-option
                    v-for="dict in outletslist"
                    :key="dict.chargGroupId"
                    :label="dict.chargGroupName"
                    :value="dict.chargGroupId"
                  />
                </el-select>
                <el-select
                  v-else
                  v-model="dialogform.outlets"
                  placeholder="请选择网点"
                  disabled
                  clearable
                  :multiple="dialogTitle === '修改同步配置' ? false : true"
                  size="small"
                  style="width: 200px"
                >
                  <el-option
                    v-for="dict in outletslist"
                    :key="dict.chargGroupId"
                    :label="dict.chargGroupName"
                    :value="dict.chargGroupId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="同步状态" prop="status">
                <el-select
                  v-model="dialogform.status"
                  placeholder="请选择状态"
                  clearable
                  size="small"
                  style="width: 200px"
                >
                  <el-option
                    v-for="dict in typelist"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="同步时间" prop="time">
                <el-time-picker
                  arrow-control
                  v-model="dialogform.time"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }"
                  style="width: 200px"
                  placeholder="任意时间点"
                >
                </el-time-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button
            v-if="dialogTitle == '修改同步配置' ? false : true"
            type="primary"
            @click="addOne"
            >确定</el-button
          >
          <el-button v-else type="primary" @click="undateOne">修改</el-button>
          <el-button type="primary" @click="down">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  list,
  getChargGroupCode,
  addOne,
  updateOne,
  deleteOne
} from '@/api/remotecontrol/otherconfig/timingtime.js'
import moment from 'moment'
export default {
  name: 'Cardprocess',
  data() {
    return {
      a: true,
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
      // dialog--title
      dialogTitle: '',
      // 表单参数
      form: {},
      value1: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      value2: [new Date()],
      //   网点
      outletslist: [],
      //充电设备类型
      typelist: [
        { value: '1', label: '开启' },
        { value: '0', label: '关闭' }
      ],
      // rules 校验
      rules: {
        outlets: [{ required: true, message: '请选择网点', trigger: 'blur' }]
      },
      //   判断是否可点击
      toconfig: true,
      // 修改列
      rowData: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        time: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)],
        businessType: ''
      },
      timevalue: '',
      dialogform: {
        outlets: '',
        time: [new Date()],
        status: ''
      }
    }
  },
  watch: {
    'queryParams.time'(newVal, oldVal) {
      if (newVal == null) {
        this.queryParams.time = [
          new Date(2016, 9, 10, 0, 0),
          new Date(2016, 9, 10, 23, 59)
        ]
      }
    }
  },
  created() {
    getChargGroupCode().then((res) => {
      this.outletslist = res.data.result
    })
    this.getList()
  },
  methods: {
    /** 查询登录日志 */
    getList() {
      this.loading = true
      let obj = {}
      obj.chargGroupId = this.queryParams.outlets
      obj.pageNum = this.queryParams.pageNum
      obj.pageSize = this.queryParams.pageSize
      if (this.queryParams.time.length > 1) {
        obj.startTime = moment(this.queryParams.time[0]).format('HH:mm:ss')
        obj.endTime = moment(this.queryParams.time[1]).format('HH:mm:ss')
      }

      list(obj).then((res) => {
        this.newlist = res.data.result.records
        this.total = res.data.result.total
        this.loading = false
      })
    },
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = 10
      this.getList()
    },
    // 重置按钮
    resetQuery() {
      this.queryParams.time = ''
      this.queryParams.outlets = ''
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.toconfig = selection.length > 0 ? false : true
      this.ids = selection.map((item) => item.id)
      this.multiple = !selection.length
    },
    // 修改同步配置
    handleUpdate(row) {
      this.rowData = row
      this.dialogform.outlets = row.siteId
      this.dialogform.time = `2021-07-30 ${row.syncTime}`
      this.dialogform.status = row.syncState == 1 ? '开启' : '关闭'
      this.open = true
      this.dialogTitle = '修改同步配置'
    },
    // 修改
    undateOne() {
      let obj = {}
      obj.siteId = this.dialogform.outlets
      obj.siteName = this.rowData.siteName
      obj.jobId = this.rowData.jobId
      obj.syncTime = moment(this.dialogform.time).format('HH:mm:ss')
      if (this.dialogform.status.length > 1) {
        obj.syncState = this.dialogform.status == '开启' ? 1 : 0
      } else {
        obj.syncState = this.dialogform.status
      }

      updateOne(obj).then((res) => {
        if (res.code == 200) {
          this.$message({ message: res.message, type: 'success' })
          this.open = false
          this.getList()
        }
      })
    },
    // 新增同步配置
    newAdd() {
      this.open = true
      this.dialogform = {}
      this.dialogTitle = '新增同步配置'
    },
    // 删除按钮
    handleDelete(row) {
      deleteOne({ jobId: row.jobId }).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: res.message
          })
        }
        this.open = false
        this.getList()
      })
    },
    // 新增dialog确定按钮
    addOne() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let obj = { deviceList: [] }
          this.outletslist.forEach((item) => {
            this.dialogform.outlets.forEach((el) => {
              if (el === item.chargGroupId) {
                obj.deviceList.push({
                  deviceNo: el,
                  deviceName: item.chargGroupName
                })
              }
            })
          })
          obj.syncTime = moment(this.dialogform.time).format('HH:mm:ss')
          obj.syncState = this.dialogform.status - 0
          addOne(obj).then((res) => {
            if (res.code == 200) {
              this.open = false
              this.$message({ message: res.message, type: 'success' })
              this.getList()
            }
          })
        }
      })
    },
    down() {
      this.open = false
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 300px;
}
.btn {
  border: 1px solid;
  border-radius: 50%;
}
.boxremote {
  min-height: calc(100vh - 150px);
  overflow: auto;
  margin-top: 10px;
}
</style>
