<!--
运营参数设置
-->
<template>
  <div class="app-container" style="">
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
      <el-row :gutter="11" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            size="mini"
            @click="configure"
            :disabled="toconfig"
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
    <el-dialog title="请添加下发字段信息" :visible.sync="open" width="700px">
      <el-form
        :rules="rules"
        ref="form"
        :model="dialogform"
        label-width="100px"
        size="mini"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item label="参数类型" prop="paramType">
              <el-select
                v-model="dialogform.paramType"
                placeholder="请选择"
                clearable
                style="width: 200px"
                size="small"
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
          <el-col :span="10">
            <el-form-item label="参数信息" prop="paramInfo">
              <el-input
                v-model="dialogform.paramInfo"
                placeholder="请输入参数信息"
                clearable
                style="width: 200px"
                size="small"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="down('form')">下发</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { list} from "@/api/monitor/operlog";
// import {toIssue,list} from "@/api/remotecontrol/chargingpile/operationparams.js"
import {
  toIssue,
  getChargGroupCode,
  getEquipment,
  list
} from '@/api/remotecontrol/chargingpile/operationparams.js'

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
      // 下发数组
      issueList: [],
      // 设备名称
      namelist: [],
      outletslist: [
        { value: '1', label: '网点1' },
        { value: '2', label: '网点2' },
        { value: '3', label: '网点3' }
      ],
      //参数类型
      typelist: [
        { value: '1', label: '公司信息' },
        { value: '2', label: '网站信息' },
        { value: '3', label: '客服电话' },
        { value: '4', label: '本网点收费信息' },
        { value: '5', label: '服务接口信息' },
        { value: '6', label: '注意事项' },
        { value: '7', label: '二维码动态首字段' },
        { value: '8', label: '二维码动态验证字段' }
      ],
      //   设备名称列表
      batterylist: [],
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
        paramType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        paramInfo: [
          { required: true, message: '请输入交易数据门限', trigger: 'change' }
        ]
      },
      timevalue: '',
      dialogform: {
        paramType: '',
        paramInfo: ''
      }
    }
  },
  watch: {
    // queryParams:{
    'queryParams.outlets'() {
      let that = this
      getEquipment({ chargGroupId: that.queryParams.outlets }).then((res) => {
        this.namelist = res.data.result
        // this.queryParams.name = this.namelist[0].chargName
        // this.queryParams.code = this.namelist[0].assetsNum
      })
    }
    // deep:true
    // }
  },
  created() {
    getChargGroupCode().then((res) => {
      this.outletslist = res.data.result
    })
    this.getList()
  },
  methods: {
    //   查询设备
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
    /** 点击配置按钮 */
    configure() {
      this.dialogform = {
        paramType: '',
        paramInfo: '',
        swipe: '',
        connect: ''
      }
      this.open = true
    },
    // 点击下发
    down(from) {
      this.$refs[from].validate((valid) => {
        if (valid) {
          let obj = {}
          obj.deviceList = this.issueList
          obj.paramType = this.dialogform.paramType
          obj.paramInfo = this.dialogform.paramInfo
          toIssue(obj).then((res) => {
            if (res.code == 200) {
              this.$message({ message: res.message, type: 'success' })
            }
          })
          this.open = false
        } else {
          return false
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
