<!--
心跳包信息设置
-->
<template>
  <div class="app-container" style="">
    <div class="card">
      <el-form ref="form" :model="queryParams" label-width="80px" size="small">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item prop="jobCode" label="工单编号">
              <el-input
                v-model="queryParams.jobCode"
                placeholder="请输入工单编号"
                clearable
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="jobFrom" label="工单来源">
              <el-select
                v-model="queryParams.jobFrom"
                placeholder="请选择工单来源"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in jobFromList"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="chargGroupId" label="充电网点">
              <el-select
                v-model="queryParams.chargGroupId"
                placeholder="请选择充电网点"
                clearable
                size="small"
              >
                <el-option
                  v-for="item in outletslist"
                  :key="item.chargGroupId"
                  :label="item.chargGroupName"
                  :value="item.chargGroupId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="chargId" label="充电设备">
              <el-select
                v-model="queryParams.chargId"
                :placeholder="
                  queryParams.chargGroupId
                    ? '请选择充电设备'
                    : '请先选择充电网点'
                "
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in equipment"
                  :key="dict.chargId"
                  :label="dict.chargName"
                  :value="dict.chargId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item prop="inspector" label="报修人">
              <el-input
                v-model="queryParams.inspector"
                placeholder="请输入报修人"
                clearable
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="jobState" label="工单状态">
              <el-select
                v-model="queryParams.jobState"
                placeholder="请选择工单状态"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in jobStateList"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报日期">
              <el-date-picker
                popper-class="dateRange"
                v-model="queryParams.date"
                type="datetimerange"
                start-placeholder="开始日期"
                range-separator="至"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col align="right">
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

    <div class="card boxtable">
      <el-table
        ref="table"
        border
        :header-cell-style="tableHeaderStyle"
        :data="tableList"
      >
        <el-table-column
          label="工单编号"
          align="center"
          prop="jobCode"
          fixed
          width="230"
        />
        <el-table-column label="工单来源" align="center" prop="jobFrom" fixed>
          <template slot-scope="scope">
            {{ form(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="工单状态" align="center" prop="jobState">
          <template slot-scope="scope">
            {{ jobState(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          label="组织机构"
          align="center"
          prop="orgName"
          width="150"
        />
        <el-table-column
          label="充电网点"
          align="center"
          prop="chargGroupName"
        />
        <el-table-column label="充电设备" align="center" prop="chargName">
          <template slot-scope="scope">
            {{ scope.row.chargName }}({{ scope.row.assetsNum }})
          </template>
        </el-table-column>
        <el-table-column
          label="充电机器人"
          align="center"
          prop="robot"
          width="150"
        >
          <template slot-scope="scope">
            {{
              scope.row.mainRoboot === null
                ? '--'
                : getName(scope.row.mainRoboot)
            }}
          </template>
        </el-table-column>
        <el-table-column label="报修人" align="center" prop="inspector" />
        <el-table-column label="处理组" align="center" prop="handleOrgName" />
        <el-table-column
          label="上报日期"
          align="center"
          prop="createTime"
          width="200"
        />
        <el-table-column
          label="处理日期"
          align="center"
          prop="handleTime"
          width="200"
        />
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          width="200"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              class="btn1"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="goDetail(scope.row)"
              >详情</el-button
            >
            <el-button
              class="btn1"
              v-if="scope.row.jobState == 1 ? true : false"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="receive(scope.row)"
              >接收</el-button
            >
            <!-- v-if="scope.row.jobState == 2 ? true : false" -->
            <el-button
              v-if="scope.row.jobState == 2 ? true : false"
              class="btn1"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handle(scope.row)"
              >处理</el-button
            >
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
    <div v-if="open">
      <el-dialog title="工单处理" :visible.sync="open" width="700px">
        <el-form
          ref="dialogform"
          label-width="150px"
          size="small"
          :rules="rules"
          :model="dialogForm"
        >
          <el-row>
            <el-col :span="15">
              <el-form-item label="故障等级" prop="failureLevel">
                <el-select
                  v-model="dialogForm.failureLevel"
                  placeholder="请选择故障等级"
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
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="处理方式" prop="radio">
                <el-checkbox-group v-model="dialogForm.radio">
                  <el-checkbox :label="0">现场处理</el-checkbox>
                  <el-checkbox :label="1">更换器件</el-checkbox>
                  <el-checkbox :label="2">返厂维修</el-checkbox>
                </el-checkbox-group>
                <!-- <el-radio-group v-model="dialogForm.radio">
                  <el-radio :label="0">现场处理</el-radio>
                  <el-radio :label="1">更换器件</el-radio>
                  <el-radio :label="2">返厂维修</el-radio>
                </el-radio-group> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="故障原因及现场工作描述" prop="faultDesc">
                <textarea
                  v-model="dialogForm.faultDesc"
                  class="text"
                  placeholder="故障原因：故障原故因故障原因故障原因故障原因故障原因故障原因。现场工作描述：故障原因故障原因故障原因故障原因"
                ></textarea>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="设备情况" prop="deviceDesc">
                <textarea
                  class="text"
                  v-model="dialogForm.deviceDesc"
                  placeholder="例：XX桩存在故障，需维修"
                ></textarea>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="下一步工作计划" prop="nextWorkPlan">
                <textarea
                  v-model="dialogForm.nextWorkPlan"
                  class="text"
                  placeholder="例：巡检时候，注意紧固CPU板"
                ></textarea>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="附件">
                <el-upload
                  :action="upload.url + '/' + dialogForm.id"
                  list-type="picture-card"
                  :headers="upload.headers"
                  :on-change="imgChange"
                  :on-success="uploadSuccess"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :auto-upload="true"
                  multiple
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="" />
                </el-dialog>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getChargGroupCode,
  getEquipment
} from '@/api/maintenance/faultreporting/index'
import { getTypeList } from '@/api/maintenance/faultreporting/index'
import {
  getRepairs,
  updateOrder,
  updateRepair,
  delUrl
} from '@/api/maintenance/repairorder/index'
import { moment } from 'moment'
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 搜索数据
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        date: []
      },
      dialogImageUrl: '',
      dialogVisible: false,
      // 总条数
      total: 0,
      // 时间
      value1: '',
      // 弹框显示
      open: false,
      // 弹框form数据
      dialogForm: {
        deviceDesc: '',
        sysFile: [],
        radio: []
      },
      rules: {
        deviceDesc: [
          { required: true, message: '请输入设备情况', trigger: 'blur' }
        ],
        failureLevel: [
          { required: true, message: '请选择故障等级', trigger: 'change' }
        ],
        radio: [
          { required: true, message: '请选择处理方式', trigger: 'change' }
        ],
        faultDesc: [
          { required: true, message: '请填写故障描述', trigger: 'change' }
        ],
        nextWorkPlan: [
          { required: true, message: '请填写下一步工作计划', trigger: 'change' }
        ]
      },
      placeholder:
        '故障原因：故障原因故障原因故障原因故障原因故障原因故障原因故障原因故障原因故障原因',
      // 下拉选项
      namelist: [
        { value: '1', label: '1级' },
        { value: '2', label: '2级' },
        { value: '3', label: '3级' }
      ],
      // 工单来源
      jobFromList: [
        // { value: '0', label: '自建' },
        // { value: '1', label: '客服派单' },
        // { value: '2', label: '转派' },
        // { value: '3', label: '告警' },
        // { value: '4', label: '预警' }
      ],
      // 网点下拉选项
      outletslist: [],
      // 设备下拉列表
      equipment: [],
      // 工单状态下拉列表
      jobStateList: [
        // { value: '0', label: '创建' },
        // { value: '1', label: '已上报' },
        // { value: '2', label: '处理中' },
        // { value: '3', label: '已完结' }
      ],
      id: null,
      // table数据
      tableList: [],
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        // 上传的地址
        url: `/app/maintenance/workOrder/uploadImg`
      }
    }
  },
  watch: {
    'queryParams.chargGroupId'() {
      let that = this
      if (that.queryParams.chargGroupId) {
        getEquipment({ chargGroupId: that.queryParams.chargGroupId }).then(
          (res) => {
            this.equipment = res.data.result
          }
        )
      } else {
        this.queryParams.chargId = ''
        this.equipment = []
      }
    },
    'queryParams.date'(newVal, oldval) {
      if (newVal == null) {
        this.queryParams.date = []
      }
    }
  },
  computed: {
    // 状态
    jobState() {
      return function(row) {
        if (row.jobState == 0) {
          return '已提交'
        } else if (row.jobState == 1) {
          return '已上报  '
        } else if (row.jobState == 2) {
          return '处理中'
        } else {
          return '已完结'
        }
      }
    },
    // 来源
    form() {
      return function(row) {
        if (row.jobFrom == 0) {
          return '自建'
        } else if (row.jobFrom == 1) {
          return '客服派单'
        } else if (row.jobFrom == 2) {
          return '转派'
        } else if (row.jobFrom == 3) {
          return '告警'
        } else {
          return '预警'
        }
      }
    },
    // 机器人名称
    getName() {
      return function(list) {
        if (list) {
          let RobotName = ''
          for (let i = 0; i <= list.length - 1; i++) {
            if (i !== list.length) {
              RobotName += `${list[i].robotName}(${list[i].assetNum})`
            } else {
              RobotName += `${list[i].robotName}(${list[i].assetNum}),`
            }
          }
          return RobotName
        }
      }
    }
  },
  created() {
    // 获取网点
    getChargGroupCode().then((res) => {
      this.outletslist = res.data.result
    })
    getTypeList().then((res) => {
      this.jobFromList = res.data.result[1]
      this.jobStateList = res.data.result[4]
    })
    this.getList()
  },
  methods: {
    // getName(obj) {
    //   let object
    //   if (obj.mainRoboot == null) {
    //     object = 11111
    //     return object
    //   } else {
    //     object = JSON.parse(JSON.stringify(obj.mainRoboot))
    //     return object.robotName == null ? 1 : object.robotName
    //   }
    // },
    // 去详情页
    goDetail(row) {
      let code = row.jobCode
      this.$router.push({ path: `/airweb/maintenance/repairdetail/${code}` })
    },
    /** 查询初始页面列表*/
    getList() {
      this.loading = false
      let obj = {
        jobCode: '', //工单编号
        jobFrom: '', //工单来源
        chargGroupId: '', //网点id
        chargId: '', //设备id
        inspector: '', //报修人
        jobState: '',
        startTime: '', //开始时间
        endTime: '' //结束时间
      }
      console.log(this.queryParams.jobFrom)
      obj.jobCode =
        this.queryParams.jobCode === '' ? '' : this.queryParams.jobCode
      obj.jobFrom =
        this.queryParams.jobFrom === '' ? '' : this.queryParams.jobFrom
      obj.chargGroupId =
        this.queryParams.chargGroupId === ''
          ? ''
          : this.queryParams.chargGroupId
      obj.chargId =
        this.queryParams.chargId === '' ? '' : this.queryParams.chargId
      obj.jobState = this.queryParams.jobState
      obj.inspector =
        this.queryParams.inspector === '' ? '' : this.queryParams.inspector
      if (this.queryParams.date.length > 1) {
        obj.startTime = this.queryParams.date[0]
        // obj.startTime = moment(this.queryParams.date[0]).format('YYYY-MM-DD')
        obj.endTime = this.queryParams.date[1]
        // obj.endTime = moment(this.queryParams.date[1]).format('YYYY-MM-DD')
      }
      let params = {
        limit: this.queryParams.pageSize,
        page: this.queryParams.pageNum
      }
      // 搜索
      getRepairs(obj, params).then((res) => {
        this.tableList = res.data === null ? [] : res.data.result.records
        this.total = res.data === null ? 0 : res.data.result.total
      })
    },
    // 处理
    handle(row) {
      this.id = null
      this.id = row.id
      this.dialogForm.jobCode = row.jobCode
      this.dialogForm.id = row.id
      this.dialogForm.jobState = row.jobState
      this.open = true
    },
    // 接收
    receive(row) {
      this.open = true
      this.id = null
      this.id = row.id
      if (row.jobState == 1) {
        updateOrder(row.id, 1).then((res) => {})
      }
      this.dialogForm.jobCode = row.jobCode
      this.dialogForm.jobState = row.jobState
      this.dialogForm.id = row.id
      this.open = true
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        jobCode: '', //工单编号
        jobFrom: '', //工单来源
        chargGroupId: '', //网点id
        chargId: '', //设备id
        inspector: '', //报修人
        date: []
      }
      this.getList()
    },
    // 保存按钮
    save() {
      this.$refs['dialogform'].validate((valid) => {
        if (valid) {
          let params = {
            jobCode: this.id,
            jobState: 2
          }
          let obj = {}
          obj.handleType = 2
          obj.failureLevel = this.dialogForm.failureLevel
          obj.handleMethodList = this.dialogForm.radio
          obj.faultDesc = this.dialogForm.faultDesc
          obj.deviceDesc = this.dialogForm.deviceDesc
          obj.nextWorkPlan = this.dialogForm.nextWorkPlan
          obj.imgList =
            this.dialogForm.sysFile.length > 0 ? this.dialogForm.sysFile : []
          obj.jobId = this.dialogForm.id
          updateRepair(obj, params).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: res.message
              })
            }
          })
          this.cancel()
        }
      })
    },
    // 提交按钮
    submit() {
      this.$refs['dialogform'].validate((valid) => {
        if (valid) {
          let params = {
            jobCode: this.id,
            jobState: 3
          }
          let obj = {}
          obj.handleType = 3
          obj.failureLevel = this.dialogForm.failureLevel
          obj.handleMethodList = this.dialogForm.radio
          obj.faultDesc = this.dialogForm.faultDesc
          obj.deviceDesc = this.dialogForm.deviceDesc
          obj.nextWorkPlan = this.dialogForm.nextWorkPlan
          obj.imgList =
            this.dialogForm.sysFile.length > 0 ? this.dialogForm.sysFile : []
          obj.jobId = this.dialogForm.id
          updateRepair(obj, params).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: res.message
              })
            }
          })
          this.cancel()
        }
      })
    },
    // 取消
    cancel() {
      this.open = false
    },
    // 上传成功时调用
    uploadSuccess(res, file, filelist) {
      if (res.code == 200) {
        let arr = []
        filelist.forEach((item) => {
          arr.push(item.response.data.result)
        })
        this.dialogForm.sysFile = arr
        this.$message.success(res.message)
      }
    },
    // 状态钩子，文件上传成功或失败都会被调用
    imgChange() {},
    // 点击已上传时的钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 移除时的钩子
    handleRemove(file, filelist) {
      let obj = {}
      obj.imgUrl = file.response.data.result.fileAddre
      delUrl(obj).then(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  height: 13px;
}
::v-deep .v-modal {
  height: 0;
  width: 0;
}
table {
  font-size: 14px;
  border-collapse: collapse;
}
table,
table tr td {
  border: 1px solid #ccc;
}
table tr td {
  padding: 5px 10px;
}
.tdstyle {
  background: rgb(242, 246, 247);
}
// ::v-deep .el-radio-group {
//   display: flex;
//   justify-content: space-around;
// }
.divarea {
  width: 400px;
  min-height: 100px;
  max-height: 300px;
  _height: 100px; //IE6
  // margin-left: 1.5625rem;
  margin-right: auto;
  padding: 3px;
  outline: 0;
  border: 1px solid #a0b3d6;
  font-size: 12px;
  word-wrap: break-word;
  overflow-x: hidden;
  overflow-y: auto; //超过最大高度就出现滚动条
  _overflow-y: visible;
}
.text {
  width: 400px;
  min-height: 100px;
  max-height: 300px;
  _height: 100px; //IE6
  // margin-left: 1.5625rem;
  margin-right: auto;
  padding: 3px;
  outline: 0;
  border: 1px solid #a0b3d6;
  font-size: 12px;
  word-wrap: break-word;
  overflow-x: hidden;
  overflow-y: auto; //超过最大高度就出现滚动条
  _overflow-y: visible;
}
.boxtable {
  min-height: calc(100vh - 150px);
  overflow: auto;
  margin-top: 10px;
}
</style>
