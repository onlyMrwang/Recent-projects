<template>
  <div class="app-container">
    <div class="card">
      <el-form ref="form" :model="form" size="small" label-width="80px">
        <el-row :gutter="5">
          <el-col :span="6">
            <div class="orgList">
              <el-form-item label-width="100px" prop="workOrgId" label="所属组织机构">
                <treeselect
                  v-model="form.workOrgId"
                  :default-expand-level="1"
                  :options="deptOptions"
                  :normalizer="normalizer"
                  @open="openOrgList"
                  placeholder="请选择所属组织机构"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="staffCode" label="工作编号">
              <el-input v-model.trim="form.staffCode" placeholder="请输入工作编号" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="workName" label="姓名">
              <el-input v-model.trim="form.workName" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="ifDriver" label="是否司机">
              <el-select
                v-model.trim="form.ifDriver"
                clearable
                placeholder="请选择是否司机"
              >
                <el-option
                  v-for="item in status"
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
            <el-form-item label-width="130px" prop="isPrivateRecharge" label="是否开通私人充电">
              <el-select
                clearable
                ref="stageSelect"
                v-model="form.isPrivateRecharge"
                placeholder="请选择是否开通私人充电"
              >
                <el-option
                  v-for="item in status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="130px" prop="isPrivateRecharge" label="是否开通APP登录">
              <el-select
                clearable
                v-model="form.openAppAcc"
                placeholder="请选择是否开通APP登录"
              >
                <el-option
                  v-for="item in status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button size="mini" type="primary" @click="queryFn"
              >查询</el-button
            >
            <el-button @click="resetSearch">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--表格渲染-->
    <el-card class="topCard" style="margin-bottom: 15px">
      <div class="head-container">
        <!-- <h1><span class="online"></span> 职工信息列表</h1> -->
        <div style="margin-bottom: 8px">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addFn"
            class="btn"
            >增加</el-button
          >
          <el-button class="btn" @click="handleImport">
            <i class="iconfont icon-daoru"></i> 导入
          </el-button>
          <el-button class="btn" :loading="showLoading" @click="handleExport">
            <i class="iconfont icon-daochu"></i> 导出
          </el-button>
          <el-button
            class="btn"
            type="primary"
            :disabled="changeArray.length === 0"
            @click="changePass(2)"
          >
            批量重置密码
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
        @selection-change="handleSelectionChange"
        max-height="540"
      >
        <el-table-column type="selection" fixed align="center" />
        <el-table-column
          prop="staffCode"
          align="center"
          label="工作编号"
          width="160"
          fixed
        />
        <el-table-column prop="workName" fixed align="center" label="姓名" width="120"/>
        
        <el-table-column
          prop="nameCn"
          align="center"
          label="所属组织机构"
          width="200"
        />
        <el-table-column align="center" label="是否是司机" width="160">
          <template slot-scope="scope">
            {{ scope.row.ifDriver == '0' ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否开通私人账户" width="160">
          <template slot-scope="scope">
            {{ scope.row.isPrivateRecharge == '0' ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否开通APP登录账号" width="170">
          <template slot-scope="scope">
            {{ scope.row.openAppAcc == '0' ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="appAcc"
          align="center"
          label="APP登录账号"
          width="160"
        />
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            {{ scope.row.personState === 0 ? "启用" : "冻结" }}
          </template>
        </el-table-column>
         <el-table-column
          prop="createDate"
          align="center"
          label="创建时间"
          width="160"
        />
        <el-table-column align="center" fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-link
              class="btn1"
              @click="previewFn(scope.row)"
              title="详情"
              :underline="false"
              type="primary"
            >
              详情
            </el-link>
            <el-link
              class="btn1"
              @click="editFn(scope.row)"
              title="修改"
              :underline="false"
              type="primary"
            >
              修改
            </el-link>
            <el-link class="btn1" :underline="false" @click="changeStatus(scope.row)" type="primary"
              >{{ scope.row.personState === 0 ? "冻结" : "启用" }}
            </el-link>
            <el-link
              class="btn1"
              :underline="false"
              @click="changePass(1, scope.row)"
              type="primary"
              >重置密码
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
            :total="total">
          </el-pagination>
      </div>
    </el-card>

    <!-- 新增，修改组件 -->
    <Item v-if="showPersonItem" :info="rowInfo" :type="itemType" @closeDialog="closePersonDialog(arguments)"/>
    <Detail v-if="showDetail" :info="rowInfo"  @closeDetail="closeDetailDialog"/>


<!-- 导入 -->
    <div v-if="upload.open">
      <el-dialog
        v-dialogDrag
        :title="upload.title"
        :visible.sync="upload.open"
        width="400px"
        append-to-body
        :close-on-click-modal="false"
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
            <!-- <el-checkbox v-model="upload.updateSupport" />
            是否更新已经存在的数据 -->
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
    </div>

    <div v-if="showImport">
          <el-dialog
            :close-on-click-modal="false"
            v-dialogDrag
            title="职工导入结果"
            :visible.sync="showImport"
            width="800px"
             append-to-body
            :before-close="handleCloseImport"
            >
            <div class="importDialog">
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
// import AddList from './addList'
import Item from './item.vue'
import Detail from './detail.vue'
import { getEmployeeInfo, exportEmployeeInfo, upDateList, changePass } from "@/api/asset/employeeinfo";
import { getOrganization, getGroup } from "@/api/asset/charggroupinfo";
export default {
  components: {
    // AddList
    Item, Detail
  },
  data() {
    return {
      showDetail: false,
      showPersonItem: false,
      rowInfo: null,
      itemType: 1,
      changeArray: [], //存重置密码数组
      listType: 1,
      // 表单数据
      form: {
        pageNum: 1,
        pageSize: 10,
        workOrgId: null,
        workName: "",
        workNumber: "",
        workersId: "",
        ifDriver: "",
        isPrivateRecharge: "",
        openAppAcc: "",
      },
      // 数据总条数
      total: 0,
      showLoading: false,
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
        url: "/app/assets/basic/importData",
      },
      // 弹出框标题
      title: "",
      // 表格数据
      tableData: [],
      // 弹出框的表单数据
      dialogForm: {
        appAcc: "",
        openAppAcc: 1,
        workersId: "",
        workNumber: "",
        workName: "",
        workAreaCode: "",
        workOrgId: null,
        photo: "",
        staffCode: "",
        email: "",
        phone: "",
        staffGroup: "",
        staffSubsidiary: "",
        ifDriver: 1,
        staffDept: "",
        emergencyRole: "",
        driverAccount: "",
        ifOpenCard: "1",
        pubAccountAmt: "",
        isPrivateRecharge: 1,
        licensePriva: "",
        cardModel: "",
        cardType: "",
        entityCard: "",
        inventedCardNum: "",
        inventedAmt: "",
      },
      // 图片显示
      dialogVisible: false,
      // 所属组织机构
      deptOptions: [],
      // 新增按钮弹出框
      addDialogShow: false,
      // 集团名称
      staffGroup: [],
      // 子公司
      staffSubsidiary: [],
      // 部门
      staffDept: [],
      // 状态数据
      status: [
        {
          value: 0,
          label: "是",
        },
        {
          value: 1,
          label: "否",
        },
      ],
      showImport: false, // 是否展示导入结果
      importErrorKeyList: [], // 导入失败key
      importErrorValueList: [], // 导入失败value
      loading: null
    };
  },

  created() {
    this.getList();
    this.getOrganization();
    this.getGroup();
  },
  methods: {
    //重置员工密码
    async changePass(type, val) {
      let listType = [];
      if (type == 1) {
        listType.push(val);
      } else {
        listType = this.changeArray;
      }
      const res = await changePass(listType);
      if (res.code === 200) {
        this.changeArray = [];
        this.msgSuccess("密码重置成功,重置密码为123456");
        this.getList();
      }
    },
    handleSelectionChange(val) {
      this.changeArray = val;
    },
    // 获取职工信息表格数据
    async getList() {
      const res = await getEmployeeInfo(this.form);
      if (res.code === 200) {
        this.tableData = res.data.result;
        this.total = res.total;
      }
    },
    // 获取集团名称下拉框数据
    async getGroup() {
      const res = await getGroup();
      if (res.code === 200) {
        this.staffGroup = res.data.result;
      }
    },

    resetSearch() {
       this.form = {
        pageNum: 1,
        pageSize: 10,
        workOrgId: null,
        workName: "",
        workNumber: "",
        workersId: "",
        ifDriver: "",
        isPrivateRecharge: "",
        openAppAcc: "",
      }
    },

    // 查询按钮
    queryFn() {
      this.form.pageNum = 1;
      this.getList();
    },
    // 新增按钮
    addFn() {
      this.rowInfo = this.dialogForm
      this.itemType = 1
      this.showPersonItem = true
    },

     handleSizeChange(pageSize) {
      this.form.pageNum = 1
      this.form.pageSize = pageSize
      this.getList()
    },
    // // 查看详情方法
    previewFn(row) {
      this.rowInfo = JSON.parse(JSON.stringify(row));
      this.showDetail = true
    },
    // // 修改表格数据方法
    editFn(row) {
      this.rowInfo = JSON.parse(JSON.stringify(row));
      this.itemType = 2
      this.showPersonItem = true;
    },
    closePersonDialog(val) {
        if(val) {
            if(val[0] === 1) {
                this.getList()
            } 
            this.showPersonItem = false
            this.rowInfo = {}
            this.reset()
        }
    },
    closeDetailDialog() {
      this.reset()
      this.showDetail = false
      this.rowInfo = {}
    },
    // 重置表单
    reset() {
      this.dialogForm = {
        appAcc: "",
        openAppAcc: 1,
        workersId: "",
        workNumber: "",
        workName: "",
        workAreaCode: "",
        workOrgId: null,
        photo: "",
        staffCode: "",
        email: "",
        phone: "",
        staffGroup: "",
        staffSubsidiary: "",
        ifDriver: 1,
        staffDept: "",
        emergencyRole: "",
        driverAccount: "",
        ifOpenCard: "",
        pubAccountAmt: "",
        isPrivateRecharge: 1,
        licensePriva: "",
        cardModel: "",
        cardType: "",
        entityCard: "",
        inventedCardNum: "",
        inventedAmt: "",
      };
    },
     openOrgList() {
      this.$refs.stageSelect.blur();
    },
    // 关闭弹出框事件
    closeView() {
      // this.pageList.pageNum = 1;
      this.addDialogShow = false;
      this.getList();
    },
    // 获取组织机构数据
    getOrganization() {
      getOrganization().then((response) => {
        if (response.code === 200) {
          this.deptOptions = response.data;
        }
      });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children,
      };
    },
    // 停用启用按钮
   changeStatus(row) {
       this.$confirm(row.personState === 0 ? '是否确定冻结此职工账号': '是否确定启用此职工账号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then( async () => {
           const res = await upDateList(row);
          if (res.code === 200) {
            this.msgSuccess(row.personState === 0 ? '账号冻结成功' : '账号启用成功');
            this.getList();
          }
        }).catch(() => {})
    },
    // 导出按钮
    async handleExport() {
      this.showLoading = true
      const res = await exportEmployeeInfo(this.form);
      if (res && res.size > 0) {
        this.isExcel("xlsx", "职工信息表", res); 
      }else {
        this.$message({
          type: "error",
          message: '职工信息导出失败'
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
      this.upload.title = "职工信息导入";
      this.upload.open = true;
    },

    handleCloseImport() {
      this.showImport = false
    },
    /** 下载模板操作 */
    importTemplate() {
      let hrefStr = encodeURI(
        "/app/assets/download/excel?filename=" + "职工信息管理导入模板"
      );

      // window.location.href = hrefStr;
      const link = document.createElement("a");
      link.href = hrefStr
      link.style.display = "none";
      link.setAttribute("download", `职工信息管理导入模板.xlsx` );
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
         message: '职工信息导入成功'
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
          this.showImport = true  
        }else {
            this.$message({
                type: 'error',
                message: response.message || '导入失败'
            })
        }
    }
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    // 点击已上传的沟子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    handleCurrentChange(currentPage) {
      this.form.pageNum = currentPage;
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/global.scss";
.topCard {
  margin-top: 10px;
  background-color: #fff;
  min-height: calc(100vh - 230px);
}
.btn1 {
  margin-right: 10px;
}

.center {
  display: flex;
  align-items: center;
  /* justify-content: space-around; */
}

.el-upload-list--picture .el-upload-list__item {
  margin-top: -40px;
}

.el-input__suffix {
  margin: 0 !important;
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
