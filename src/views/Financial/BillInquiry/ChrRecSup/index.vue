<template>
  <div class="chrOrderSea">
    <!-- search box -->
    <div class="seaBox">
      <el-form size="small" label-width="100px">
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item label="订单号">
              <el-input
                v-model="searchInfo.orderNo"
                placeholder="请输入订单号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="充电网点">
              <el-select
                v-model="searchInfo.stationNo"
                :clearable="true"
                placeholder="请选择充电网点"
              >
                <el-option
                  v-for="item in siteList"
                  :key="item.chargGroupId"
                  :label="item.chargGroupName"
                  :value="item.chargGroupId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="充电设备编号">
              <el-input
                v-model="searchInfo.deviceNo"
                placeholder="请输入充电设备编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="卡号">
              <el-input v-model="searchInfo.cardNo" placeholder="请输入卡号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item label="姓名">
              <el-input
                v-model="searchInfo.workerName"
                placeholder="请输入姓名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车牌号">
              <el-input v-model="searchInfo.carNo" placeholder="请输入车牌号" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="充电机构">
              <treeselect
                :options="deptList"
                v-model="orgId"
                :default-expand-level="1"
                placeholder="请选择充电机构"
                :normalizer="normalizer"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" style="text-align: right">
            <el-button type="primary" @click="toSearch">查询</el-button>
            <el-button plain @click="resetSearch">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- table box-->
    <div class="tableBox">
      <div class="top">
        <div class="title">
          <!-- <div class="sign"></div> -->
          <div class="name">充电记录补录列表</div>
        </div>
        <div class="options">
          <el-button @click="todownloadTemplate" :loading="showLoading">
            <i class="iconfont icon-daoru"></i> 模板下载</el-button
          >
          <el-button @click="uploadVisible = true">
            <i class="iconfont icon-daochu"></i> 导入</el-button
          >
        </div>
      </div>
      <div class="table">
        <el-table
          :header-cell-style="tableHeaderStyle"
          :data="orderList"
          max-height="620"
          border
          style="width: 100%"
        >
          <el-table-column
            fixed
            prop="orderNo"
            label="订单号"
            width="220"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="groupName"
            label="所属组织机构"
            width="180"
            align="center"
            fixed
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="cardCode"
            label="卡号"
            width="180"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="staffName"
            label="姓名"
            width="120"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column
            prop="carNo"
            label="车牌号"
            width="100"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="deviceName"
            label="充电设备名称"
            width="160"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="deviceNo"
            label="充电设备编号"
            width="160"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="gunNum"
            label="枪号"
            width="80"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="startSoc"
            label="开始SOC(%)"
            width="130"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="endSoc"
            label="结束SOC(%)"
            width="130"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="开始充电时间"
            width="180"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="结束充电时间"
            width="180"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="useEleValue"
            label="充电量(kWh)"
            width="120"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="chargeTime"
            label="充电时长"
            width="120"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{
                Number(scope.row.chargeTime) > 0
                  ? formatSeconds(scope.row.chargeTime)
                  : 0
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="startEleValue"
            label="开始电表度数(kWh)"
            width="160"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="endEleValue"
            label="结束电表度数(kWh)"
            width="160"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="dealStatus"
            label="状态"
            width="80"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ dealStatusObj[scope.row.dealStatus] }}
            </template>
          </el-table-column>
          <el-table-column
            prop="dealTime"
            label="结算时间"
            width="160"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="orderList.length > 0">
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

    <!-- 上传文件 -->
    <Upload
      :uploadVisible="uploadVisible"
      ref="upload"
      @closeUpload="closeUpload"
      @submitUpload="submitUpload(arguments)"
    />

    <!-- 导入结果展示 -->
    <el-dialog
      v-dialogDrag
      title="导入结果"
      :close-on-click-modal="false"
      :visible.sync="showResult"
      width="80%"
      :before-close="closeResult"
    >
      <div class="resultBox">
        <div
          class="resultList"
          style="text-align: center"
          v-if="errorList.length > 0"
        >
          <table>
            <tr>
              <th style="width: 480px;">错误信息</th>
            </tr>
            <tr v-for="(item, index) in errorList" :key="index">
              <td>{{ item }}</td>
            </tr>
          </table>

          <!-- <div class="eitem" v-for="(item, index) in errorList" :key="index">{{item}}</div> -->
        </div>
        <div
          class="resultList"
          v-if="successList.length > 0 && errorList.length === 0"
        >
          <!-- <div class="sitem" v-for="(item, index) in errorList" :key="index">{{item}}</div> -->
          <el-table
            :header-cell-style="tableHeaderStyle"
            :data="successList"
            border
            style="width: 100%"
          >
            <el-table-column
              fixed
              prop="orderNo"
              label="订单号"
              width="220"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="groupName"
              label="所属组织机构"
              width="180"
              align="center"
              fixed
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="cardCode"
              label="卡号"
              width="180"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="staffName"
              label="姓名"
              width="120"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="carNo"
              label="车牌号"
              width="100"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="deviceName"
              label="充电设备名称"
              width="160"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="deviceNo"
              label="充电设备编号1111"
              width="160"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="gunNum"
              label="枪号"
              width="80"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="startSoc"
              label="开始SOC"
              width="100"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="endSoc"
              label="结束SOC"
              width="100"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="startTime"
              label="开始充电时间"
              width="160"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="endTime"
              label="结束充电时间"
              width="160"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="useEleValue"
              label="充电量(kWh)"
              width="120"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{
                  Number(scope.row.useEleValue) > 0
                    ? scope.row.useEleValue.toFixed(3)
                    : 0
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="chargeTime"
              label="充电时长(秒)"
              width="120"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="startEleValue"
              label="开始电表度数(kWh)"
              width="160"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{
                  Number(scope.row.startEleValue) > 0
                    ? scope.row.startEleValue.toFixed(3)
                    : 0
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="endEleValue"
              label="结束电表度数(kWh)"
              width="160"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{
                  Number(scope.row.endEleValue) > 0
                    ? scope.row.endEleValue.toFixed(3)
                    : 0
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="dealStatus"
              label="状态"
              width="80"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ dealStatusObj[scope.row.dealStatus] }}
              </template>
            </el-table-column>
            <el-table-column
              prop="dealTime"
              label="结算时间"
              width="160"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div slot="footer" style="text-align: center; margin: 50px 0 5px 0">
        <el-button
          type="primary"
          v-if="successList.length > 0"
          @click="toSubmitResult"
          >确 定</el-button
        >
        <el-button @click="closeResult">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getRecordSupplementList,
  templateDownload,
  chargingRecordImportList,
  submitRecordImportList2
} from '@/api/financial/order'
// 网点列表接口
import { chargGroupInfo } from '@/api/asset/charggroupinfo'
import { streamToExcel, formatSeconds } from '@/utils/utils'
import Upload from '@/components/Upload'
export default {
  components: {
    Upload
  },
  data() {
    return {
      showUpload: false,
      orgId: null,
      showResult: false,
      searchInfo: {
        groupId: null, // 组织机构id
        orderNo: null, // 订单号
        deviceNo: null, // 充电设备编号
        cardNo: null, // 卡号
        workerName: null, // 姓名
        stationNo: null,
        carNo: null, // 车牌号
        dealStatus: null, // 订单状态
        pageNo: 1,
        pageSize: 10
      },
      showLoading: false,
      siteList: [], // 网点列表
      rowInfo: null,
      consumeObj: {
        1: 'APP',
        2: '刷卡',
        3: 'VIN'
      },
      dealStatusObj: {
        1: '未处理',
        2: '已处理',
        3: '处理完成'
      },
      statusList: [
        { label: '未处理', value: 1 },
        { label: '已处理', value: 2 },
        { label: '处理完成', value: 3 }
      ],
      total: 0,
      orderList: [],
      uploadVisible: false,
      errorList: [],
      successList: [],
      successData: null
    }
  },
  computed: {
    ...mapGetters(['deptList'])
  },
  created() {
    // this.searchInfo.groupId = this.deptList.length > 0 ? this.deptList[0].id : null
    // if(this.searchInfo.groupId) {
    //   this.fetchOrderList()
    // }
    this.fetchOrderList()
    this.fetchSiteList()
  },
  methods: {
    normalizer(node) {
      //去掉children=[]的children属性
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.nameCN,
        children: node.children
      }
    },
    formatSeconds(val) {
      return formatSeconds(val)
    },
    async fetchOrderList() {
      const rsp = await getRecordSupplementList(this.searchInfo)
      if (rsp.code === 200) {
        this.orderList = rsp.data.list
        this.total = rsp.data.total
      }
    },
    async fetchSiteList() {
      const data = {
        pageNum: 1,
        pageSize: 1000
      }
      const rsp = await chargGroupInfo(data)
      if (rsp.code === 200) {
        this.siteList = rsp.data.result
      }
    },
    toSearch() {
      // const id = this.deptList.length > 0 ? this.deptList[0].id : null
      // this.searchInfo.groupId = this.orgId || id
      this.searchInfo.groupId = this.orgId
      this.searchInfo.pageNo = 1
      this.fetchOrderList()
    },
    resetSearch() {
      this.searchInfo = {
        groupId: null, // 组织机构id
        orderNo: null, // 订单号
        deviceNo: null, // 充电设备编号
        cardNo: null, // 卡号
        stationNo: null,
        workerName: null, // 姓名
        carNo: null, // 车牌号
        dealStatus: null, // 订单状态
        pageNo: 1,
        pageSize: 10
      }
      this.orgId = null
    },
    handleCurrentChange(page) {
      this.searchInfo.pageNo = page
      this.fetchOrderList()
    },
    handleSizeChange(pageSize) {
      this.searchInfo.pageNo = 1
      this.searchInfo.pageSize = pageSize
      this.fetchOrderList()
    },
    async todownloadTemplate() {
      this.showLoading = true
      const rsp = await templateDownload({ name: '批量补录模板.xlsx' })
      if (rsp && rsp.size > 0) {
        streamToExcel(rsp, '批量补录模板')
        this.$message({
          type: 'success',
          message: '模板下载成功'
        })
      }
      this.showLoading = false
    },
    closeUpload() {
      this.uploadVisible = false
    },
    async submitUpload(val) {
      if (val) {
        let formdata = new FormData()
        formdata.append('file', val[0])
        const rsp = await chargingRecordImportList(formdata)
        if (rsp.code === 200) {
          this.$refs.upload.closeUpload()
          this.showResult = true
          this.errorList = rsp.data.error
          this.successData = rsp.data.success
          this.successList =
            JSON.stringify(rsp.data.success) === '{}'
              ? []
              : rsp.data.success.settleError
        }
      }
    },
    closeResult() {
      this.showResult = false
      this.errorList = []
      this.successList = []
      this.successData = null
      this.$refs.upload.closeUpload()
    },
    async toSubmitResult() {
      if (this.successList.length > 0) {
        const rsp = await submitRecordImportList2(this.successData)
        if (rsp.code === 200) {
          this.$message({
            type: 'success',
            message: '充电记录补录成功'
          })
          this.fetchOrderList()
          this.closeResult()
          this.$refs.upload.closeUpload()
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.chrOrderSea {
  .seaBox {
    background-color: #fff;
    border-radius: 4px;
    padding: 20px 20px 0 20px;
    .seaLine {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .seaItem {
        display: flex;
        align-items: center;
        margin-right: 30px;
        .label {
          color: $mainTextColor;
          font-size: $fontSize14;
          width: 90px;
          margin-right: 10px;
          text-align: right;
        }
      }
    }
  }
  .tableBox {
    background-color: #fff;
    border-radius: 4px;
    min-height: calc(100vh - 240px);
    margin: 10px 0;
    overflow: auto;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 20px 0 20px;
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
        margin-bottom: 10px;
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
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 10px 0 20px 0;
  }

  th,
  td {
    text-align: center;
    padding: 8px;
    color: #666;
    border: 1px solid #cfcfcf;
  }

  th {
    background-color: #f2f2f2;
    color: #666;
  }

  // 导入结果
  .resultBox {
    .resultList {
      .eitem {
        color: red;
        margin-bottom: 5px;
        font-size: 14px;
      }
      .sitem {
        color: $btnMainColor;
        margin-bottom: 5px;
        font-size: 14px;
      }
    }
  }
}
</style>
