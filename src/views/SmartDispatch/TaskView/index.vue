<template>
  <div class="app-container" style="">
    <div class="card">
      <el-form ref="form" :model="queryParams" label-width="100px" size="small">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item prop="userBroaHead" label="车辆类型">
              <el-select
                v-model="queryParams.userBroaHead"
                placeholder="请选择车辆类型"
                clearable
                size="small"
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
            <el-form-item prop="carNumber" label="车牌号">
              <el-input
                v-model="queryParams.carNumber"
                placeholder="请输入车牌号"
                clearable
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="chargEquipType" label="充电设备类型">
              <el-select
                v-model="queryParams.chargEquipType"
                placeholder="请选择设备类型"
                clearable
                size="small"
              >
                <el-option
                  v-for="item in stateList"
                  :key="item.chargEquipType"
                  :label="item.label"
                  :value="item.chargEquipType"
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
    </div>
    <el-card style="margin-top:10px">
      <el-table
        ref="table"
        border
        :stripe="true"
        :header-cell-style="tableHeaderStyle"
        :data="newlist"
      >
        <el-table-column type="index" align="center" label="序号" width="50" />
        <el-table-column
          label="任务编号"
          align="center"
          width="170px"
          prop="id"
        />
        <el-table-column
          label="所属网点"
          align="center"
          width="120px"
          prop="chargGroupName"
        />
        <el-table-column
          label="车牌号"
          align="center"
          width="100px"
          prop="carNumber"
        />
        <el-table-column
          label="是否优先充电"
          align="center"
          width="100px"
          prop="priorityLevel"
        >
          <template slot-scope="scope">
            {{ scope.row.priorityLevel === 1 ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column
          label="当前SOC(%)"
          align="center"
          width="100px"
          prop="beginSoc"
        />
        <!-- <el-table-column
          label="剩余距离(km)"
          align="center"
          width="100px"
          prop="state"
        >
          <template slot="">
            -
          </template>
        </el-table-column> -->
        <el-table-column
          label="车辆VIN码"
          align="center"
          width="170px"
          prop="carVin"
        />
        <el-table-column
          label="车辆类型"
          align="center"
          width="100px"
          prop="label"
        >
        </el-table-column>
        <el-table-column
          label="车辆型号"
          align="center"
          width="100px"
          prop="label"
        />
        <el-table-column
          label="充电设备类型"
          align="center"
          width="100px"
          prop="chargEquipType"
        />
        <el-table-column
          label="充电设备额定功率"
          align="center"
          width="130px"
          prop="ratedPow"
        />
        <el-table-column
          label="预定充电设备名称"
          align="center"
          width="130px"
          prop="chargName"
        />
        <el-table-column
          label="预定充电设备编码"
          align="center"
          width="180px"
          prop="assetsNum"
        />
        <el-table-column
          label="预定枪号"
          align="center"
          width="100px"
          prop="gunNum"
        />
        <el-table-column
          label="预定充电开始时间"
          align="center"
          width="150px"
          prop="requestTime"
        />
        <el-table-column
          label="实际充电开始时间"
          align="center"
          width="130px"
          prop="startTime"
        />
        <el-table-column
          label="实际充电结束时间"
          align="center"
          width="130px"
          prop="endTime"
        />
        <el-table-column
          label="组织机构"
          align="center"
          width="100px"
          prop="orgName"
        />
        <el-table-column
          label="状态"
          align="center"
          width="100px"
          prop="status"
          fixed="right"
        />
        <el-table-column
          label="操作"
          align="center"
          width="200px"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="breakOff(scope.row)" class="btn1"
              >人工中断</el-button
            >
            <el-button type="text" @click="edit(scope.row)" class="btn1"
              >过程数据</el-button
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
    </el-card>
    <!-- 过程数据弹框 -->
    <el-dialog
      title="过程数据"
      :visible.sync="open"
      width="1000px"
      append-to-body
    >
      <gunDetails :infos="info" v-if="open"></gunDetails>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getCarType } from '@/api/smartdispatch/chargingpileconfig/index'
import {
  getEquipType,
  getLog,
  UpdateOneCarStatus
  // getCarType
} from '@/api/smartdispatch/taskview/index'
import gunDetails from './gunDetails.vue'
// import gunDetails from '@/views/monitoring/comsupervision/equipmentDetails/gunDetails.vue'
export default {
  components: {
    gunDetails
  },
  data() {
    return {
      loading: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      info: {
        //给子组件传值对象
        deviceNo: new Date().getTime() + Math.random() * 10,
        gunNo: '01'
      }, //充电枪
      //
      value: '',
      dialogform: {},
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
      // state
      stateList: [],
      SOCList: [
        { value: '1', label: '0-10%' },
        { value: '2', label: '10-20%' },
        { value: '3', label: '20-30%' },
        { value: '4', label: '30-40%' },
        { value: '5', label: '40-50%' },
        { value: '6', label: '50-60%' },
        { value: '7', label: '60-70%' },
        { value: '8', label: '70-80%' },
        { value: '9', label: '80-90%' }
      ],
      // 列表数据
      newlist: []
    }
  },
  created() {
    getCarType().then((res) => {
      this.typeList = res.data.result
    })
    getEquipType().then((res) => {
      this.stateList = res.data.result
    })
    this.getList()
  },
  methods: {
    // 请求列表数据
    getList() {
      let params = {
        page: this.queryParams.pageNum,
        limit: this.queryParams.pageSize
      }
      let obj = {}
      obj.carType =
        this.queryParams.userBroaHead === ''
          ? ''
          : this.queryParams.userBroaHead
      obj.carNumber =
        this.queryParams.carNumber === '' ? '' : this.queryParams.carNumber
      obj.chargEquipType =
        this.queryParams.chargEquipType === ''
          ? ''
          : this.queryParams.chargEquipType
      getLog(obj, params).then((res) => {
        this.newlist = res.data.result.list ? res.data.result.list : []
        this.total = res.total
      })
      this.loading = false
    },
    // 选中车辆类型
    selected(e) {
      this.cartype = e
      this.spans = e === '特种车' ? 12 : 8
    },
    // 中断按钮
    breakOff(row) {
      this.$confirm('是否人工参与中断此项调度任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setInterval(() => {
            UpdateOneCarStatus({ carVin: row.carVin }).then((res) => {
              this.$message({
                type: 'success',
                message: res.message
              })
            })
          }, 10000)
          // try {
          //   UpdateOneCarStatus({carVin:row.carVin}).then((res)=>{
          //     this.$message({
          //       type: 'success',
          //       message: res.message
          //     });
          //   })
          // } catch (error) {
          //   this.$message({
          //       type: 'success',
          //       message: error
          //     });
          // }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 过程数据按钮
    edit(row) {
      this.info.row = row
      this.open = true
    },
    // 失效，停用
    change() {},

    handleQuery() {
      this.getList()
    },
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        userBroaHead: '',
        carNumber: '',
        chargEquipType: ''
      }
      this.getList()
    },
    add() {
      this.open = true
    },
    save() {
      this.cancel()
    },
    cancel() {
      this.open = false
    }
  }
}
</script>
<style lang="scss">
.title {
  color: #0185d0;
  // border-bottom: 1px dashed #333333;
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
</style>
