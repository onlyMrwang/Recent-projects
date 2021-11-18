<template>
  <div class="app-container">
    <div class="card">
      <el-form ref="form" :model="form" size="small" label-width="80px">
        <el-row :gutter="5">
        <el-col :span="6">
          <el-form-item prop="facturerType" label="厂商类型">
            <el-select v-model="form.facturerType" :clearable="true" @change="changeFactureType" filterable placeholder="请选择厂商类型">
              <el-option
                v-for="item in dictInfo.facturerType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="facturerName"  label="厂商名称">
            <el-select v-model="form.facturerName" :clearable="true" filterable 
            :placeholder="form.facturerType ? '请选择厂商名称' : '请先选择厂商类型'">
              <el-option
                v-for="item in facturerName"
                :key="item.facturerNum"
                :label="item.facturerName"
                :value="item.facturerName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="text-align: right;">
        <el-button size="mini" type="primary" @click="queryFn">查询</el-button>
          <el-button  @click="resetSearch">重置</el-button>
        </el-col>
        </el-row>
      </el-form>
    </div>
    <!--表格渲染-->
    <el-card class="topCard"  style="margin: 10px 0 15px 0">
      <div class="head-container">
        <div style="margin-bottom: 8px;">
          <el-button size="mini" icon="el-icon-plus" @click="addFn" class="btn" type="primary">增加</el-button
          >
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        :header-cell-style="tableHeaderStyle"
        style="width: 100%"
      >
        <el-table-column
          label="厂商编号"
          prop="facturerNum"
          align="center"
          show-overflow-tooltip 
        >
        </el-table-column>
        <el-table-column label="厂商类型" align="center"  show-overflow-tooltip >
          <template slot-scope="scope">
            {{dictInfo.facturerTypeObj[scope.row.facturerType]}}
          </template>
        </el-table-column>
        <el-table-column prop="facturerName" label="厂商名称" align="center"  show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            {{ scope.row.state === 0 ? "启用" : "停用" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button class="btn1" type="text" @click="lookFn(scope.row)" title="查看详情"><i class="el-icon-view"></i></el-button> -->
            <el-link class="btn1" type="primary" :underline="false" @click="editFn(scope.row)" title="修改">修改</el-link>
            <el-link class="btn1" type="primary" :underline="false" @click="delFn(scope.row)">{{ scope.row.state === 0 ? "停用" : "启用"}}</el-link>
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
    <!-- 查看详情弹出框 -->
    <div v-if="show">
    <el-dialog v-dialogDrag :visible.sync="show" width="50%" title="查看厂商详情">
      <el-form size="mini" :model="dialogForm" label-width="120px">
        <el-row>
          <el-form-item label="厂商编码 : ">
            <el-input disabled v-model="dialogForm.facturerNum"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
            <el-form-item label="厂商类型 : ">
              <el-select
                      v-model="dialogForm.facturerType"
                      disabled
                      placeholder="请选择厂商类型"
              >
                <el-option
                        v-for="item in dictInfo.facturerType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="厂商名称 : ">
              <el-select
                      v-model="dialogForm.facturerName"
                      disabled
                      placeholder="请选择厂商名称"
              >
                <el-option
                        v-for="item in facturerName"
                        :key="item.facturerNum"
                        :label="item.facturerName"
                        :value="item.facturerName"
                >
                </el-option>
              </el-select>
            </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
    </div>
    <!-- 新增修改弹出框 -->
    <div v-if="addShow">
    <el-dialog v-dialogDrag :visible.sync="addShow" width="50%" :title="title">
      <el-form
        size="medium"
        ref="dialogForm"
        :rules="rules"
        :model="dialogForm"
        label-width="120px"
      >
        <el-row>
            <el-form-item
                    label="厂商编码 : "
                    prop="facturerNum"
                    v-if="dialogForm.facturerNum"
            >
              <el-input v-model="dialogForm.facturerNum" disabled></el-input>
            </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="厂商名称 : " prop="facturerName">
              <el-input v-model.trim="dialogForm.facturerName" maxlength="32" placeholder="请输入厂商名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="厂商类型 : " prop="facturerType">
              <el-select v-model="dialogForm.facturerType" :disabled="title === '修改厂商'" filterable placeholder="请选择厂商类型">
                <el-option
                        v-for="item in dictInfo.facturerType"
                        :key="item.value"
                        :label="item.label"
                        :value="Number(item.value)"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitFn">确 定</el-button>
        <el-button size="mini" @click="closeView">取 消</el-button>
      </span>
    </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getFacturer,
  addFacturer,
  editFacturer,
  upDateList
} from "@/api/asset/manufacturer.js";
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
        title:'',
      // 表单验证
      rules: {
        facturerType: [
          { required: true, message: "请选择厂商类型", trigger: "blur" },
        ],
        facturerName: [
          { required: true, message: "请输入厂商名称", trigger: "blur" },
        ],
      },
      // 查询表单
      form: {
        facturerType: "",
        facturerName: "",
        pageSize: 10,
        pageNum: 1,
      },
      // 数据总条数
      total:0,
      // 厂商类型下拉框数据
      facturerType: [],
      // 厂商名称下拉框数据
      facturerName: [],
      // dialog弹出框表单
      dialogForm: {
        facturerType: "",
        facturerName: "",
        facturerNum: "",
      },
      // table表格数据
      tableData: [],
      // 查看详情弹出框显示
      show: false,
      // 添加修改弹出框
      addShow: false,
    };
  },
 computed: {
   ...mapGetters(['dictInfo'])
 },
  created() {
    this.getList();
    // this.getName()
  },
  methods: {
    // 获取数据列表
    async getList() {
      const res = await getFacturer(this.form);
      if(res.code === 200) {
       this.tableData = res.data.result;
       this.total = res.total 
      }
    },
    // 获取厂商名称下拉数据
    // async getName(){
    //   const res = await getFacturer({
    //     facturerType: "",
    //     facturerName: "",
    //   });
    //   if(res.code === 200) {
    //      this.facturerName = res.data.result;
    //   }
    // },
    // 查询按钮
     queryFn() {
        this.form.pageSize = 10;
        this.form.pageNum = 1;
        this.getList();
    },

    resetSearch() {
      this.form = {
        facturerType: "",
        facturerName: "",
        pageSize: 10,
        pageNum: 1,
      }
    },

    changeFactureType(val) {
      this.form.facturerName = ''
      if(val) {
        this.facturerName = []
        this.toFetchNames(val)
      }
    },

    async toFetchNames(val) {
      const data = {
        pageNum: 1,
        pageSize: 1000,
        facturerType: val
      }
        const rsp = await getFacturer(data)
        if(rsp.code === 200) {
          this.facturerName = rsp.data.result;
        }
    },

    // 查看详情按钮
    lookFn(row) {
      this.show = true;
      this.dialogForm = row;
    },
    // 关闭弹出框
    closeView() {
      this.show = false
      this.addShow = false
      this.$refs.dialogForm.resetFields();
    },
    // 修改按钮
    editFn(row) {
      this.title='修改厂商'
      this.addShow = true;
      this.dialogForm = JSON.parse(JSON.stringify(row));
    },
    // 启用停用按钮
    async delFn(row) {
        this.$confirm(row.state === 0 ? '是否确定停用该厂商': '是否确定启用用该厂商', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
        }).then(async () => {
        const res = await upDateList(row);
        if(res.code === 200) {
          this.msgSuccess(row.state === 0 ? '厂商停用成功' : '厂商启用成功');
          this.getList();
        }
        }).catch(() => {})
    },
    // 添加按钮
    addFn() {
      this.title='新增厂商'
      this.addShow = true;
      this.dialogForm = {
        facturerType: "",
        facturerName: "",
        facturerNum: "",
      };
    },
    // 添加或者修改的提交按钮
    submitFn() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          if (this.dialogForm.facturerNum) {
            const res = await editFacturer(this.dialogForm);
            if(res.code === 200) {
             this.$message({
               type: 'success',
               message: '厂商信息修改成功'
             })
               this.addShow = false;
               this.getList();
              //  this.getName();
            }
           
          } else {
            const res = await addFacturer(this.dialogForm);
            if(res.code === 200) {
              this.$message({
               type: 'success',
               message: '厂商新增成功'
              })
               this.addShow = false;
               this.getList();
              //  this.getName();
            }
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
  }
}
</script>