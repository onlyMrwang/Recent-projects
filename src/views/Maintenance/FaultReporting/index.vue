<!--
心跳包信息设置
-->
<template>
  <div class="app-container" style="">
    <div class="card">
      <el-form ref="form" :model="queryParams" label-width="110px" size="small">
        <el-row :gutter="10">
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
        <el-row :gutter="10">
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
              <!-- <el-date-picker
                v-model="queryParams.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker> -->
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
    </div>

    <div class="card boxtable">
      <el-table
        ref="table"
        border
        :stripe="true"
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
        <el-table-column
          label="工单来源"
          align="center"
          prop="jobFrom"
          width="200"
        >
          <template slot-scope="scope">
            {{ form(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          label="组织机构"
          align="center"
          prop="orgName"
          width="200"
        />
        <el-table-column
          label="网点信息"
          align="center"
          prop="chargGroupName"
          width="150"
        />
        <el-table-column
          label="工单状态"
          align="center"
          prop="jobState"
          width="200"
        >
          <template slot-scope="scope">
            {{ jobState(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          label="充电设备"
          align="center"
          prop="chargName"
          width="200"
        >
          <template slot-scope="scope">
            {{ scope.row.chargName }}({{ scope.row.assetsNum }})
          </template>
        </el-table-column>
        <el-table-column
          label="充电机器人"
          align="center"
          prop="mainRoboot"
          width="130"
        >
          <template slot-scope="scope">
            {{
              scope.row.mainRoboot === null
                ? '--'
                : getName(scope.row.mainRoboot)
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="故障内容"
          align="center"
          prop="faultDesc"
          width="240"
        />
        <el-table-column
          label="报修人"
          align="center"
          prop="inspector"
          width="200"
        />
        <el-table-column
          label="上报日期"
          align="center"
          prop="createTime"
          width="200"
        />
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          width="160"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="goDetail(scope.row)"
              >详情</el-button
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
  </div>
</template>

<script>
import {
  getFaults,
  getChargGroupCode,
  getEquipment,
  getTypeList
} from '@/api/maintenance/faultreporting/index'
import { getRobotName } from '@/api/remotecontrol/remotecontrol/resetlogs'
export default {
  name: 'Heartinfor',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 搜索数据
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jobCode: '', //工单编号
        jobFrom: '', //工单来源
        chargGroupId: '', //网点id
        chargId: '', //设备id
        inspector: '', //报修人
        date: []
      },
      // 时间日期选择
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      // 总条数
      total: 0,
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
      // table数据
      tableList: []
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
          return ''
        }
      }
    },
    // 获取机器人名称
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
      this.jobFromList = res.data.result[2]
    })
    this.getList()
  },
  methods: {
    // 去详情页
    goDetail(row) {
      let id = row.jobCode
      this.$router.push({ path: `/airweb/maintenance/faultdetail/${id}` })
    },
    /** 查询初始页面列表*/
    getList() {
      this.loading = false
      let obj = {
        jobCode: '', //工单编号
        jobFrom: null, //工单来源
        chargGroupId: null, //网点id
        chargId: null, //设备id
        inspector: '', //报修人
        startTime: '', //开始时间
        endTime: '' //结束时间
      }

      obj.jobCode =
        this.queryParams.jobCode == '' ? '' : this.queryParams.jobCode
      obj.jobFrom = this.queryParams.jobFrom
      obj.chargGroupId =
        this.queryParams.chargGroupId == '' ? '' : this.queryParams.chargGroupId
      obj.chargId =
        this.queryParams.chargId == '' ? '' : this.queryParams.chargId
      obj.inspector =
        this.queryParams.inspector == '' ? '' : this.queryParams.inspector
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
      getFaults(obj, params).then((res) => {
        this.tableList = res.data === null ? [] : res.data.result.records
        this.total = res.data === null ? 0 : res.data.result.total
      })
    },
    /** 搜索按钮操作 */

    handleQuery() {
      // if (
      //   this.queryParams.jobCode ||
      //   this.queryParams.jobFrom ||
      //   this.queryParams.chargGroupId ||
      //   this.queryParams.chargId ||
      //   this.queryParams.inspector
      // ) {
      this.getList()
      // } else {
      //   this.$message({
      //     type: 'warning',
      //     message: '请输入查询条件进行查询'
      //   })
      // }
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
    }
  }
}
</script>
<style lang="scss" scoped>
.boxtable {
  min-height: calc(100vh - 150px);
  overflow: auto;
  margin-top: 10px;
}
</style>
