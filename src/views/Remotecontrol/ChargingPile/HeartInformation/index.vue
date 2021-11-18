<!--
心跳包信息设置
-->
<template>
  <div class="app-container" style="">
    <!-- <el-card> -->
    <div class="card">
      <el-form ref="form" :model="queryParams" label-width="98px" size="small">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item prop="businessType" label="充电网点">
              <el-select
                v-model="queryParams.outlets"
                placeholder="请选择网点"
                clearable
                size="small"
                @change="getdata"
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
          <el-col :span="6">
            <el-form-item prop="status" label="充电设备名称">
              <el-select
                v-model="queryParams.name"
                placeholder="请选择充电设备名称"
                clearable
                size="small"
                @change="getEquipment"
              >
                <el-option
                  v-for="dict in namelist"
                  :key="dict.chargId"
                  :label="dict.chargName"
                  :value="dict.assetsNum"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="userName" label="充电设备编码">
              <el-input
                v-model="queryParams.code"
                placeholder="请输入充电设备编号"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" align="right">
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
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            size="mini"
            @click="configure"
            :disabled="toconfig"
            type="primary"
            >配置</el-button
          >
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
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="充电网点"
          align="center"
          prop="chargGroupName"
        />
        <el-table-column label="充电设备名称" align="center" prop="chargName" />
        <el-table-column label="充电设备编码" align="center" prop="chargId" />
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 配置弹框 -->
    <el-dialog
      title="请添加下发字段信息"
      :visible.sync="open"
      width="700px"
      append-to-body
    >
      <el-form
        :rules="rules"
        ref="form"
        :model="dialogform"
        label-width="160px"
        size="mini"
        :inline="true"
      >
        <el-row>
          <el-col :span="14">
            <el-form-item label="心跳上报周期(秒)" prop="cycle">
              <el-input
                v-model="dialogform.cycle"
                placeholder="请输入心跳上报周期"
                clearable
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="心跳包检测超时次数" prop="times">
              <el-input
                v-model="dialogform.times"
                placeholder="请输入超时次数"
                clearable
                size="small"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="down">下发</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  toIssue,
  getChargGroupCode,
  getEquipment,
  list
} from '@/api/remotecontrol/chargingpile/heartinfor.js'

export default {
  name: 'Heartinfor',
  data() {
    let number = (rule, value, cb) => {
      let reg = /^([1-9]|[1-5][0-9]|60)$/
      if (!reg.test(value)) {
        cb(new Error('上报周期要在0到60秒'))
      } else {
        cb()
      }
    }
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
      //充电设备类型
      outletslist: [
        { value: '1', label: '网点1' },
        { value: '2', label: '网点2' },
        { value: '3', label: '网点3' }
      ],
      //   设备名称列表名称
      namelist: [
        { value: '1', label: '名称1' },
        { value: '2', label: '名称2' },
        { value: '3', label: '名称3' }
      ],
      //   判断是否可点击
      toconfig: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // module: undefined,
        // userName: undefined,
        // status: undefined,
        thename: '',
        code: '',
        outlets: '',
        businessType: undefined
      },
      //校验
      rules: {
        cycle: [
          { required: true, message: '请输入上报周期', trigger: 'blur' },
          { validator: number, trigger: 'change' }
        ],
        times: [{ required: true, message: '请输入超时次数', trigger: 'blur' }]
      },
      timevalue: '',
      // 配置弹框数据
      dialogform: {
        cycle: '',
        times: ''
      },
      // 下发数组
      issueList: []
    }
  },
  watch: {
    'queryParams.outlets'() {
      let that = this
      getEquipment({ chargGroupId: that.queryParams.outlets }).then((res) => {
        this.namelist = res.data.result
        // this.queryParams.name = this.namelist[0].chargName
        // this.queryParams.code = this.namelist[0].assetsNum
      })
    }
  },
  created() {
    getChargGroupCode().then((res) => {
      this.outletslist = res.data.result
    })
    this.getList()
  },
  methods: {
    getdata() {
      // getEquipment({ chargGroupId: val }).then((res) => {
      //   this.namelist = res.data.result
      // })
    },
    // 查询设备
    getEquipment(e) {
      this.$forceUpdate()
      this.queryParams.code = this.queryParams.name
      this.queryParams.name = this.namelist.filter(
        (item) => item.assetsNum == e
      )[0].chargName
    },
    /** 查询*/
    getList() {
      this.loading = true
      let obj = {}
      obj.chargGroupId = this.queryParams.outlets
      obj.chargName = this.queryParams.name
      obj.assetsNum = this.queryParams.code
      obj.pageNum = this.queryParams.pageNum
      obj.pageSize = this.queryParams.pageSize
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
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        outlets: '',
        chargName: '',
        code: ''
      }
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      if (selection.length > 0) {
        this.issueList = []
        selection.forEach((item) => {
          let obj = {}
          obj.deviceNo = item.chargId
          obj.deviceName = item.chargName
          this.issueList.push(obj)
        })
      }
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
    configure() {
      this.dialogform = {
        cycle: '',
        times: ''
      }
      this.open = true
    },
    // 点击下发
    down() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let obj = {}
          obj.deviceList = this.issueList
          obj.heartbeatReportingCycle = this.dialogform.cycle
          obj.heartbeatTimeoutTime = this.dialogform.times
          toIssue(obj).then((res) => {
            if (res.code == 200) {
              this.$message({ message: res.message, type: 'success' })
            }
          })
          this.open = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.boxremote {
  min-height: calc(100vh - 150px);
  overflow: auto;
  margin-top: 10px;
}
::v-deep .el-input--suffix .el-input__inner {
  padding-right: 1.25rem !important;
}
</style>
