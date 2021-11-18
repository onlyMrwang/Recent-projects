<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="card">
      <el-form ref="form" :model="form" size="small" label-width="80px">
        <el-row :gutter="5">
          <el-col :span="6">
            <div class="orgList">
            <el-form-item label="组织机构">
              <treeselect
                v-model="form.orgId"
                :options="deptOptions"
                :default-expand-level="1"
                placeholder="选择归属组织机构"
              /> 
              </el-form-item>
              </div>
            </el-col>
          <el-col :span="6">
            <el-form-item label="车牌号">
              <el-input v-model.trim="form.carNumber" clearable placeholder="请选择车牌号" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="卡用途">
              <el-select v-model="form.cardPurpose" clearable placeholder="请选择卡用途">
                <el-option
                  v-for="item in dictInfo.cardPurpose"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item label="卡状态">
              <el-select v-model="form.status" clearable placeholder="请选择卡状态">
                <el-option
                        v-for="item in dictInfo.cardStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
            <!--  -->
        </el-row>
        <el-row :gutter="5">
          <el-col :span="10">
            <el-form-item label="卡号段">
              <div class="cardInp">
                <el-input v-model.trim="form.cardCodeBefore" clearable placeholder="前卡号段" />
               <div> <i class="el-icon-right"></i></div>
                <el-input v-model.trim="form.cardCodeEnd" clearable  placeholder="后卡号段" />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="14" style="text-align: right;">
            <el-button type="primary" @click="queryFn">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 表格渲染 -->
    <el-card class="topCard"  style="margin-bottom: 15px">
      <div class="head-container">
        <div style="margin-bottom: 8px;">
          <el-button type="primary" size="mini" class="btn" @click="cardFn">卡入库</el-button>

            <el-button class="btn" @click="handleImport">
            <i class="iconfont icon-daoru"></i> 导入
          </el-button>
        </div>
      </div>
      <!-- <div class="line"></div> -->
      <el-table
        border
        :header-cell-style="tableHeaderStyle"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column label="卡号" prop="cardCode" align="center">
        </el-table-column>
        <el-table-column label="卡状态" align="center">
          <template slot-scope="scope">
            {{ dictInfo.cardStatusObj[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column prop="nameCn" label="组织机构" align="center">
        </el-table-column>
        <el-table-column prop="carNumber" label="车牌号" align="center">
          <template slot-scope="scope">
             <div v-if="scope.row.cardPurpose == '0'">{{scope.row.carNumber || null}}</div>
             <div v-else>{{scope.row.licensePriva || null}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="cardPurpose" label="卡用途" align="center">
          <template slot-scope="scope">
             {{dictInfo.cardPurposeObj[scope.row.cardPurpose]}}
          </template>
        </el-table-column>
      </el-table>
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
    <!-- 卡入库弹窗 -->
    <div v-if="cardShow">
    <el-dialog v-dialogDrag :visible.sync="cardShow" :close-on-click-modal="false" width="700px" title="卡入库">
      <el-form
           size="mini"
           label-width="80px"
           :rules="rules"
           :model="dialogForm"
           ref="dialogform">
          <div class="cardInp">
            <div style="margin-left: 30px">
            <el-form-item label="卡号段 : " prop="cardCodeBefore">
              <el-input  minLength="16"  maxlength="16" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" v-model.trim="dialogForm.cardCodeBefore"  />
            </el-form-item>
            </div>
             <!-- <div style="margin: -20px 0 0 80px"> <i class="el-icon-right"/> </div> -->
            
             <div>
              <el-form-item  prop="cardCodeEnd">
              <el-input  minLength="16" maxlength="16" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" v-model.trim="dialogForm.cardCodeEnd"  />
            </el-form-item></div>
          </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitFn">确 定</el-button>
        <el-button size="mini" @click="closeView">取 消</el-button>
      </span>
    </el-dialog>
    </div>


    <!-- 充电卡导入 -->
     <el-dialog
      v-dialogDrag
      title="充电卡导入"
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
          <!-- <el-checkbox v-model="upload.updateSupport" />
          是否更新已经存在的数据 -->
         <el-link type="primary" :underline="false" style="font-size:13px" @click="importTemplate">下载模板
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
            title="充电卡导入失败结果"
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
              name = "充电卡导入失败结果.xls">
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
import { chargeCard, addChargeCard } from "@/api/asset/chargecard.js";
import { getOrganization } from "@/api/asset/charggroupinfo";
import{ mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters(['dictInfo'])
    },
  data() {
    var NumLength = (rule, value, callback) => {
      if (value.length !== 16) {
            callback(new Error("请输入正确的卡号段"));
        } else {
            callback();
        }
    }
    return {
        rules:{
            cardCodeBefore: [{required: true, message: '请输入卡号段', trigger: "blur"},
            {validator: NumLength,  message: '请输入正确的卡号段(16位)', trigger: "blur"}],
            cardCodeEnd: [{required: true, message: '请输入卡号段', trigger: "blur"},
            {validator: NumLength,  message: '请输入正确的卡号段(16位)', trigger: "blur"}],
        },
      upload: {
        open: false,
        isUploading: false,
        updateSupport: 0,
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        url: "/app/assets/card/importData",
      },
      // 表单数据
      form: {
        cardCodeBefore: "",
        cardCodeEnd: "",
        status: "",
        orgId: null,
        carNumber: "",
        cardPurpose: "",
        pageSize: 10,
        pageNum: 1,
      },
      // 弹出框表单
      dialogForm: {
        cardCodeBefore: undefined,
        cardCodeEnd: undefined,
      },
      tableData: [],
      // 卡状态下拉框
      status: [],
      // 组织机构下拉框
      deptOptions:[],
      // 弹出框显示隐藏
      cardShow: false,
      // 总条数
      total:0,
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
  created() {
    this.getList();
    this.getOrganization();
  },
  methods: {
    // 获取充点卡信息列表
    async getList() {
      const res = await chargeCard(this.form);
      if(res.code === 200) {
        this.tableData = res.data.result;
        this.total = res.total 
      }
    },
    // 表格数据回填参数车辆类型改写
    editStatus(type) {
        if(type!=null){
            this.dictInfo.cardStatus.forEach((item) => {
                if (item.value === type) {
                    type = item.label;
                }
            });
        }
      return type;
    },
    // 查询按钮
    async queryFn() {
      this.form.pageNum = 1
      const res = await chargeCard(this.form);
      if(res.code === 200) {
        this.tableData = res.data.result;
        this.total = res.total
      }
    },

    handleImport() {
      this.upload.open = true;
    },

     /** 下载模板操作 */
    importTemplate() {
      let hrefStr = encodeURI(
        "/app/assets/download/excel?filename=" + "充电卡信息导入模板"
      );
      // window.location.href = hrefStr;
      const link = document.createElement("a");
      link.href = hrefStr
      link.style.display = "none";
      link.setAttribute("download", `充电卡信息导入模板.xlsx` );
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
         message: '充电卡信息导入成功'
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
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },

    resetSearch() {
        this.form = {
        cardCodeBefore: "",
        cardCodeEnd: "",
        status: "",
        orgId: null,
        carNumber: "",
        cardPurpose: "",
        pageSize: 10,
        pageNum: 1,
      }
    },

    // 打开卡入库弹框
    cardFn() {
      this.cardShow = true;
      this.dialogForm = {
        cardCodeBefore: undefined,
        cardCodeEnd: undefined,
      };
    },
    // 关闭卡入库弹框
    closeView() {
      this.cardShow = false;
    },
    handleCloseImport() {
      this.showImport = false
    },
    // 提交按钮
     submitFn() {
      this.$refs.dialogform.validate(async (valid) => {
        if(valid) {
          const res = await addChargeCard(this.dialogForm);
          if(res.code === 200) {
            this.$message({
              type: 'success',
              duration: 2000,
              message: `${this.dialogForm.cardCodeBefore} - ${this.dialogForm.cardCodeEnd}已成功入库`
            })
          this.getList();
          this.cardShow = false;
          }
        }
      })
    
    },
     handleSizeChange(size) {
      this.form.pageNum = 1
      this.form.pageSize = size;
      this.getList();
      
    },
     handleCurrentChange(currentPage) {
      this.form.pageNum = currentPage;
      this.getList();
    },
    // 获取组织机构数据
    getOrganization() {
      getOrganization().then((response) => {
        if(response.code === 200) {
         this.deptOptions = response.data 
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.topCard {
  margin-top: 10px;
  background-color: #fff;
  min-height: calc(100vh - 230px);
}
.cardInp {
  /* width: 245px !important; */
  display: flex;
  align-items: center;
}
.el-icon-right {
  /* width: 10px; */
  margin-right: 20px;
  margin-left: -20px;
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
