<template>
  <div class="chrOrderSea">
    <!-- search box -->
    <div class="card">
      <el-form
        ref="searchInfo"
        :model="searchInfo"
        size="small"
        label-width="80px"
      >
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item label="通信协议">
              <el-select
                v-model="searchInfo.protocolVersion"
                clearable
                placeholder="请选择通信协议"
                @change="changeType"
              >
                <el-option
                  v-for="item in siteList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="告警类型">
              <el-select
                v-model="searchInfo.alarmType"
                clearable
                placeholder="请选择告警类型"
                @change="changeTitle"
              >
                <el-option
                  v-for="item in alarmTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="告警名称">
              <el-select
                v-model="searchInfo.alarmTitle"
                clearable
                filterable
                :placeholder="
                  searchInfo.alarmType ? '请选择告警名称' : '请先选择告警级别'
                "
              >
                <el-option
                  v-for="item in alarmTitleSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" align="right">
            <el-button type="primary" @click="searClick">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- table box-->
    <div class="tableBox">
      <div class="top">
        <div class="title">
          <!-- <div class="sign"></div> -->
          <div class="name">故障告警知识库</div>
        </div>
        <!--<div class="options">-->
        <!--<el-button size="mini" icon="el-icon-plus" @click="upDateEdit(1)" class="btn">新增</el-button>-->
        <!--</div>-->
      </div>
      <div class="table">
        <el-table
          :data="tableList"
          border
          :header-cell-style="tableHeaderStyle"
          style="width: 100%"
        >
          <el-table-column
            fixed
            prop="alarmCode"
            label="告警编码"
            width="120"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="protocolVersion"
            label="通信协议"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="alarmType"
            label="告警类型"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ getType(scope.row.alarmType) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="alarmTitle"
            label="告警名称"
            width="120"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="alarmDesc"
            label="告警描述"
            width="180"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="treatNeasures"
            label="处理措施"
            width="180"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="treatProgram"
            label="处置方案"
            width="180"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="validTag"
            label="状态"
            width="120"
            fixed="right"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.validTag == 1 ? '启用' : '停用' }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="160"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div>
                <el-link
                  :underline="false"
                  title="修改"
                  @click="upDateEdit(2, scope.row)"
                  type="primary"
                  style="margin-right: 10px;"
                >
                  修改
                </el-link>
                <el-link
                  :underline="false"
                  @click="handleStatus(scope.row)"
                  type="primary"
                  style="margin-right: 10px;"
                >
                  {{ scope.row.validTag == 1 ? '停用' : '启用' }}
                </el-link>
                <el-link
                  :underline="false"
                  title="删除"
                  @click="deleteBase(scope.row)"
                  type="primary"
                >
                  删除
                </el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="tableList.length > 0">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchInfo.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="searchInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <div v-if="showSetting">
      <el-dialog
        v-dialogDrag
        :title="titles"
        :visible.sync="showSetting"
        width="60%"
        :destroy-on-close="true"
        :close-on-click-modal="false"
        :before-close="closeSetting"
      >
        <AddFault
          ref="addfault"
          :rowInfo="rowInfo"
          @closeDialog="closeSetting(arguments)"
        />
        <div slot="footer">
          <el-button type="primary" @click="submit">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 所属组织机构
import { getOrganization } from '@/api/asset/charggroupinfo'
import {
  getAlarmTypeByComm,
  getAlarmTitleByType //获取告警名称
} from '@/api/alarm/caralarm/monitoringcenter'
import { stopWledgeConfig, clertList } from '@/api/alarm/faultalarmBase'
import { getList } from '@/api/alarm/caralarm/faultalarm'
import { getAlarmTitle } from '@/api/alarm/celve'
import AddFault from './addFault'
import { mapGetters } from 'vuex'
export default {
  components: { AddFault },
  data() {
    return {
      titles: '',
      total: 0,
      subType: 1,
      searchInfo: {
        protocolVersion: null, // 通信协议
        alarmType: null, // 告警类型
        alarmTitle: null, //告警名称
        pageNo: 1,
        pageSize: 10
      },
      siteList: [], //通信协议
      // 所属组织机构
      deptOptions: [],
      alarmList: [],
      levelList: [],
      tableList: [], //table表格列表数组
      showSetting: false, //弹出框得显示隐藏
      rowInfo: null,
      alarmTypeList: [],
      alarmTitleSelect: [] //告警名称
    }
  },
  computed: {
    ...mapGetters(['dictInfo']),
    getType() {
      return function(id) {
        return this.dictInfo.carAlarmType.filter((item) => {
          return item.order == id
        })[0].label
      }
    }
  },
  created() {
    this.getOrganization()
    this.siteList = this.dictInfo.commProtocol
    this.getList()
  },
  methods: {
    // 获取组织机构数据
    getOrganization() {
      getOrganization().then((response) => {
        if (response.code === 200) {
          this.deptOptions = response.data
        }
      })
    },
    // 请求告警类型
    changeType(e) {
      const obj = {}
      obj.protocolVersion = e
      getAlarmTypeByComm(obj).then((res) => {
        this.alarmTypeList = res.data
      })
    },
    // 请求告警名称
    changeTitle(e) {
      getAlarmTitleByType({ alarmType: e }).then((res) => {
        this.alarmTitleSelect = res.data
      })
    },
    // 修改确定
    submit() {
      this.$refs.addfault.submitSetting()

      this.getList()
      this.cancel()
    },
    // 取消
    cancel() {
      this.showSetting = false
    },
    severityClick(val) {
      this.alarmList = []
      this.searchInfo.alarmTitle = null
      if (val) {
        this.fetchAlarmTitle(val)
      }
    },
    // 搜索
    handleSizeChange(pageSize) {
      this.searchInfo.pageNo = 1
      this.searchInfo.pageSize = pageSize
      this.getList()
    },
    // 获取告警名称
    async fetchAlarmTitle(val) {
      const res = await getAlarmTitle({ alarmSeverity: val })
      if (res.code == 200) {
        this.alarmList = res.data
      }
    },
    searClick() {
      this.searchInfo.pageNo = 1
      this.getList()
    },
    reset() {
      this.searchInfo = {
        alarmSeverity: null,
        alarmTitle: null,
        pageNo: 1,
        pageSize: 10
      }
    },
    //打开弹出框新增修改公用
    upDateEdit(num, val) {
      //通过sybType状态去控制当前时新增还是修改
      if (num == 1) {
        this.ruleForm = {}
        this.rowInfo = null
        this.titles = '新增告警知识库'
      } else {
        this.rowInfo = JSON.parse(JSON.stringify(val))
        this.rowInfo.stopTag = this.rowInfo.stopTag == 1 ? true : false
        this.rowInfo.operationService =
          this.rowInfo.operationService == 1 ? true : false
        this.titles = '修改告警知识库'
      }
      this.subType = num
      this.showSetting = true
    },

    deleteBase(val) {
      this.$confirm('是否删除当前所选告警知识库', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.toDelete(val)
      })
    },

    //删除列表得方法
    async toDelete(val) {
      const res = await clertList({ id: val.id })
      if (res.code == 200) {
        if (this.tableList.length <= 1 && this.searchInfo.pageNo > 1) {
          this.searchInfo.pageNo -= 1
        }
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getList()
      }
    },

    handleStatus(val) {
      if (val.validTag == 1) {
        this.$confirm('是否确定停用该告警', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          center: true
        })
          .then(() => {
            this.stopList(val)
          })
          .catch(() => {})
      } else {
        this.stopList(val)
      }
    },

    //停启用告警知识库
    async stopList(val) {
      val.validTag = val.validTag == 1 ? 0 : 1
      const res = await stopWledgeConfig(val)
      if (res.code == 200) {
        this.$message({
          message: val.validTag == 0 ? '停用成功' : '启用成功',
          type: 'success'
        })
        this.getList()
      }
    },

    //获取实时告警列表
    async getList() {
      const res = await getList(this.searchInfo)
      if (res.code === 200) {
        this.tableList = res.data.list
        this.total = res.data.total
      }
    },

    handleCurrentChange(page) {
      this.searchInfo.pageNo = page
      this.getList()
    },

    closeSetting(val) {
      if (val) {
        if (val[0] === 1) {
          this.getList()
        }
        this.showSetting = false
        this.rowInfo = null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.chrOrderSea {
  .tableBox {
    background-color: #fff;
    border-radius: 4px;
    min-height: calc(100vh - 150px);
    margin: 10px 0;
    overflow: auto;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 20px;
      padding: 15px 20px;
      .title {
        display: flex;
        align-items: center;

        .name {
          font-size: 16px;
          color: $mainTextColor;
        }
      }
      .options {
        margin-top: -10px;
      }
    }
    .table {
      padding: 0 15px 15px 15px;
      .pagination {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
      }
    }
    .box {
      display: inline-block;
      width: 25px;
      height: 10px;
      background-color: #999;
      margin-right: 2px;
    }
    .flexbox {
      height: 110px;
      display: flex;
      /* align-items: center; */
      flex-direction: column;
      justify-content: center;
    }
  }
  .formContent {
    display: flex;
    margin-bottom: 10px;
  }
  .formList {
    flex: 1;
    max-width: 49%;
    main-width: 49%;
  }
}
</style>
