<template>
  <div class="app-container" style="">
    <!-- <el-card> -->
    <div class="card">
      <el-form ref="form" :model="queryParams" label-width="120px" size="small">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item prop="type" label="车辆类型">
              <el-select
                v-model="queryParams.type"
                placeholder="请选择车辆类型"
                clearable
                size="small"
                style="width: 200px"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.userBroaHead"
                  :label="item.label"
                  :value="item.userBroaHead"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="usefor" label="车辆用途">
              <el-select
                v-model="queryParams.usefor"
                placeholder="请选择车辆用途"
                clearable
                size="small"
                style="width: 200px"
              >
                <el-option
                  v-for="item in useforList"
                  :key="item.userSubcHead"
                  :label="item.label"
                  :value="item.userSubcHead"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="name" label="状态">
              <el-select
                v-model="queryParams.name"
                placeholder="请选择状态"
                clearable
                size="small"
                style="width: 200px"
              >
                <el-option
                  v-for="item in stateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" align="right">
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
      <!-- </el-card> -->
    </div>

    <el-card style="margin-top:10px">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button size="mini" @click="add" type="primary">新增</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="table"
        border
        :stripe="true"
        :header-cell-style="tableHeaderStyle"
        :data="newlist"
      >
        <el-table-column type="index" align="center" label="序号" width="50" />
        <el-table-column label="车辆类型" align="center" prop="label1" />
        <el-table-column
          label="车辆用途"
          align="center"
          prop="label2"
          width="150"
        />
        <el-table-column label="剩余SOC（%）" align="center" prop="soc" />
        <el-table-column
          label="电池组额定电压"
          align="center"
          prop="batRatedVoltageScope"
          width="130"
        />
        <el-table-column
          label="充电功率权重(%)"
          align="center"
          prop="value2"
          width="130"
        />
        <el-table-column label="距离权重(%)" align="center" prop="value1" />
        <el-table-column label="费用权重(%)" align="center" prop="value3" />
        <el-table-column label="状态" align="center" prop="effectType">
          <template slot-scope="scope">
            {{ scope.row.effectType == 1 ? '启用' : '停用' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="230">
          <template slot-scope="scope">
            <el-button type="text" @click="deleted(scope.row)" class="btn1"
              >删除</el-button
            >
            <el-button type="text" @click="edit(scope.row)" class="btn1"
              >编辑</el-button
            >
            <el-button type="text" @click="change(scope.row)" class="btn1">
              {{ scope.row.effectType === 1 ? '停用' : '启用' }}
            </el-button>
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
    </el-card>

    <!-- 新增弹框 -->
    <div v-if="open">
      <el-dialog
        title="充电调度权重配置"
        :visible.sync="open"
        width="900px"
        append-to-body
      >
        <el-form :model="dialogform" ref="dialogform" :rules="rules">
          <el-row>
            <el-col :span="12" class="error1rule">
              <el-form-item label="车辆类型" prop="userBroaHead">
                <el-select
                  v-model="dialogform.userBroaHead"
                  placeholder="请选择车辆类型"
                  clearable
                  :disabled="isdisabled"
                  size="small"
                  style="width: 200px"
                  @change="selected($event)"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.userBroaHead"
                    :label="item.label"
                    :value="item.userBroaHead"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="error1rule">
              <el-form-item label="车辆用途" prop="userSubcHead">
                <el-select
                  v-model="dialogform.userSubcHead"
                  placeholder="请选择车辆用途"
                  clearable
                  :disabled="isdisabled"
                  size="small"
                  style="width: 200px"
                >
                  <el-option
                    v-for="item in useforList"
                    :key="item.userSubcHead"
                    :label="item.label"
                    :value="item.userSubcHead"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="error1" v-if="cartype == '3'">
              <el-form-item
                label="电池组额定电压范围"
                prop="batRatedVoltageScope"
              >
                <el-select
                  v-model="dialogform.batRatedVoltageScope"
                  placeholder="请选择额定电压范围"
                  clearable
                  :disabled="isdisabled"
                  size="small"
                  style="width: 200px"
                >
                  <el-option
                    v-for="item in batRatedList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="error1rule">
              <el-form-item label="剩余SOC(%)" prop="soc">
                <el-select
                  v-model="dialogform.soc"
                  placeholder="请选择"
                  clearable
                  :disabled="isdisabled"
                  size="small"
                  style="width: 200px"
                >
                  <el-option
                    v-for="item in SOCList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <div class="title">
                <span class="spanicon"></span>
                权重配置
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="各权重输入范围0-100%，且各权重值总和100%"
                  placement="right-start"
                >
                  <i class="el-icon-info"></i>
                  <!-- <el-button>右上</el-button> -->
                </el-tooltip>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="error2rule">
              <el-form-item label="距离权重(%)" prop="value1">
                <el-input
                  v-model="dialogform.value1"
                  placeholder=""
                  clearable
                  style="width: 200px"
                  size="small"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" class="error3rule">
              <el-form-item label="充电功率权重(%)" prop="value2">
                <el-input
                  v-model="dialogform.value2"
                  placeholder=""
                  clearable
                  style="width: 200px"
                  size="small"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" class="error2rule">
              <el-form-item label="费用权重(%)" prop="value3">
                <el-input
                  v-model="dialogform.value3"
                  placeholder=""
                  clearable
                  style="width: 200px"
                  size="small"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否立即生效" prop="effectType">
                <el-switch
                  v-model="dialogform.effectType"
                  active-text="是"
                  inactive-text="否"
                >
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getCarType } from '@/api/smartdispatch/chargingpileconfig/index'
import {
  getHardRule,
  AddOrUpdateHardRule,
  updateOneHardRule,
  delOneHardRule
} from '@/api/smartdispatch/ruleconfig/index'
import { getCarTypeByCondition } from '@/api/smartdispatch/chargingpileconfig/index'
export default {
  data() {
    // 自定义0到100校验
    let soc = (rule, value, cb) => {
      let reg = /^(?:0|[1-9][0-9]?|100)$/
      if (!reg.test(value)) {
        cb(new Error('只能输入0到100'))
      } else {
        cb()
      }
    }
    return {
      isdisabled: false,
      loading: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        usefor: ''
      },
      //
      value: '',
      dialogform: {
        userBroaHead: null,
        userSubcHead: null,
        value1: '',
        value2: '',
        value3: '',
        effectType: true,
        soc: '',
        batRatedVoltageScope: ''
      },
      // 车辆类型
      cartype: '',
      // spans空间
      spans: 8,
      //
      radio: '2',
      // dialog
      open: false,
      total: 0,
      // 车辆类型选项
      typeList: [],
      // 车辆用途选项
      useforList: [],
      // state
      stateList: [
        { value: '0', label: '停用' },
        { value: '1', label: '启用' }
      ],
      // 电压
      batRatedList: [
        { value: '50V-150V', label: '50V-150V' },
        { value: '200V以上', label: '200V以上' }
      ],
      SOCList: [
        { value: '0-10%', label: '0-10%' },
        { value: '10-20%', label: '10-20%' },
        { value: '20-30%', label: '20-30%' },
        { value: '30-40%', label: '30-40%' },
        { value: '40-50%', label: '40-50%' },
        { value: '50-60%', label: '50-60%' },
        { value: '60-70%', label: '60-70%' },
        { value: '70-80%', label: '70-80%' },
        { value: '80-90%', label: '80-90%' }
      ],
      // 是否自动清空
      isclear: true,
      filterObj: {},
      // 列表数据
      newlist: [],
      rules: {
        userBroaHead: [
          { required: true, message: '请选择车辆类型', trigger: 'change' }
        ],
        userSubcHead: [
          { required: true, message: '请选择车辆用途', trigger: 'change' }
        ],
        value1: [
          { validator: soc, trigger: 'blur' },
          { required: true, message: '请填写距离权重', trigger: 'change' }
        ],
        value2: [
          { validator: soc, trigger: 'blur' },
          { required: true, message: '请填写充电功率权重', trigger: 'change' }
        ],
        value3: [
          { validator: soc, trigger: 'blur' },
          { required: true, message: '请填写费用权重', trigger: 'change' }
        ],
        soc: [{ required: true, message: '请选择SOC', trigger: 'change' }],
        effectType: [
          { required: true, message: '请选择参数类型', trigger: 'change' }
        ]
      }
    }
  },
  // 监听
  watch: {
    open() {
      if (!this.open) {
        this.useforList = []
      }
    },
    'queryParams.type'() {
      let that = this
      if (that.queryParams.type === '') {
        that.useforList = []
      } else {
        this.queryParams.usefor = null

        that.useforList = this.typeList.filter((item) => {
          return item.userBroaHead == this.queryParams.type
        })[0].carsList
      }
    },
    'dialogform.userBroaHead'() {
      let that = this
      if (that.dialogform.userBroaHead === null) {
        that.useforList = []
      }
      // else {
      //   if (this.isclear) {
      //     this.dialogform.userSubcHead = null
      //   }
      //   that.useforList = this.typeList.filter((item) => {
      //     return item.userBroaHead == that.dialogform.userBroaHead
      //   })[0].carsList
      //   // that.useforList = that.typeList[that.dialogform.userBroaHead].carsList
      // }
    }
  },
  created() {
    getCarType().then((res) => {
      this.typeList = res.data.result
    })
    this.getList()
  },
  methods: {
    // 选中车辆类型
    selected(e) {
      if (e) {
        this.useforList = this.typeList.filter((item) => {
          return item.userBroaHead == this.dialogform.userBroaHead
        })[0].carsList
      } else {
        this.useforList = []
        this.dialogform.userSubcHead = ''
      }
      for (let i = 0; i <= this.filterObj.subHead.length - 1; i++) {
        this.useforList = this.useforList.filter((el) => {
          return this.filterObj.subHead[i] !== el.userSubcHead
        })
      }
      this.cartype = e
      this.spans = e === 3 ? 12 : 8
    },
    // 删除按钮
    deleted(row) {
      this.loading = true
      delOneHardRule(row.id).then((res) => {
        this.loading = false
        if (res.code === 200) {
          this.getList()
          this.$message({
            type: 'success',
            message: res.message
          })
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 编辑按钮
    edit(row) {
      this.isdisabled = true
      this.isclear = false
      this.cartype = ''
      this.dialogform = JSON.parse(JSON.stringify(row))
      if (row.userBroaHead) {
        this.useforList = this.typeList.filter((item) => {
          return item.userBroaHead == row.userBroaHead
        })[0].carsList
      }
      // this.dialogform.userSubcHead = this.dialogform.userSubcHead + ''
      this.dialogform.effectType =
        this.dialogform.effectType == 1 ? true : false
      if (row.label1 === '特种车') {
        this.cartype = '3'
      }
      this.open = true
    },
    // 失效，停用
    change(row) {
      this.loading = true
      let obj = {}
      obj.id = row.id
      obj.effectType = row.effectType === 0 ? 1 : 0
      updateOneHardRule(obj).then((res) => {
        this.loading = false
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.getList()
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    getList() {
      let obj = {}
      obj.userBroaHead =
        this.queryParams.type === '' ? '' : this.queryParams.type
      obj.userSubcHead =
        this.queryParams.usefor === '' ? '' : this.queryParams.usefor
      obj.effectType = this.queryParams.name === '' ? '' : this.queryParams.name
      let params = {
        page: this.queryParams.pageNum,
        limit: this.queryParams.pageSize
      }
      getHardRule(obj, params).then((res) => {
        this.newlist = res.data.result.records
        this.loading = false
        this.total = res.data.result.total
      })
    },
    // 搜索按钮
    handleQuery() {
      this.loading = true
      this.getList()
    },
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        usefor: ''
      }
      this.useforList = []
      this.getList()
    },
    add() {
      this.isdisabled = false
      this.cartype = ''
      this.dialogform = {
        userBroaHead: null,
        userSubcHead: '',
        value1: '',
        value2: '',
        value3: '',
        effectType: true,
        soc: '',
        batRatedVoltageScope: ''
      }
      getCarTypeByCondition({ type: 'hardRule' }).then((res) => {
        this.filterObj = res.data.result
      })
      this.open = true
    },
    // 保存按钮
    save() {
      if (
        this.dialogform.value1 -
          0 +
          (this.dialogform.value2 - 0) +
          (this.dialogform.value3 - 0) ==
        100
      ) {
        this.$refs['dialogform'].validate((valid) => {
          if (valid) {
            let obj = {}
            obj = this.dialogform
            obj.effectType = obj.effectType ? 1 : 0
            this.cartype = '1'
            AddOrUpdateHardRule(obj).then((res) => {
              if (res.code === 200) {
                this.getList()
                this.$message({
                  type: 'success',
                  message: res.message
                })
              } else {
                this.$message({
                  type: 'warning',
                  message: res.message
                })
              }
              this.cancel()
            })
          }
        })
      } else {
        this.$message({
          type: 'warning',
          message: '各权重值综合要为100%'
        })
      }
    },
    cancel() {
      this.open = false
    }
  }
}
</script>
<style lang="scss">
.title {
  font-size: 16px;
  color: #018196;
  .spanicon {
    width: 13px;
    height: 13px;
    display: inline-block;
    background: #018196;
    transform: rotate(45deg);
  }
}
.inputtype {
  width: 200px;
}
.spantype {
  width: 20px;
  padding: 5px;
  background: white;
}
.box {
  width: 110%;
  // background: skyblue;
  margin: 0 auto;
  display: flex;
  justify-content: space-evenly;
  font-size: 14px;
}
.error1rule {
  .el-form-item__error {
    left: 18%;
  }
}
.error2rule {
  .el-form-item__error {
    left: 24%;
  }
}
.error3rule {
  .el-form-item__error {
    left: 30%;
  }
}
</style>
