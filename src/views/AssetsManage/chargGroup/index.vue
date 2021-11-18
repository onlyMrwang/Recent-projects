<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="card">
      <el-form ref="form" :model="form" size="small" label-width="120px">
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item prop="chargGroupName" label="充电网点">
              <el-select
                v-model="form.chargGroupName"
                clearable
                filterable
                @change="changeSite"
                placeholder="请选择所属充电网点"
              >
                <el-option
                  v-for="item in siteList"
                  :key="item.recSiteNum"
                  :label="item.chargGroupName"
                  :value="item.chargGroupName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="chargName" label="充电设备名称">
              <el-select
                v-model="form.chargName"
                clearable
                filterable
                :placeholder="
                  form.chargGroupName
                    ? '请选择充电设备名称'
                    : '请先选择充电网点'
                "
              >
                <el-option
                  v-for="item in chargeList"
                  :key="item.assetsNum"
                  :label="item.chargName"
                  :value="item.chargName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="assetsNum" label="充电设备编码">
              <el-input
                v-model="form.assetsNum"
                placeholder="请输入充电设备编码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="chargEquipType" label="充电设备类型">
              <el-select
                v-model="form.chargEquipType"
                clearable
                filterable
                placeholder="请选择充电设备类型"
              >
                <el-option
                  v-for="item in dictInfo.chargEquipType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item prop="factoryId" label="充电设备厂家">
              <el-select
                v-model="form.factoryId"
                clearable
                filterable
                placeholder="请选择充电设备厂家"
              >
                <el-option
                  v-for="item in manuList"
                  :key="item.facturerId"
                  :label="item.facturerName"
                  :value="item.facturerId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label-width="0" style="text-align: right">
              <el-button type="primary" @click="queryFn">查询</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--表格渲染-->
    <el-card class="topCard" style="margin-bottom: 15px">
      <div class="head-container" style="margin-bottom: 8px">
        <!-- <h1><span class="online"></span> 充电设备信息列表</h1> -->
        <div>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addFn(1)"
            class="btn"
          >
            增加
          </el-button>
          <el-button class="btn" @click="handleImport">
            <i class="iconfont icon-daoru"></i> 导入
          </el-button>
          <el-button class="btn" :loading="showLoading" @click="handleExport">
            <i class="iconfont icon-daochu"></i> 导出
          </el-button>
        </div>
      </div>
      <el-table
        ref="table"
        border
        :header-cell-style="tableHeaderStyle"
        :data="tableData"
        max-height="530"
        style="width: 100%;"
      >
        <el-table-column
          fixed="left"
          prop="chargGroupName"
          align="center"
          label="充电网点"
          width="180"
        />
        <el-table-column
          fixed="left"
          prop="chargName"
          align="center"
          show-overflow-tooltip
          width="180"
          label="充电设备名称"
        />
        <el-table-column
          prop="assetsNum"
          width="180"
          show-overflow-tooltip
          align="center"
          label="充电设备编码"
        />
        <el-table-column
          width="180"
          align="center"
          show-overflow-tooltip
          label="充电设备类型"
        >
          <template slot-scope="scope">
            {{
              Number(scope.row.chargEquipType) >= 0
                ? dictInfo.chargEquipTypeObj[Number(scope.row.chargEquipType)]
                : null
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="facturerName"
          align="center"
          width="180"
          show-overflow-tooltip
          label="充电设备厂家"
        />
        <el-table-column
          prop="chargGroupCode"
          align="center"
          width="180"
          show-overflow-tooltip
          label="充电网点编码"
        />
        <el-table-column
          prop="chargInterNum"
          align="center"
          width="120"
          show-overflow-tooltip
          label="枪口数量"
        />
        <el-table-column
          prop="ratedPow"
          align="center"
          width="180"
          show-overflow-tooltip
          label="设备额定功率(kW)"
        />
        <el-table-column
          prop="voltageTop"
          align="center"
          width="180"
          show-overflow-tooltip
          label="额定电压上限(V)"
        />
        <el-table-column
          prop="carModel"
          align="center"
          width="180"
          show-overflow-tooltip
          label="支持车型"
        />
        <el-table-column
          align="center"
          show-overflow-tooltip
          width="90"
          label="状态"
        >
          <template slot-scope="scope">
            {{ scope.row.chargRganState == 0 ? "启用" : "停用" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="160">
          <template slot-scope="scope">
            <el-link
              class="btn1"
              @click="addFn(3, scope.row)"
              title="详情"
              :underline="false"
              type="primary"
            >
              详情
            </el-link>
            <el-link
              class="btn1"
              @click="addFn(2, scope.row)"
              title="修改"
              :underline="false"
              type="primary"
            >
              修改
            </el-link>
            <el-link
              class="btn1"
              :underline="false"
              @click="changeStatus(scope.row)"
              type="primary"
              >{{ scope.row.chargRganState === 0 ? "停用" : "启用" }}
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <div class="pagination-container" v-if="total > 0">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 新增修改数据弹出框 -->
    <div v-if="addDialogShow">
      <el-dialog
        v-dialogDrag
        :visible.sync="addDialogShow"
        @closed="closeView"
        width="80%"
        :title="title"
        :close-on-click-modal="false"
      >
        <addDetail
          :clearable="clearable"
          :listType="listType"
          :listFrom="dialogForm"
          :chargGroupName="siteList"
          :arrayBoxs="dictInfo"
          @closeView="closeView"
        >
        </addDetail>
      </el-dialog>
    </div>
    <!-- 用户导入对话框 -->
    <el-dialog
      v-dialogDrag
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <!-- <el-checkbox
                            v-model="upload.updateSupport"
                    />
                    是否更新已经存在的数据 -->
          <el-link
            type="primary"
            :underline="false"
            style="font-size:13px"
            @click="importTemplate"
            >下载模板
          </el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <div v-if="showImport">
      <el-dialog
        :close-on-click-modal="false"
        v-dialogDrag
        title="充电设备导入失败结果"
        :visible.sync="showImport"
        width="800px"
         append-to-body
        :before-close="handleCloseImport"
      >
        <div class="importDialog">

        <download-excel
              v-if="execlData.length > 0"
              style="width: 100px"
              :data="execlData"
              :fields="execlFileds"
              name = "充电设备导入失败结果.xls">
              <el-button type="primary" size="small">导出EXCEL</el-button>
        </download-excel>
          <table>
            <tr>
              <th style="width: 80px;">行号</th>
              <th style="width: 480px;">错误信息</th>
            </tr>
            <tr v-for="(item, index) in importErrorKeyList" :key="index">
              <td>{{ item }}</td>
              <td>{{ importErrorValueList[index] }}</td>
            </tr>
          </table>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  chargGroup,
  exportChargGroup,
  upDateStopChargingInfo,
} from "@/api/asset/charggroup";
import { chargGroupInfo } from "@/api/asset/charggroupinfo";
import { getChargManu, getChargeBySite } from "@/api/alarm/faultalarmBase";
import { mapGetters } from "vuex";
import addDetail from "./addDetail.vue";

export default {
  computed: {
    ...mapGetters(["dictInfo"]),
  },
  data() {
    return {
      clearable: false,
      listType: 1,
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        // 上传的地址
        url: "/app/assets/charging/importData",
      },
      // 表单数据
      form: {
        chargName: "",
        chargGroupName: "",
        assetsNum: "",
        chargGroupCode: "",
        chargEquipType: "",
        factoryId: "",
        pageSize: 10,
        pageNum: 1,
      },
      // 弹出框标题
      title: "",
      // 表格数据
      tableData: [],
      // 弹出框的表单数据
      dialogForm: {
        chargRganState: null,
        orgId: null,
        chargName: null,
        chargGroupName: null,
        chargGroupCode: null,
        chargEquipType: null,
        chargManu: null,
        ratedPow: null,
        equipOpenTime: null,
        ifMonDisp: null,
        equiModel: null,
        producTime: null,
        factoryId: null,
        assetsNum: null,
        chargLongit: null,
        chargLatit: null,
        installMeth: null,
        coopPartner: null,
        operFlow: null,
        idenAuthen: null,
        chargInterNum: null,
        currentTop: null,
        currentFloor: null,
        voltageTop: null,
        voltageFloor: null,
        revision: null,
        protVersion: null,
        marstVersion: null,
        backVersion: null,
        remarks: null,
        serviceTypeOne: null,
        serviceStandOne: null,
        chaargeApiOutPower1: null,
        outVoltageMaxRange1: null,
        outVoltageMinRange1: null,
        maxOutFlow1: null,
        comProtocolVersioin: null,
        serviceTypeTwo: null,
        serviceStandTwo: null,
        outPowerTwo: null,
        outVoltaMaxTwo: null,
        outVoltaMinTwo: null,
        curreMaxTwo: null,
        protocolTwo: null,
        rechargeGuns: [],
      },
      // 所属充电网点
      siteList: [],
      // 新增按钮弹出框
      addDialogShow: false,
      // 总条数
      total: 0,
      showLoading: false,
      manuList: [], // 设备厂家
      chargeList: [], // 设备列表
      showImport: false, // 是否展示导入结果
      importErrorKeyList: [], // 导入失败key
      importErrorValueList: [], // 导入失败value
      loading: null,
      execlData: [],
      execlFileds: {
        "行号": "line", 
        "错误信息": "errorMsg",
      }
    };
  },
  components: {
    addDetail,
  },
  created() {
    this.getList();
    this.getAddress();
    this.fetchManuList();
  },
  methods: {
    changeSite(val) {
      this.chargeList = [];
      this.form.chargName = null
      const arr = this.siteList.filter((item) => item.chargGroupName === val);
      if (arr.length > 0) {
        this.fetchCharge({ id: arr[0].chargGroupId });
      }
    },
    async fetchCharge(val) {
      const rsp = await getChargeBySite(val);
      if (rsp.code === 200) {
        this.chargeList = rsp.data;
      }
    },
    // 获取充电机表格数据
    async getList() {
      const res = await chargGroup(this.form);
      if (res.code === 200) {
        this.tableData = res.data.result;
        this.total = res.total;
      }
    },
    async fetchManuList() {
      const rsp = await getChargManu({ type: 1 });
      if (rsp.code === 200) {
        this.manuList = rsp.data;
      }
    },
    // 获取所属充电网点下拉框数据
    async getAddress() {
      const res = await chargGroupInfo();
      if (res.code === 200) {
        this.siteList = res.data.result;
      }
    },
    // 查询按钮
    queryFn() {
      this.form.pageNum = 1;
      this.getList();
    },
    handleSizeChange(pageSize) {
      this.form.pageNum = 1;
      this.form.pageSize = pageSize;
      this.getList();
    },

    resetSearch() {
      this.form = {
        chargName: "",
        chargGroupName: "",
        assetsNum: "",
        chargGroupCode: "",
        chargEquipType: "",
        factoryId: "",
        pageSize: 10,
        pageNum: 1,
      };
    },

    // 新增按钮
    addFn(v1, v2) {
      this.listType = v1;
      if (v1 == 1) {
        this.title = "新增充电设备";
        this.clearable = false;
        this.reset();
      } else {
        if (v1 == 2) {
          this.clearable = false;
          this.title = "修改充电设备";
        } else if (v1 == 3) {
          this.clearable = true;
          this.title = "查看充电设备";
        }
        this.dialogForm = JSON.parse(JSON.stringify(v2));
      }
      this.addDialogShow = true;
    },
    // 关闭弹出框事件
    closeView() {
      this.addDialogShow = false;
      this.getList();
    },
    // 重置表单方法
    reset() {
      this.dialogForm = {
        chargRganState: null,
        orgId: null,
        chargName: null,
        chargGroupName: null,
        chargGroupCode: null,
        chargEquipType: null,
        chargManu: null,
        ratedPow: null,
        equipOpenTime: null,
        ifMonDisp: null,
        equiModel: null,
        producTime: null,
        factoryNum: null,
        assetsNum: null,
        chargLongit: null,
        chargLatit: null,
        installMeth: null,
        coopPartner: null,
        operFlow: null,
        idenAuthen: null,
        chargInterNum: null,
        currentTop: null,
        currentFloor: null,
        voltageTop: null,
        voltageFloor: null,
        revision: null,
        protVersion: null,
        marstVersion: null,
        backVersion: null,
        remarks: null,
        serviceTypeOne: null,
        serviceStandOne: null,
        chaargeApiOutPower1: null,
        outVoltageMaxRange1: null,
        outVoltageMinRange1: null,
        maxOutFlow1: null,
        protocolOne: null,
        serviceTypeTwo: null,
        serviceStandTwo: null,
        outPowerTwo: null,
        outVoltaMaxTwo: null,
        outVoltaMinTwo: null,
        curreMaxTwo: null,
        protocolTwo: null,
        rechargeGuns: [],
      };
    },
    // 停用启用按钮
    async changeStatus(row) {
      this.$confirm(
        row.chargRganState === 0
          ? "是否确定停用该充电设备"
          : "是否确定启用该充电设备",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        }
      )
        .then(async () => {
          const data = {
            chargRganState: row.chargRganState,
            chargId: row.chargId,
          };
          const res = await upDateStopChargingInfo(data);
          if (res.code == 200) {
            this.msgSuccess(
              row.chargRganState === 0 ? "充电设备停用成功" : "充电设备启用成功"
            );
            this.getList();
          }
        })
        .catch(() => {});
    },
    // 导出按钮
    async handleExport() {
      this.showLoading = true
      const res = await exportChargGroup(this.form);
      if (res && res.size > 0) {
        this.isExcel("xlsx", "充电设备信息表", res);
      }else {
        this.$message({
          type: "error",
          message: '充电设备信息导出失败'
        })
      }
      this.showLoading = false
    },
    isExcel(type, name, data) {
      const link = document.createElement("a");
      const blob = new Blob([data]);
      link.style.display = "none";
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `${name}.` + type);
      document.body.appendChild(link);
      link.click();
      this.msgSuccess("导出成功");
    },
    // 导入操作
    handleImport() {
      this.upload.title = "充电设备导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      let hrefStr = encodeURI(
        "/app/assets/download/excel?filename=" + "充电设备管理导入模板"
      );
      // window.location.href = hrefStr;
      const link = document.createElement("a");
      link.href = hrefStr;
      link.style.display = "none";
      link.setAttribute("download", `充电设备管理导入模板.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    // 文件上传中处理
    handleFileUploadProgress() {
      this.loading = this.$loading({
        lock: true,
        text: "正在导入",
        spinner: "el-icon-loading",
        background: "transparent",
      });
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response) {
      if (response.code === 200) {
        this.$message({
          type: "success",
          message: "充电设备信息导入成功",
        });
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        this.loading.close();
        this.getList();
     }else {
        this.$refs.upload.clearFiles();
        this.upload.open = false;
        this.upload.isUploading = false;
        this.loading.close()
        if(response.data) {
          this.importErrorKeyList = Object.keys(response.data)
          this.importErrorValueList = Object.values(response.data)
          if(this.importErrorValueList?.length > 0) {
            this.importErrorValueList.forEach((item, index) => {
              this.execlData.push({ 
                line: this.importErrorKeyList[index],
                errorMsg: item
              })
            })
          }
          this.showImport = true  
        }else {
            this.$message({
                type: 'error',
                message: response.message || '导入失败'
              })
          }
          
        }
    },
    handleCloseImport() {
      this.showImport = false
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    handleCurrentChange(currentPage) {
      this.form.pageNum = currentPage;
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.topCard {
  margin-top: 10px;
  background-color: #fff;
  min-height: calc(100vh - 230px);
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
.copyIcon {
  display: flex;
  flex-direction: column-reverse;
  font-size: 18px;
  cursor: pointer;
}
</style>
