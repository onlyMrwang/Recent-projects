<template>
  <div class="alarmSetting" id="alarmItem">
    <div v-if="!showSetting">
    <!-- 搜索 -->
    <div class="alarmSearch">
      <div class="inputBox">
        <div class="inputItem">
          <div class="label">规则名称</div>
          <div class="value">
              <el-input v-model="searchConf.ruleName" placeholder="请输入规则名称"/>
          </div>
        </div>
        <div class="inputItem">
          <div class="label">监控对象</div>
          <div class="value">
             <el-input v-model="searchConf.carCodeOrGroupCode" placeholder="请输入车牌号/充电设备名称"/>
          </div>
        </div>
      </div>
      <div class="search">
        <el-button type="primary" @click="toSearch">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </div>

    <!-- 预警列表 -->
    <div class="content">
      <div class="top">
        <div class="title">
          <div class="name">告警预警门限配置</div>
        </div>
        <div class="options">
          <el-button type="primary" icon="el-icon-plus" @click="toAdd">新增</el-button>
        </div>
      </div>
      <div class="table">
        <el-table :data="preAlarmList" style="width: 100%" border
         :header-cell-style="tableHeaderStyle">
          <el-table-column
           width="200"
            prop="ruleName"
            label="规则名称"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="period" label="预警周期" align="center" show-overflow-tooltip>
             <template slot-scope="scope">
                {{scope.row.period}}{{scope.row.timeUnit}}内超过{{scope.row.count}}次
             </template>
          </el-table-column>
          <el-table-column prop="objectNo" label="预警指标" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{dictInfo.preAlarmListObj[scope.row.objectNo]}}{{scope.row.threshold}}{{unitList[scope.row.objectNo]}}
            </template>
          </el-table-column>
          <el-table-column prop="disposalMethod" label="处置方式" align="center" show-overflow-tooltip>
             <template slot-scope="scope">
               <span v-if="scope.row.disposalMethod === '0'">通知</span>
               <span v-if="scope.row.disposalMethod === '1'">停机</span>
               <span v-if="scope.row.disposalMethod === '0,1' || scope.row.disposalMethod === '1,0'">停机, 通知</span>
            </template>
          </el-table-column>
          <el-table-column prop="validTag" label="状态" align="center">
            <template slot-scope="scope">
                {{scope.row.validTag === 1 ? '启用' : '停用'}}
            </template>
          </el-table-column>
          <el-table-column prop="x" label="监控对象" align="center">
            <template slot-scope="scope">
               车辆 <span class="obj" @click="toDetail(scope.row, 1)">{{scope.row.carCount}}</span>, 充电设备 <span class="obj" @click="toDetail(scope.row, 2)">{{scope.row.chargCount}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="y" label="操作" align="center" width="160">
            <template slot-scope="scope">
               <el-link type="primary" style="margin-right: 8px" :underline="false" @click="updateStatus(scope.row)">
                  {{scope.row.validTag === 1 ? '停用' : '启用'}}
               </el-link>
              <el-link type="primary" style="margin-right: 8px" :underline="false" @click="undatePre(scope.row)">修改</el-link>
              <el-link type="primary" :underline="false" @click="deletePre(scope.row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="preAlarmList.length > 0">
           <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handlePage"
              :current-page="searchConf.pageNo"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="searchConf.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
          </el-pagination>
        </div>
      </div>
      </div>
    </div>

    <!-- 账户详情(充电对象列表) -->
    <div class="detailBox" v-else>
        <div class="back" @click="goBack">
          <img src="@/assets/images/fanhui.png"/>
          <span>返回上一页</span>
        </div>
        <div class="detailTable">
          <Setting v-if="settingOrDetail === 1" :type="type" :rowInfo="rowInfo" @closeBox="goBack" @refresh="toRefresh" ref="settingItem"/>
          <Detail v-if="settingOrDetail === 2" :carCodeOrGroupCode="searchConf.carCodeOrGroupCode" :type="detailType" :rowInfo="rowInfo" @closeBox="goBack"/>
        </div>
    </div>

  </div>
</template>

<script>
import { getPreAlarmList, deletePreAlarm, updateStatusPreAlarm } from '@/api/alarm/preAlarm'
import { mapGetters } from 'vuex'
import Setting from './components/setting.vue'
import Detail from './components/detail.vue'
export default {
  components: {
    Setting, Detail
  },
  data() {
    return {
      showSetting: false,
      preAlarmList: [],
      total: 0,
      type: 1, // 1 添加, 2 修改
      searchConf: {
        ruleName: null,
        carCodeOrGroupCode: null,
        pageNo: 1,
        pageSize: 10
      },
      settingOrDetail: 1, // 1 setting页面, 2 详情页面  
      detailType: 1, // 1 车辆, 2 充电设备
      rowInfo: null,
      unitList: ['V', '度', 'V', 'A', 'V', '%']
    }
  },
  computed: {
    ...mapGetters(['deptList', 'dictInfo'])
  },
  created() {
      this.fetchPreList()
  },
  methods: {
    async fetchPreList() {
      const rsp = await getPreAlarmList(this.searchConf)
      if(rsp.code === 200) {
        this.preAlarmList = rsp.data.list
        this.total = rsp.data.total
      }
    },
   updateStatus(row) {
        this.$confirm(row.validTag === 1 ? '是否确定停用该预警配置': '是否确定启用该预警配置', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(async () => {
          const data = {
          id: row.id,
          validTag: row.validTag
        }
          const rsp = await updateStatusPreAlarm(data) 
           if(rsp.code === 200) {
          this.$message({
            type: 'success',
            message: row.validTag === 1 ? '停用成功' : '启用成功'
          })
          this.fetchPreList()
        } 
        }).catch(() => {}) 
    },
    undatePre(row) {
      this.rowInfo = row
      this.type = 2
      this.settingOrDetail = 1
      this.showSetting = true
    },
    deletePre(row) {
        this.$confirm('是否确认删除此预警规则?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(async () => {
          const rsp = await deletePreAlarm(row.id)
          if(rsp.code === 200) {
            this.$message({
            type: 'success',
            message: '删除成功!'
           })
           this.fetchPreList()
          }
        })
    },
    toAdd() {
      this.type = 1
      this.settingOrDetail = 1
      this.showSetting = true
    },
    toDetail(row, type) {
      this.rowInfo = row
      this.detailType = type
      this.settingOrDetail = 2
      this.showSetting = true
    },
    goBack() {
      this.showSetting = false
      this.settingOrDetail = null
      this.rowInfo = {}
    },
    toSearch() {
      this.searchConf.pageNo = 1
      this.fetchPreList()
    },
    handlePage(page) {
      this.searchConf.pageNo = page
      this.fetchPreList()
    },
    handleSizeChange(pageSize) {
      this.searchConf.pageNo = 1
      this.searchConf.pageSize = pageSize
      this.fetchPreList()
    },
    resetSearch() {
      this.searchConf = {
        ruleName: null,
        carCodeOrGroupCode: null,
        pageNo: 1,
        pageSize: 10
      }
    },
    toRefresh() {
      this.type = null
      this.showSetting = false
      this.fetchPreList()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.alarmSetting {
  .alarmSearch {
    background-color: #fff;
    height: 55px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 35px 0 30px;
    .inputBox {
      display: flex;
      align-items: center;
      .inputItem {
        display: flex;
        align-items: center;
        margin-right: 38px;
        .label {
          color: $mainTextColor;
          font-size: $fontSize14;
          margin-right: 12px;
        }
      }
    }
  }
  .content {
    background-color: #fff;
    border-radius: 4px;
    min-height: calc(100vh - 150px);
    margin: 10px 0;
    overflow: auto;
    .top {
      padding: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 5px;
      border-bottom: 1px solid #e8eef4;
      .title {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        .name {
          font-size: $fontSize16;
          color: $mainTitleColor;
          font-weight: 400;
        }
      }
      .options {
        margin-right: 10px;
      }
    }
    .table {
      padding: 10px 20px;
      .obj {
        cursor: pointer;
        color: $btnMainColor;
      }
      .num {
        color: $btnMainColor;
        cursor: pointer;
      }
      .pagination {
        margin: 10px 0;
        display: flex;
        justify-content: flex-end;
      }
    }
  }

  .detailBox {
    margin-bottom: 20px;
   .back {
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    img {
      width: 20px;
      height: 20px;
    }
    span {
        padding-left: 10px;
        color: $topMenuActiveColor;
        font-size: 13px;
      }
  }
  .detailTable {
      background-color: #fff;
      padding: 5px 15px 15px 15px;
      min-height: calc(100vh - 150px);
    .top {
      padding: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 5px;
      .title {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        .sign {
          width: 7px;
          height: 20px;
          background: $btnMainColor;
          margin-right: 8px;
        }
         .name {
          font-size: $fontSize16;
          color: $mainTitleColor;
          font-weight: 400;
        }
      }
    }
  }
  }
}
</style>
