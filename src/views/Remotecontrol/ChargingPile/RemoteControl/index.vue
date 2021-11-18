<!--
  充电设备远程控制
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
      <el-row :gutter="10" class="mb8">
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
    <div v-if="open">
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
          label-width="80px"
          size="mini"
        >
          <el-row>
            <el-col>
              <el-form-item label="参数类型" prop="paramstype">
                <el-select
                  v-model="dialogform.paramstype"
                  placeholder="请选择"
                  clearable
                  size="small"
                >
                  <el-option
                    v-for="dict in paramstype"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-for="(item, index) in dialogform.paramsList" :key="item.id">
            <el-col :span="10">
              <el-form-item
                :rules="[
                  { required: true, message: '请填写枪号' },
                  { validator: toNumber, message: '请输入正整数' }
                ]"
                label="枪号"
                :prop="'paramsList.' + index + '.gunNumPosition'"
              >
                <el-input
                  v-model="item.gunNumPosition"
                  placeholder="请输入"
                  clearable
                  size="small"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item
                :rules="[{ required: true, message: '请填写参数值' }]"
                label="参数值"
                :prop="'paramsList.' + index + '.gunParameter'"
              >
                <el-input
                  v-model="item.gunParameter"
                  placeholder="请输入"
                  clearable
                  size="small"
                />
                <!-- <el-button
              icon="el-icon-delete"
              class="btn"
              @click="delectparams(index)"
            ></el-button> -->
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button
                icon="el-icon-delete"
                class="btn"
                @click="delectparams(index)"
              ></el-button>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button
              size="mini"
              icon="el-icon-add"
              style="margin-left:290px"
              @click="addParams"
            >
              新增
            </el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="down">下发</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import { list} from "@/api/monitor/operlog";
// import {toIssue,list} from "@/api/remotecontrol/chargingpile/remotecontrol.js"
import {
  toIssue,
  getChargGroupCode,
  getEquipment,
  list
} from '@/api/remotecontrol/chargingpile/remotecontrol.js'

export default {
  name: 'Communication',

  data() {
    var toNumber = (rule, value, callback) => {
      var str = /^[1-9]+[0-9]*$/
      if (!str.test(value)) {
        callback(new Error('请输入正整数'))
      } else {
        callback()
      }
    }
    return {
      toNumber: toNumber,
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
      // 参数列表
      paramsList: [],
      //   网点列表
      outletslist: [
        { value: '1', label: '网点1' },
        { value: '2', label: '网点2' },
        { value: '3', label: '网点3' }
      ],
      //   设备名称列表
      namelist: [],
      // 参数类型
      paramstype: [
        { value: '2', label: '设置充电机启停' },
        { value: '3', label: '设置输出功率' },
        { value: '4', label: '设置单体最高允许电压' },
        { value: '5', label: '设置单体最高允许温度' },
        { value: '6', label: '设置语音提示功能启停' },
        { value: '7', label: '设置充电设备服务启停' }
      ],
      //   判断是否可点击
      toconfig: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        thename: '',
        code: '',
        outlets: '',
        businessType: undefined
      },
      //
      timevalue: '',
      dialogform: {
        paramstype: '',
        timevalue: '',
        paramsList: [{}]
      },
      //   校验
      rules: {
        paramstype: [
          { required: true, message: '请选择参数类型', trigger: 'change' }
        ],
        gunNumPosition: [
          { required: true, message: '请输入枪号', trigger: 'blur' }
        ]
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
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true
      this.form = row
    },
    /** 点击配置按钮 */
    configure() {
      this.dialogform = {
        paramstype: '',
        timevalue: '',
        paramsList: [{}]
      }
      this.open = true
    },
    cancel() {
      this.open = false
    },
    // 点击下发
    down() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let obj = {}
          obj.deviceList = this.issueList
          obj.parameterType = this.dialogform.paramstype
          obj.gunNumList = this.dialogform.paramsList
          toIssue(obj).then((res) => {
            if (res.code == 200) {
              this.$message({ message: res.message, type: 'success' })
            }
          })
          this.open = false
        }
      })
    },
    // 点击删除
    delectparams(index) {
      if (this.dialogform.paramsList.length > 1) {
        this.dialogform.paramsList.splice(index, 1)
      } else {
        this.$message({
          type: 'warning',
          message: '已经是最后一条'
        })
      }
    },
    // 点击新增
    addParams() {
      let id
      if (this.dialogform.paramsList.length >= 1) {
        let len = this.dialogform.paramsList.length - 1
        id = this.dialogform.paramsList[len].id + 1
      } else {
        id = 0
      }
      this.dialogform.paramsList.push({
        id: id,
        gunNumPosition: '',
        gunParameter: ''
      })
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
::v-deep .el-input--suffix .el-input__inner {
  padding-right: 1.25rem !important;
}
</style>
