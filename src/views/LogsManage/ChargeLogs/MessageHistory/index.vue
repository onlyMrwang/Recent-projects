<template>
  <div class="chrOrderSea">
    <!-- search box -->
    <div class="card">
      <el-form
        ref="searchConf"
        :model="searchConf"
        size="small"
        label-width="90px"
      >
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item label="充电网点">
              <el-select
                v-model="searchConf.deviceSite"
                clearable
                @change="changeSite"
                placeholder="请选择充电网点"
              >
                <el-option
                  v-for="item in siteList"
                  :key="item.chargGroupId"
                  :label="item.chargGroupName"
                  :value="item.chargGroupName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="110px" label="设备名称">
              <!-- <el-input
                v-model="searchConf.deviceName"
                placeholder="请输入充电设备名称"
              /> -->
              <el-select
                v-model="searchConf.deviceName"
                clearable
                @change="changeDevice"
                :placeholder="searchConf.chargGroupName ? '请选择设备名称' : '请先选择充电网点'"
              >
                <el-option
                  v-for="item in chargeList"
                  :key="item.chargId"
                  :label="item.chargName"
                  :value="item.chargName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备编号">
              <el-input
                v-model="searchConf.deviceNo"
                placeholder="请输入设备编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="协议">
              <el-select
                v-model="searchConf.ver"
                clearable
                @change="changePrto"
                placeholder="请选择协议"
              >
                <el-option
                  v-for="item in dictInfo.protType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item label="报文命令码">
              <el-select
                v-model="searchConf.commandCode"
                clearable
                filterable
                :placeholder="searchConf.ver ? '请选择报文命令码' : '请先选择协议'"
              >
                <el-option
                  v-for="item in commandCodeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="110px" label="上报时间">
              <el-date-picker
                popper-class="dateRange"
                v-model="happenTimes"
                type="datetimerange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy:MM:dd HH:mm:ss"
                clearable
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="text-align: right;">
            <el-button type="primary" @click="toSearch">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- table box-->
    <div class="tableBox">
      <div class="top">
        <div class="title">
          <div class="name">原始报文日志</div>
        </div>
        <div class="options">
          <!-- <el-button @click="exportMsg" :loading="showLoading"><i class="iconfont icon-daochu" /> 导出</el-button> -->
        </div>
      </div>
      <div class="table">
        <el-table
          :header-cell-style="tableHeaderStyle"
          :data="tableList"
          border
          style="width: 100%"
        >
          <el-table-column
            fixed="left"
            prop="deviceNo"
            label="设备编号"
            width="160"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="gunNo"
            label="枪号"
            width="100"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="deviceName"
            label="设备名称"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="commandCode"
            label="报文命令码"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="indbTime"
            label="时间"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="originalMessage"
            label="原始报文"
            align="center"
          >
           <template slot-scope="scope">
            <div v-if="scope.row.originalMessage">
            <el-tooltip popper-class="item" effect="dark" placement="top">
              <div slot="content">{{scope.row.originalMessage}} 
                <el-link
                type="primary"
                title="复制原始报文"
                :underline="false"
                v-clipboard:copy="scope.row.originalMessage"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                icon="el-icon-copy-document"
                ></el-link
              >
              </div>
              <div class="oneLine">{{scope.row.originalMessage}}</div>
            </el-tooltip>
            </div>
          </template>
          </el-table-column>
          <el-table-column
            prop="analysisMessage"
            label="解析报文"
            align="center"
          >
          <template slot-scope="scope">
            <div v-if="scope.row.analysisMessage">
            <el-tooltip  popper-class="item" effect="dark" placement="top">
              <div slot="content">{{scope.row.analysisMessage}} 
                <el-link
                type="primary"
                title="复制解析报文"
                :underline="false"
                v-clipboard:copy="scope.row.analysisMessage"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                icon="el-icon-copy-document"
                ></el-link
              >
              </div>
              <div class="oneLine">{{scope.row.analysisMessage}}</div>
            </el-tooltip>
            </div>
          </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="tableList.length > 0">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
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
</template>

<script>
import { listChargGroupCode } from "@/api/alarm/alarmmonitorcenter";
import { getHistoryMsg, exportHistoryMsg } from "@/api/alarm/celve";
import { chargGroup } from "@/api/asset/charggroup";
import { streamToExcel } from "@/utils/utils";
import { mapGetters } from "vuex";
import moment from 'moment'
export default {
  data() {
    return {
      searchConf: {
        pageSize: 10,
        pageNo: 1,
        deviceSite: null,
        deviceName: null,
        deviceNo: null,
        ver: null,
        commandCode: null,
        startTime: null,
        lastTime: null,
      },
      showLoading: false,
      total: 0,
      siteList: [],
      happenTimes: [],
      tableList: [],
      commandCodeList: [],
      verList: [],
      chargeList: [], // 设备列表
    };
  },
  computed: {
    ...mapGetters(["dictInfo"]),
  },
  created() {
    this.searchConf.commandCode = this.$route.query.msgCode || null
    this.searchConf.deviceName = this.$route.query.deviceName || null
    if(this.$route.query.startTime && this.$route.query.lastTime) {
      this.happenTimes = [new Date(this.$route.query.startTime), new Date(this.$route.query.lastTime)]
    }
    this.fetchList();
    this.fetchSiteList();
  },
  methods: {
    async fetchList() {
      if(this.happenTimes?.length > 0) {
        if(this.$route.query.startTime && this.$route.query.lastTime) {
          this.searchConf.startTime = moment(this.happenTimes[0]).format('YYYY-MM-DD HH:mm:ss')
          this.searchConf.lastTime = moment(this.happenTimes[1]).format('YYYY-MM-DD HH:mm:ss') 
        }else {
          this.searchConf.startTime = this.happenTimes[0]
          this.searchConf.lastTime = this.happenTimes[1]
        }
        
      }else {
         this.searchConf.startTime = null
        this.searchConf.lastTime =  null
      }
      const res = await getHistoryMsg(this.searchConf);
      if (res.code === 200) {
        this.tableList = res.data.list;
        this.total = res.data.total;
      }
    },
    async fetchSiteList() {
      const res = await listChargGroupCode();
      if (res.code === 200) {
        this.siteList = res.data;
      }
    },

    // 切换网点
    async changeSite(val) {
      this.chargeList = [];
      this.searchConf.deviceName = null;
      if (val) {
        const data = {
          pageNum: 1,
          pageSize: 1000,
          chargGroupName: val,
        };
        const rsp = await chargGroup(data);
        if (rsp.code === 200) {
          this.chargeList = rsp.data.result;
        }
      }
    },

    // 切换设备
    changeDevice(val) {
      const arr = this.chargeList.filter((item) => item.chargName === val);
      if (arr.length > 0) {
        this.searchConf.deviceNo = arr[0].assetsNum;
      }
    },
    onCopy() {
      // 复制成功
      this.$message({
        message: "复制成功",
        type: "success",
      })
    },
    onError() {
      // 复制失败
      this.$message({
        message: "复制失败",
        type: "error",
      });
    },

    toSearch() {
      this.searchConf.pageNo = 1;
      this.fetchList();
    },
    changePrto(val) {
      this.searchConf.commandCode = null;
       this.commandCodeList = [];
      if (val === "3.4") {
        this.commandCodeList = this.dictInfo.commandCode34;
      } else if (val === "3.4a1") {
        this.commandCodeList = this.dictInfo.commandCode34a1;
      } else if (val === "3.4a") {
        this.commandCodeList = this.dictInfo.commandCode34a;
      } else {
        this.commandCodeList = [];
      }
    },
    resetSearch() {
      this.searchConf = {
        pageSize: 10,
        pageNo: 1,
        deviceSite: null,
        deviceName: null,
        deviceNo: null,
        ver: null,
        commandCode: null,
        startTime: null,
        lastTime: null,
      };
      this.happenTimes = [];
    },

    handleCurrentChange(page) {
      this.searchConf.pageNo = page;
      this.fetchList();
    },
    handleSizeChange(pageSize) {
      this.searchConf.pageNo = 1
      this.searchConf.pageSize = pageSize
      this.fetchList()
    },

    async exportMsg() {
      this.showLoading = true;
      const rsp = await exportHistoryMsg(this.searchConf);
      if (rsp && rsp.size > 0) {
        streamToExcel(rsp, "原始报文日志");
        this.$message({
          type: "success",
          message: "导出成功",
        });
      }else {
         this.$message({
          type: "error",
          message: "导出失败",
        });
      }
      this.showLoading = false
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.chrOrderSea {
  .tableBox {
    background-color: #fff;
    border-radius: 4px;
    min-height: calc(100vh - 280px);
    margin: 10px 0;
    overflow: auto;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 20px;
      .title {
        display: flex;
        align-items: center;
        .name {
          font-size: 16px;
          color: $mainTextColor;
        }
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
    .btnBox a {
      display: inline-block;
      width: 50%;
      text-align: center;
    }
    .flexbox {
      height: 110px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}
</style>
