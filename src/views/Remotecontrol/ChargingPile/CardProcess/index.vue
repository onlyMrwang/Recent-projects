<!--
刷卡流程参数设置
-->
<template>
  <div class="app-container" style="">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-col :span="5">
        <el-form-item prop="businessType">
          <el-select
            v-model="queryParams.outlets"
            placeholder="请选择网点"
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
      <el-col :span="5">
        <el-form-item prop="status">
          <el-select
            v-model="queryParams.name"
            placeholder="请选择充电设备名称"
            clearable
            size="small"
            style="width: 200px"
          >
            <el-option
              v-for="dict in namelist"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="5">
        <el-form-item prop="userName">
          <el-input
            v-model="queryParams.code"
            placeholder="请输入充电设备编号"
            clearable
            style="width: 240px"
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
      </el-col>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" @click="handleQuery">
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="11" class="mb8">
      <el-col :span="1.5">
        <el-button
          icon="el-icon-download"
          size="mini"
          @click="configure"
          :disabled="toconfig"
          >配置</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="newlist"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="网点名称" align="center" prop="chargGroupName" />
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

    <!-- 配置弹框 -->
    <el-dialog title="请添加下发字段信息" :visible.sync="open" width="700px">
      <el-form
        :rules="rules"
        ref="form"
        :model="dialogform"
        label-width="135px"
        size="mini"
        :inline="true"
      >
        <el-col :span="11">
          <el-form-item label="刷卡/插卡" prop="swipe">
            <el-radio-group v-model="dialogform.swipe">
              <el-radio label="1">应用</el-radio>
              <el-radio label="0">不应用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="连接充电线缆" prop="connectChargingCable">
            <el-radio-group v-model="dialogform.connectChargingCable">
              <el-radio label="1">应用</el-radio>
              <el-radio label="0">不应用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="输入密码" prop="password">
            <el-radio-group v-model="dialogform.password">
              <el-radio label="1">应用</el-radio>
              <el-radio label="0">不应用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="输入车牌" prop="licensePlate">
            <el-radio-group v-model="dialogform.licensePlate">
              <el-radio label="1">应用</el-radio>
              <el-radio label="0">不应用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="充电" prop="charging">
            <el-radio-group v-model="dialogform.charging">
              <el-radio label="1">应用</el-radio>
              <el-radio label="0">不应用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="充电模式选择" prop="chargingModeSelection">
            <el-radio-group v-model="dialogform.chargingModeSelection">
              <el-radio label="1">应用</el-radio>
              <el-radio label="0">不应用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="充电结束刷卡" prop="swipeEndOfCharging">
            <el-radio-group v-model="dialogform.swipeEndOfCharging">
              <el-radio label="1">应用</el-radio>
              <el-radio label="0">不应用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="结算" prop="settleAccounts">
            <el-radio-group v-model="dialogform.settleAccounts">
              <el-radio label="1">应用</el-radio>
              <el-radio label="0">不应用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="充电查询服务" prop="querySvc">
            <el-radio-group v-model="dialogform.querySvc">
              <el-radio label="1">应用</el-radio>
              <el-radio label="0">不应用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="断开充电线缆" prop="disconnectChargingCable">
            <el-radio-group v-model="dialogform.disconnectChargingCable">
              <el-radio label="1">应用</el-radio>
              <el-radio label="0">不应用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="打印凭条" prop="printReceipt">
            <el-radio-group v-model="dialogform.printReceipt">
              <el-radio label="1">应用</el-radio>
              <el-radio label="0">不应用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="充电枪/舱门解锁" prop="unlockChargingDoor">
            <el-radio-group v-model="dialogform.unlockChargingDoor">
              <el-radio label="1">应用</el-radio>
              <el-radio label="0">不应用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="充电枪/舱门锁紧" prop="lockChargingDoor">
            <el-radio-group v-model="dialogform.lockChargingDoor">
              <el-radio label="1">应用</el-radio>
              <el-radio label="0">不应用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="充电结束刷卡密码" prop="endOfChargingPassword">
            <el-radio-group v-model="dialogform.endOfChargingPassword">
              <el-radio label="1">应用</el-radio>
              <el-radio label="0">不应用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="down('form')">下发</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list } from '@/api/monitor/operlog'
import { toIssue } from '@/api/remotecontrol/chargingpile/cardprocess.js'

export default {
  name: 'Cardprocess',
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
        pageSize: 11,
        // module: undefined,
        // userName: undefined,
        // status: undefined,
        cycle: '',
        times: '',
        businessType: undefined
      },
      //校验
      rules: {
        swipe: [
          { required: true, message: '请选择应用/不应用', trigger: 'change' }
        ],
        connectChargingCable: [
          { required: true, message: '请选择应用/不应用', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请选择应用/不应用', trigger: 'change' }
        ],
        licensePlate: [
          { required: true, message: '请选择应用/不应用', trigger: 'change' }
        ],
        charging: [
          { required: true, message: '请选择应用/不应用', trigger: 'change' }
        ],
        chargingModeSelection: [
          { required: true, message: '请选择应用/不应用', trigger: 'change' }
        ],
        swipeEndOfCharging: [
          { required: true, message: '请选择应用/不应用', trigger: 'change' }
        ],
        settleAccounts: [
          { required: true, message: '请选择应用/不应用', trigger: 'change' }
        ],
        querySvc: [
          { required: true, message: '请选择应用/不应用', trigger: 'change' }
        ],
        disconnectChargingCable: [
          { required: true, message: '请选择应用/不应用', trigger: 'change' }
        ],
        printReceipt: [
          { required: true, message: '请选择应用/不应用', trigger: 'change' }
        ],
        unlockChargingDoor: [
          { required: true, message: '请选择应用/不应用', trigger: 'change' }
        ],
        lockChargingDoor: [
          { required: true, message: '请选择应用/不应用', trigger: 'change' }
        ],
        endOfChargingPassword: [
          { required: true, message: '请选择应用/不应用', trigger: 'change' }
        ]
      },
      timevalue: '',
      dialogform: {
        swipe: '',
        connect: '',
        password: '',
        plate: '',
        charging: '',
        chargingtype: '',
        finishswipe: '',
        settlement: '', //结算
        search: '',
        disconnect: '',
        writen: '',
        unlocking: '',
        locking: '',
        finishPassword: ''
      }
    }
  },
  created() {
    this.getList()
    this.newlist = [
      { code: '11112', thename: 'name1', outlets: 'dian1' },
      { code: '43434', thename: 'name2', outlets: 'dian2' }
    ]
  },
  methods: {
    /** 查询登录日志 */
    getList() {
      this.loading = true
      list(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.list = response.rows
          this.total = response.total
          this.loading = false
        }
      )
    },
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
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
    configure() {
      this.open = true
    },
    // 点击下发
    down(from) {
      this.$refs[from].validate((valid) => {
        if (valid) {
          this.open = false
          toIssue().then(() => {})
        } else {
          return false
        }
      })
      //     this.$refs[formName].validate((valid) => {
      //       if (valid) {
      //           this.open = false;
      //         alert('submit!')
      //       } else {
      //         console.log('error submit!!');
      //         return false
      //       }

      //     })
      //   }
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  ::v-deep .el-dialog__body {
    height: 300px;
  }
}
</style>
