<!--
机器人复位
-->
<template>
  <div class="app-container" style="">
    <!-- <el-card> -->
    <div class="card">
      <el-form ref="form" :model="queryParams" label-width="120px" size="small">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item prop="outlets" label="网点名称">
              <el-select
                v-model="queryParams.outlets"
                placeholder="请选择网点"
                clearable
                size="small"
                style="width: 200px"
                @change="getRobotName"
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
            <el-form-item prop="name" label="机器人名称">
              <el-select
                v-model="queryParams.name"
                placeholder="请选择机器人名称"
                clearable
                size="small"
                style="width: 200px"
                @change="getCode"
              >
                <el-option
                  v-for="dict in namelist"
                  :key="dict.robotId"
                  :label="dict.robotName"
                  :value="dict.robotId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="code" label="机器人编号">
              <el-input
                v-model="queryParams.code"
                placeholder="请输入机器人编号"
                clearable
                style="width: 240px"
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
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
    <el-card style="margin-top:10px">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            size="mini"
            @click="configure"
            :disabled="toconfig"
            type="primary"
            >复位</el-button
          >
        </el-col>
      </el-row>
      <el-table
        ref="Table"
        border
        :stripe="true"
        :header-cell-style="tableHeaderStyle"
        :data="newlist"
        @selection-change="handleSelectionChange"
        @current-change="currentChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="网点名称"
          align="center"
          prop="chargGroupName"
        />
        <el-table-column
          label="充电机器人名称"
          align="center"
          prop="robotName"
        />
        <el-table-column
          label="充电机器人编号"
          align="center"
          prop="assetNum"
        />
        <el-table-column
          label="所属充电设备编号"
          align="center"
          prop="chargeAssetNum"
        />
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>

<script>
import {
  list,
  resetOperation,
  getChargGroupCode,
  getRobotList
} from '@/api/remotecontrol/remotecontrol/robotreset.js'

export default {
  name: 'Heartinfor',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示查询条件
      showSearch: true,
      // 总条数
      total: 0,
      newlist: [],
      // 类型数据字典
      typeOptions: [],
      // 类型数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      //充电设备类型
      outletslist: [],
      //   设备名称列表名称
      namelist: [],
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
      timevalue: '',
      // 下发数组
      issueList: []
    }
  },
  watch: {
    'queryParams.outlets'() {
      // let that = this
      // getRobotList({ chargGroupId: that.queryParams.outlets - 0 }).then(
      //   (res) => {
      //     this.namelist = res.data.result
      // this.queryParams.name = this.namelist[0].robotName
      // this.queryParams.code = this.namelist[0].robotId
      // }
      // )
      // getEquipment({recSiteNum:that.queryParams.outlets}).then((res)=>{
      //     this.namelist = res.data.result
      //     this.queryParams.name = this.namelist[0].chargName
      //     this.queryParams.code = this.namelist[0].chargId
      // })
    }
  },
  created() {
    getChargGroupCode().then((res) => {
      this.outletslist = res.data.result
    })
    this.getList()
  },
  methods: {
    getCode(e) {
      this.queryParams.code = this.namelist.filter((item) => {
        return item.robotId == e
      })[0].assetNum
    },
    //查询机器人名称
    getRobotName(e) {
      let obj = {
        chargGroupId: e
      }
      getRobotList(obj).then((res) => {
        this.namelist = res.data.result
      })
      this.$forceUpdate()
    },
    /** 查询*/
    getList() {
      this.loading = true
      let obj = {}
      if (this.queryParams.outlets !== '') {
        obj.chargGroupId = this.queryParams.outlets
        obj.robotName = this.queryParams.name
          ? this.namelist.filter(
              (item) => item.robotId == this.queryParams.name
            )[0].robotName
          : ''
        obj.assetNum = this.queryParams.code
      }
      obj.pageNum = this.queryParams.pageNum
      obj.pageSize = this.queryParams.pageSize
      list(obj).then((res) => {
        this.loading = false
        this.newlist = res.data.result.records
        this.total = res.data.result.total || 0
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
        name: '',
        code: ''
      }
      this.handleQuery()
    },
    // 复选框选中数据
    handleSelectionChange(val) {
      this.issueList = val
      if (val.length > 1) {
        this.$refs.Table.clearSelection()
        this.$refs.Table.toggleRowSelection(val.pop())
      }
      this.toconfig = val.length == 1 ? false : true
    },
    currentChange(currentRow, oldCurrentRow) {
      this.$refs.Table.toggleRowSelection(currentRow)
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true
      this.form = row
    },
    /** 点击复位按钮 */
    configure() {
      this.open = true
      let obj = {}
      obj.robotName = this.issueList[0].robotName
      obj.robotId = this.issueList[0].robotId
      obj.chargId = this.issueList[0].chargId
      obj.chargGroupName = this.issueList[0].chargGroupName
      obj.chargeAssetNum = this.issueList[0].chargeAssetNum
      obj.assetNum = this.issueList[0].assetNum
      resetOperation(obj).then((res) => {
        if (res.code == 200) {
          this.$message({ message: res.message, type: 'success' })
        } else {
          this.$message({ message: res.message, type: 'warning' })
        }
      })
    },
    // 点击下发
    down() {}
  }
}
</script>
<style lang="scss" scoped>
thead .el-table-column--selection .cell {
  display: none;
}
</style>
