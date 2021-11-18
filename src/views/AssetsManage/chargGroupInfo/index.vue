<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="card">
      <el-form ref="form" :model="form" size="small"  label-width="80px">
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item prop="recSiteNum" label="网点编码">
              <el-input v-model.trim="form.recSiteNum" placeholder="请输入充电网点编码" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
           <div class="orgList">
            <el-form-item prop="orgId" label="组织机构">
              <treeselect
                v-model="form.orgId"
                :default-expand-level="1"
                :options="deptOptions"
                @open="openOrgList"
                placeholder="请选择组织机构"/>
            </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="chargGroupName" label="网点名称">
              <el-input
                v-model.trim="form.chargGroupName"
                placeholder="请输入充电网点名称"
              />
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item prop="areaId" label="地市">
              <el-select
                      v-model="form.areaId"
                      @change="areaFn"
                      placeholder="请选择地市"
                      :clearable="true"
              >
                <el-option
                        v-for="item in cityList"
                        :key="item.areaCode"
                        :label="item.areaName"
                        :value="item.areaCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item prop="area" label="片区">
              <el-select v-model="form.area"
              :placeholder="form.areaId ? '请选择片区' : '请先选择地市'">
                <el-option
                        v-for="(item, index) in areaList"
                        :key="index"
                        :label="item.areaName"
                        :value="item.areaCode"
                        :clearable="true"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="chargGroupNature" label="站点类型">
              <el-select
                      v-model="form.chargGroupNature"
                      placeholder="请选择站点类型"
                      ref="stageSelect"
                      :clearable="true"
              >
                <el-option
                        v-for="item in dictInfo.chargGroupNature"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
            <el-col :span="6">
            <el-form-item prop="paymentMeth" label="支付方式">
              <el-select
                multiple
                v-model="paymentMethList"
                placeholder="请选择支付方式"
                :clearable="true"
              >
                <el-option
                  v-for="item in dictInfo.paymentMeth"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="address" label="地址">
              <el-input v-model.trim="form.address" placeholder="请输入地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="24" style="text-align: right;">
             <el-form-item>
           <el-button size="mini" type="primary" @click="queryFn">
            查询
          </el-button>
          <el-button  @click="resetSearch">重置</el-button>
             </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--表格渲染-->
    <el-card class="topCard"  style="margin-bottom: 15px">
      <div class="head-container">
        <div style="margin-bottom: 8px">
          <el-button type="primary" icon="el-icon-plus" @click="addFn" class="btn">增加</el-button>
           <el-button class="btn" @click="handleImport">
            <i class="iconfont icon-daoru"></i> 导入
          </el-button>
          <el-button class="btn" @click="handleExport">
            <i class="iconfont icon-daochu" :loading="showLoading"></i> 导出
          </el-button>
        </div>
      </div>
      <!-- <div class="line"></div> -->
      <el-table
        ref="table"
        border
        :header-cell-style="tableHeaderStyle"
        :data="tableData"
        style="width: 100%;"
      >
        <el-table-column
          prop="recSiteNum"
          align="center"
          width="200"
          label="网点编码"
          show-overflow-tooltip
          fixed
        />
        <el-table-column
          prop="chargGroupName"
          align="center"
          width="160"
          label="充电网点名称"
          show-overflow-tooltip
          fixed
        />
        <el-table-column
          prop="nameCn"
          align="center"
          label="归属组织机构"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="disCapBranch"
          align="center"
          label="装机容量(kW)"
          width="140"
          show-overflow-tooltip
        />
        <el-table-column
          prop="disCapTotal"
          align="center"
          label="配电容量(kW)"
          width="140"
          show-overflow-tooltip
        />
        <el-table-column align="center" label="是否有人值守" width="160">
          <template slot-scope="scope">
            {{ scope.row.ifOnDuty === "0" ? "否" : "是" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          align="center"
          label="地址"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="chargePerson"
          align="center"
          label="负责人"
          width="120"
        />
        <el-table-column align="center" label="状态" width="110">
          <template slot-scope="scope">
            {{ scope.row.delState === "0" ? "启用" : "停用" }}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="140">
          <template slot-scope="scope">
            <el-link
              class="btn1"
              @click="previewFn(scope.row)"
              title="详情"
              type="primary"
              :underline="false"
              >
            详情
            </el-link>
            <el-link
              class="btn1"
              @click="editFn(scope.row)"
              type="primary"
              title="修改"
              :underline="false"
              >
             修改
            </el-link
            >
            <el-link
              class="btn1"
              :underline="false"
              @click="changeStatus(scope.row)"
              type="primary"
              >{{ scope.row.delState === "0" ? "停用" : "启用" }}</el-link
            >
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
            :total="total">
        </el-pagination>
      </div>
    </el-card>
    <!-- 新增数据弹出框 -->
    <div v-if="addDialogShow">
    <el-dialog
       v-dialogDrag
      :visible.sync="addDialogShow"
      @close="closeView"
      width="1200px"
      :close-on-click-modal="false"
      :title="title"
    >
      <addDteail
          :deptOption="deptOptions"
          :areaIds="cityList"
          :chargeAttributes="chargeAttribute"
          :openRanges="openRange"
          :dialogForms="dialogForm"
          :listType="listType"
          @closeView="closeView(arguments)"
      ></addDteail>
    </el-dialog>
    </div>

    <!-- 网点详情 -->
    <DetailItem v-if="showDetail" :dialogForms="dialogForm" :deptOption="deptOptions"
          :cityAreaList="cityList"  @closeView="closeView(arguments)"/>

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
        <!-- :action="upload.url + '?updateSupport=' + upload.updateSupport" -->
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <!-- <el-checkbox
            v-model="upload.updateSupport"
          />是否更新已经存在的数据 -->
         <el-link type="primary" :underline="false" style="font-size:13px" @click="importTemplate"
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
            title="充电网点导入失败结果"
             append-to-body
            :visible.sync="showImport"
            width="800px"
            :before-close="handleCloseImport"
            >
            <div class="importDialog">
            <download-excel
              v-if="execlData.length > 0"
              style="width: 100px"
              :data="execlData"
              :fields="execlFileds"
              name = "充电网点导入失败结果.xls">
              <el-button type="primary" size="small">导出EXCEL</el-button>
        </download-excel>
            <table>
            <tr>
                <th style="width: 80px;">行号</th>
                <th style="width: 480px;">错误信息</th>
            </tr>
            <tr v-for="(item, index) in importErrorKeyList" :key="index">
                <td>{{item}}</td>
                <td>{{importErrorValueList[index]}}</td>
            </tr> 
            </table>
         </div>
          </el-dialog>
      </div>

  </div>
</template>

<script>
import {
  chargGroupInfo,
  editchargGroupInfo,
  getAreaId,
  exportFile,
  getOrganization,
} from "@/api/asset/charggroupinfo";
import addDteail from "./addDetail";
import DetailItem from './detailItem';
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
        title:'新增网点',
        listType: 1, // 1 新增， 2 详情， 3 修改
        showDetail: false,
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
          url: "/app/assets/charggroup/importData",
      },
      // 表单数据
      form: {
        chargGroupName: "",
        orgId: null,
        areaId: "",
        area: "",
        chargGroupNature: "",
        paymentMeth: "",
        address: "",
        chargePerson: "",
        recSiteNum: "",
        chargGroupId: "",
        pageSize: 10,
        pageNum: 1,
      },
      paymentMethList: [], // 支付方式
      // 开放范围
      openRange: [],
      // 表格数据
      tableData: [],
      // 弹出框的表单数据
      dialogForm: {
        delState: "",
        recSiteNum: "",
        chargGroupId: "",
        chargGroupName: "",
        orgId: null,
        areaId: "",
        area: "",
        address: "",
        chargePerson: "",
        phone: "",
        ywInstitution: null,
        chargGroupNature: "",
        paymentMeth: "",
        ifUseMonitor: "",
        operateStartTime: "",
        disCapBranch: "",
        disCapTotal: "",
        ifOnDuty: "",
        ifPeopDoBus: "",
        doBusTime: "",
        doBusEndTime: "",
        openRange: "",
        remarks: "",
        longitude: "",
        latitude: "",
        nameCn: "",
      },
      showLoading: false,
      // 所属组织机构
      deptOptions: [],
      // 地市
      cityList: [],
      // 查看详情回填数据片区弹框
      viewArea: [],
      // 修改网点片区弹框
      editArea: [],
      // 添加网点片区弹框
      addArea: [],
      // 片区
      areaList: [],
      // 充电网属性
      chargeAttribute: [],
      // 查看详情弹出框显示
      viewShow: false,
      // 新增按钮弹出框
      addDialogShow: false,
      // 修改按钮弹出框
      editDialogShow: false,
      // 数据总条数
      total: 0,
      // 状态数据
      status: [
        {
          value: "2",
          label: "是",
        },
        {
          value: "1",
          label: "否",
        },
      ],
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
    addDteail, DetailItem
  },
  computed: {
    ...mapGetters(['dictInfo'])
  },
  created() {
    this.getList();
    this.getAreaId();
    this.getOrganization();
  },
  methods: {
    // 获取充电网点表格数据
    async getList() {
      const res = await chargGroupInfo(this.form);
      if(res.code === 200) {
        this.tableData = res.data.result;
        this.total = res.total;
      }
    },
    // 查询按钮
    queryFn() {
      if(this.paymentMethList.length > 0) {
        this.form.paymentMeth = this.paymentMethList.join(',');
      }else {
        this.form.paymentMeth = ''
      }
      this.form.pageNum=1;
      this.getList();
    },
     openOrgList() {
      this.$refs.stageSelect.blur();
    },
    // 获取地市列表
    async getAreaId() {
      const res = await getAreaId({areaLevel: 3});
      if(res.code === 200) {
        this.cityList = res.data.result;
      }
    },
    // 新增按钮
    addFn() {
        this.title='新增网点'
        this.listType=1;
        this.reset();
        this.addDialogShow = true;
    },
    // 查看详情方法
    previewFn(row) {
      this.dialogForm = JSON.parse(JSON.stringify(row));
      this.showDetail = true;
    },
    // 修改表格数据方法
    editFn(row) {
      this.title='修改网点'
      this.listType=3;
      this.addDialogShow = true;
      this.dialogForm = JSON.parse(JSON.stringify(row));
    },
    // 重置表单
    reset() {
      this.dialogForm = {
        delState: "",
        recSiteNum: "",
        chargGroupId: "",
        chargGroupName: "",
        orgId: null,
        areaId: "",
        area: "",
        address: "",
        chargePerson: "",
        phone: "",
        ywInstitution: null,
        chargGroupNature: "",
        paymentMeth: "",
        ifUseMonitor: "",
        operateStartTime: "",
        disCapBranch: "",
        disCapTotal: "",
        ifOnDuty: "",
        ifPeopDoBus: "",
        doBusTime: "",
        doBusEndTime: "",
        openRange: "",
        remarks: "",
      };
    },

   resetSearch() {
      this.form = {
        chargGroupName: "",
        orgId: null,
        areaId: "",
        area: "",
        chargGroupNature: "",
        paymentMeth: "",
        address: "",
        chargePerson: "",
        recSiteNum: "",
        chargGroupId: "",
        pageSize: 10,
        pageNum: 1,
      }
      this.paymentMethList = []
   },

    // 关闭弹出框事件
    closeView(val) {
        if(val) {
          if(val[0] === 1) {
             this.getList();
          }
          this.addDialogShow = false;
          this.showDetail = false
          this.reset();
        }
    },
    // form地市选择完成后获得片区的方法
    async areaFn(code) {
      this.form.area = ""
      this.areaList = []
      const res = await getAreaId({relationCode: code});
      if(res.code === 200){
        this.areaList = res.data.result;
      }
    },

    // 获取组织机构数据
    getOrganization() {
      getOrganization().then((response) => {
        if(response.code === 200) {
         this.deptOptions = response.data;
        }
      });
    },
    // 停用启用按钮
    async changeStatus(row) {
       this.$confirm(row.delState === '0' ? '是否确定停用该充电网点': '是否确定启用该充电网点', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then( async () => {
          if (row.delState === "0") {
            row.delState = "2";
          } else {
            row.delState = "0";
          }
          const res = await editchargGroupInfo(row);
          if(res.code === 200){
            this.msgSuccess(row.delState === "0" ? '充电网点停用成功' : '充电网点启用成功');
            this.getList();
          }
        }).catch(() => {})
    },
    // 导出按钮
    async handleExport() {
      this.showLoading = true
      const res = await exportFile(this.form);
        if (res && res.size > 0) {
          this.isExcel("xlsx", "充电网点信息表", res);
        }else {
          this.$message({
            type: "error",
            message: '充电网点信息导出失败'
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
          document.body.removeChild(link);
          this.msgSuccess("导出成功");
      },
    // 导入操作
    handleImport() {
      this.upload.title = "充电网点信息导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      let hrefStr = encodeURI(
        "/app/assets/download/excel?filename=" + "充电网点管理导入模板"
      );
      // window.location.href = hrefStr;
      const link = document.createElement("a");
      link.href = hrefStr
      link.style.display = "none";
      link.setAttribute("download", `充电网点管理导入模板.xlsx` );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    // 文件上传中处理
    handleFileUploadProgress() {
       this.loading = this.$loading({
          lock: true,
          text: '正在导入',
          spinner: 'el-icon-loading',
          background: 'transparent'
      });
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response) {
      if(response.code === 200) {
       this.$message({
         type: 'success',
         message: '充电网点信息导入成功'
       })
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.loading.close()
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

    handleSizeChange(pageSize) {
      this.form.pageNum = 1
      this.form.pageSize = pageSize
      this.getList()
    },
     handleCurrentChange(currentPage) {
      this.form.pageNum = currentPage;
      this.getList()
    },
  },
};
</script>

<style scoped>
.topCard {
  margin-top: 10px;
  background-color: #fff;
  min-height: calc(100vh - 280px);
}

table {
  border-collapse: collapse;
  width: 100%;
  margin: 10px 0 20px 0;
}

th, td {
  text-align: center;
  padding: 8px;
  color: #666;
  border: 1px solid #cfcfcf;
}

th {
  background-color: #f2f2f2;
  color: #666;
}

</style>
