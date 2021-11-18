<template>
  <div class="app-container">
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
            <el-form-item prop="inspectionType" label="巡检类型">
              <el-select
                v-model="queryParams.inspectionType"
                placeholder="请选择巡检类型"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in inspectionTypeList"
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
            <el-form-item prop="inspector" label="巡检人">
              <el-input
                v-model="queryParams.inspector"
                placeholder="请输入巡检人"
                clearable
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="chargState" label="设备情况">
              <el-select
                v-model="queryParams.chargState"
                placeholder="请选择设备情况"
                clearable
                size="small"
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
          <el-col :span="12">
            <el-form-item label="巡检日期">
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
      <!-- </el-card> -->
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
        <el-table-column label="巡检类型" align="center" prop="inspectionType">
          <template slot-scope="scope">
            {{
              scope.row.inspectionType === 0
                ? '日常巡检'
                : scope.row.inspectionType === 1
                ? '保养巡检'
                : '季度巡检'
            }}
          </template>
        </el-table-column>
        <el-table-column label="设备情况" align="center" prop="chargState">
          <template slot-scope="scope">
            {{ scope.row.chargState === 0 ? '故障' : '正常' }}
          </template>
        </el-table-column>
        <el-table-column label="设备信息" align="center" prop="chargName">
          <template slot-scope="scope">
            {{ scope.row.chargName }}({{ scope.row.assetsNum }})
          </template>
        </el-table-column>
        <el-table-column label="巡检人" align="center" prop="inspector" />
        <el-table-column
          label="巡检日期"
          align="center"
          prop="inspectionTime"
          width="200"
        />
        <el-table-column
          label="操作"
          align="center"
          width="160"
          fixed="right"
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
        :limit.sync="queryParams.limit"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import {
  getChargGroupCode,
  getEquipment
} from '@/api/maintenance/faultreporting/index'

import { getTypeList } from '@/api/maintenance/faultreporting/index'
import { getInspections } from '@/api/maintenance/inspectionorder/index'
export default {
  name: 'Heartinfor',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 搜索数据
      queryParams: {
        pageNum: 1,
        limit: 10,
        date: []
      },
      // 时间日期选择器
      value1: [new Date(), new Date()],
      // 总条数
      total: 0,
      // 巡检类型下拉列表
      inspectionTypeList: [
        // { value: '0', label: '日常巡检' },
        // { value: '1', label: '保养巡检' },
        // { value: '2', label: '季度巡检' }
      ],
      // 网点下拉选项
      outletslist: [],
      // 设备下拉列表
      equipment: [],
      // 下拉选项
      namelist: [
        { value: '0', label: '故障' },
        { value: '1', label: '正常' }
      ],
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
  created() {
    // 获取网点
    getChargGroupCode().then((res) => {
      this.outletslist = res.data.result
    })
    getTypeList().then((res) => {
      this.inspectionTypeList = res.data.result[3]
    })
    this.getList()
  },
  methods: {
    // 去详情页
    goDetail(row) {
      let id = row.jobCode
      this.$router.push({ path: `/airweb/maintenance/inspectdetail/${id}` })
      // this.$router.push("/maintenance/inspectdetail")
    },
    /** 查询初始页面列表*/
    getList() {
      this.loading = false
      let obj = {
        // jobCode: '', //工单编号
        // chargGroupId: null, //网点id
        // chargId: null, //设备id
        // inspector: '', //巡检人
        // chargState: '',
        // inspectionType: '', //巡检类型
        // startTime: '', //开始时间
        // endTime: '' //结束时间
      }
      obj.jobCode =
        this.queryParams.jobCode == '' ? '' : this.queryParams.jobCode
      obj.chargGroupId =
        this.queryParams.chargGroupId == '' ? '' : this.queryParams.chargGroupId
      obj.chargId = this.queryParams.chargId
      obj.chargState =
        this.queryParams.chargState === ''
          ? ''
          : this.queryParams.chargState - 0
      obj.inspector =
        this.queryParams.inspector == '' ? '' : this.queryParams.inspector
      obj.inspectionType = this.queryParams.inspectionType
      if (this.queryParams.date.length > 1) {
        obj.startTime = this.queryParams.date[0]
        // obj.startTime = moment(this.queryParams.date[0]).format('YYYY-MM-DD')
        obj.endTime = this.queryParams.date[1]
        // obj.endTime = moment(this.queryParams.date[1]).format('YYYY-MM-DD')
      }
      let params = {
        limit: this.queryParams.limit,
        page: this.queryParams.pageNum
      }
      // 搜索
      getInspections(obj, params).then((res) => {
        this.tableList = res.data === null ? [] : res.data.result.records
        this.total = res.data === null ? 0 : res.data.result.total
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        limit: 10,
        jobCode: '', //工单编号
        jobFrom: '', //工单来源
        chargGroupId: '', //网点id
        chargId: '', //设备id
        chargState: '',
        inspector: '', //报修人
        inspectionType: '',
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
