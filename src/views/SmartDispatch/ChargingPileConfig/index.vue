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
        <el-table-column type="index" align="center" label="序号" width="50">
        </el-table-column>
        <el-table-column label="车辆类型" align="center" prop="label1" />
        <el-table-column label="车辆用途" align="center" prop="label2" />
        <el-table-column
          label="车辆SOC剩余电量阈值（%）"
          align="center"
          prop="socType"
          width="200"
        >
          <template slot-scope="scope">
            {{ scope.row.socType }}{{ scope.row.socValue }}
          </template>
        </el-table-column>
        <el-table-column
          label="当前车辆产生告警是否允许充电"
          align="center"
          prop="alarmFlag"
          width="220"
        >
          <template slot-scope="scope">
            {{ scope.row.alarmFlag === 2 ? '否' : '是' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="effectType">
          <template slot-scope="scope">
            {{ scope.row.effectType === 1 ? '启用' : '停用' }}
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
        title="充电车辆阈值配置"
        :visible.sync="open"
        width="700px"
        append-to-body
      >
        <el-form
          ref="dialogform"
          :model="dialogform"
          align="left"
          :rules="rules"
        >
          <el-row>
            <el-col :span="12" class="error1">
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
            <el-col :span="12" class="error1">
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
          </el-row>
          <el-row>
            <el-row>
              <el-col>
                <div class="title">
                  <span class="spanicon"></span>
                  车辆充电阈值配置
                </div>
              </el-col>
            </el-row>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item
                label="剩余电量SOC"
                label-width="120px"
                prop="socValue"
                class="error2"
              >
                <span class="spantype">
                  小于
                </span>
                <span class="aa"
                  ><el-input v-model="dialogform.socValue"></el-input
                ></span>

                <span style="float:right;margin-right:10px">%</span>
                <div class="spanbox">
                  <div
                    class="el-icon-arrow-up spantop"
                    @click="addone(1)"
                  ></div>
                  <div
                    class="el-icon-arrow-down spanbottom"
                    @click="reduce(1)"
                  ></div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <div class="title">
                <span class="spanicon"></span>
                告警阈值配置
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="当前车辆产生告警是否允许充电"
                label-width="230px"
                prop="alarmFlag"
              >
                <!-- <el-radio-group v-model="dialogform.alarmFlag"> -->
                <!-- <el-radio-group v-model="dialogform.alarmFlag"> -->
                <el-radio v-model="dialogform.alarmFlag" label="1">是</el-radio>
                <el-radio v-model="dialogform.alarmFlag" label="2">否</el-radio>
                <!-- </el-radio-group> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <div class="title">
                <span class="spanicon"></span>
                任务超期中断配置
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="预定任务超期时长配置"
                label-width="170px"
                prop="interrupt"
              >
                <span class="spantype">
                  大于
                </span>
                <span class="aa"
                  ><el-input v-model="dialogform.interrupt"></el-input
                ></span>
                <span style="float:right">分钟</span>
                <div class="spanbox1">
                  <div
                    class="el-icon-arrow-up spantop"
                    @click="addone(2)"
                  ></div>
                  <div
                    class="el-icon-arrow-down spanbottom"
                    @click="reduce(2)"
                  ></div>
                </div>
                <!-- <span>分钟</span> -->
                <!-- 分钟 -->
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
import { mapGetters } from 'vuex'
import {
  getCarType,
  getCarRule,
  AddOrUpdateCarRule,
  delOneCarRule,
  updateOneCarRule,
  getCarTypeByCondition
} from '@/api/smartdispatch/chargingpileconfig/index'
export default {
  computed: {
    ...mapGetters(['dictInfo'])
  },
  data() {
    // 自定义0到100校验
    let soc = (rule, value, cb) => {
      let reg = /^(?:1|[1-9][0-9]?)$/
      if (!reg.test(value)) {
        cb(new Error('只能输入1到99'))
      } else {
        cb()
      }
    }
    // 自定义大于0校验
    let min = (rule, value, cb) => {
      let reg = /^[0-9]*[1-9][0-9]*$/
      if (!reg.test(value)) {
        cb(new Error('时间要大于0'))
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
      // 弹窗数据dialogform.alarmFlag
      dialogform: {
        userBroaHead: '',
        userSubcHead: '',
        socValue: '0',
        effectType: '',
        alarmFlag: 2,
        interrupt: '0'
      },
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
      SOCList: [
        { value: '1', label: '0-10%' },
        { value: '2', label: '10-20%' },
        { value: '3', label: '20-30%' },
        { value: '1', label: '30-40%' },
        { value: '2', label: '40-50%' },
        { value: '3', label: '50-60%' },
        { value: '1', label: '60-70%' },
        { value: '2', label: '70-80%' },
        { value: '3', label: '80-90%' }
      ],
      // 列表数据
      newlist: [],
      filterObj: {},
      // 校验规则
      rules: {
        userBroaHead: [
          { required: true, message: '请选择车辆类型', trigger: 'blur' }
        ],
        userSubcHead: [
          { required: true, message: '请选择车辆用途', trigger: 'blur' }
        ],
        socValue: [
          { required: true, message: '请输入soc', trigger: 'blur' },
          { validator: soc, trigger: 'blur' }
        ],
        effectType: [
          { required: true, message: '请选择是否允许', trigger: 'blur' }
        ],
        alarmFlag: [
          { required: true, message: '请选择是否允许', trigger: 'blur' }
        ],
        interrupt: [
          { required: true, message: '请配置时间', trigger: 'blur' },
          { validator: min, trigger: 'blur' }
        ]
      }
    }
  },
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
      if (that.dialogform.userBroaHead === '') {
        that.useforList = []
      }
      //  else {
      //   that.useforList = this.typeList.filter((item) => {
      //     return item.userBroaHead == that.dialogform.userBroaHead
      //   })[0].carsList
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
    // 选择车辆类型
    selected(e) {
      // if (e) {
      //   this.useforList = this.typeList.filter((item) => {
      //     return item.userBroaHead == this.dialogform.userBroaHead
      //   })[0].carsList
      // }
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
    },
    // 增加
    addone(num) {
      if (num == 1) {
        this, this.dialogform.socValue++
      } else {
        this, this.dialogform.interrupt++
      }
    },
    // 减少
    reduce(num) {
      if (num == 1) {
        this, this.dialogform.socValue--
      } else {
        this, this.dialogform.interrupt--
      }
    },
    // 获取列表数据
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
      getCarRule(obj, params).then((res) => {
        this.newlist = res.data.result.records
        this.total = res.data.result.total
      })
      this.loading = false
    },
    // 删除按钮
    deleted(row) {
      delOneCarRule(row.id).then((res) => {
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
    // 编辑按钮
    edit(row) {
      this.isdisabled = true
      this.dialogform = {
        userBroaHead: '',
        userSubcHead: '',
        socValue: '',
        effectType: '',
        alarmFlag: '',
        interrupt: ''
      }
      this.dialogform.userBroaHead = row.userBroaHead
      this.dialogform.userSubcHead = row.userSubcHead
      this.dialogform.socValue = row.socValue
      this.dialogform.alarmFlag = row.alarmFlag + ''
      this.dialogform.interrupt = row.interrupt
      this.dialogform.effectType = row.effectType == 1 ? true : false
      this.dialogform.id = row.id
      this.open = true
      if (row.userBroaHead) {
        this.useforList = this.typeList.filter((item) => {
          return item.userBroaHead == row.userBroaHead
        })[0].carsList
      }
    },
    // 新增按钮
    add() {
      this.isdisabled = false
      this.dialogform = {
        userBroaHead: '',
        userSubcHead: '',
        socValue: '',
        effectType: '',
        alarmFlag: '2',
        interrupt: ''
      }
      getCarTypeByCondition({ type: 'carRule' }).then((res) => {
        this.filterObj = res.data.result
      })
      this.open = true
    },
    // 失效，停用
    change(row) {
      let obj = {}
      obj.id = row.id
      obj.effectType = row.effectType === 1 ? 0 : 1
      updateOneCarRule(obj).then((res) => {
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

    handleQuery() {
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
    // 保存按钮
    save() {
      this.$refs['dialogform'].validate((valid) => {
        if (valid) {
          AddOrUpdateCarRule(this.dialogform).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.getList()
              this.cancel()
            }
          })
        }
      })
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
.aa .el-input__inner {
  width: 50px;
  padding: 0;
}
.aa .el-input {
  width: 3.125rem;
  padding: 0;
}
.spantype {
  width: 20px;
  padding: 5px;
  background: white;
  clear: both;
}
.spanbox {
  border: 1px solid #c4c6cf;
  height: 30px;
  display: flex;
  flex-direction: column;
  float: right;
  width: 30px;
  position: absolute;
  top: 3px;
  right: 19.5%;
  .spantop {
    text-align: center;
    height: 15px;
    border-bottom: 1px solid #c4c6cf;
  }
  .spanbottom {
    text-align: center;
    height: 15px;
  }
}
.spanbox1 {
  border: 1px solid #c4c6cf;
  height: 30px;
  display: flex;
  flex-direction: column;
  float: right;
  width: 30px;
  position: absolute;
  top: 4px;
  right: 23.5%;
  .spantop {
    text-align: center;
    height: 15px;
    border-bottom: 1px solid #c4c6cf;
  }
  .spanbottom {
    text-align: center;
    height: 15px;
  }
}
.error1 {
  .el-form-item__error {
    left: 24%;
  }
}
.error2 {
  .el-form-item__error {
    left: 30%;
  }
}
</style>
