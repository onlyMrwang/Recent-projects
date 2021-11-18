<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="card">
      <el-form ref="form" :model="form" size="small" label-width="90px">
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item prop="manufacturId" label="网点">
              <el-select
                @change="chargGroupClick"
                clearable
                filterable
                v-model="form.chargGroupId"
                placeholder="请选择网点"
              >
              <el-option
                v-for="item in chargGroupId"
                :key="item.chargGroupId"
                :label="item.chargGroupName"
                :value="item.chargGroupId"
                >
              </el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item prop="robotName" label="机器人名称">
              <el-select
                      v-model="form.robotName"
                      clearable
                      filterable
                      :placeholder="form.chargGroupId ? '请选择机器人名称' : '请先选择网点'"
              >
                <el-option
                        v-for="item in robotMark"
                        :key="item.assetNum"
                        :label="item.robotName"
                        :value="item.robotName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="assetNum" label="机器人编号">
                 <el-select
                      v-model="form.assetNum"
                      clearable
                      filterable
                      :placeholder="form.chargGroupId ? '请选择机器人编号' : '请先选择网点'"
               >
                <el-option
                        v-for="item in robotMark"
                        :key="item.assetNum"
                        :label="item.assetNum"
                        :value="item.assetNum"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item prop="robotMark" label="机器人型号">
              <el-input
                      v-model.trim="form.robotMark"
                      clearable
                      placeholder="请输入机器人型号"
              />
            </el-form-item>
          </el-col> 

        </el-row>
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item prop="manufacturId" label="厂商">
              <el-select
                v-model="form.manufacturId"
                clearable
                filterable
                placeholder="请选择厂商"
              >
                <el-option
                  v-for="item in manufacturId"
                  :key="item.facturerId"
                  :label="item.facturerName"
                  :value="item.facturerId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="18" style="text-align: right;">
            <el-button size="mini" type="primary" @click="queryFn">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--表格渲染-->
    <el-card class="topCard" style="margin-bottom: 15px">
      <div class="head-container">
        <div style="margin-bottom: 8px">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addFn"
            class="btn"
            >增加
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
        :data="tableData"
        style="width: 100%;"
        border
        :header-cell-style="tableHeaderStyle"
      >
        <el-table-column
          prop="assetNum"
          fixed="left"
          align="center"
          label="充电机器人编号"
          show-overflow-tooltip
          width="200"
        />
        <el-table-column
          prop="robotName"
          align="center"
          label="机器人名称"
          show-overflow-tooltip
          width="150"
        />
        <el-table-column prop="robotMark" align="center" label="机器人型号" width="120"  show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center" label="厂商"  show-overflow-tooltip width="150">
          <template slot-scope="scope">
            {{ editType(scope.row.manufacturId) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="facturPerson"
          align="center"
          label="厂商联系人"
          width="130"
          show-overflow-tooltip
        />
        <el-table-column prop="facturPhone" align="center" label="厂商电话" show-overflow-tooltip  width="120"/>
        <el-table-column prop="nameCn" align="center" label="所属组织机构" show-overflow-tooltip  width="180"/>
        <el-table-column
          width="160"
          prop="chargGroupName"
          align="center"
          label="网点名称"
          show-overflow-tooltip
        />
          <el-table-column prop="versionNum" align="center" label="软件版本号" show-overflow-tooltip  width="160"/>
        <el-table-column align="center" label="状态" width="80">
          <template slot-scope="scope">
            {{ scope.row.robotState == 0 ? "启用" : "停用" }}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-link
              class="btn1"
              @click="previewFn(scope.row)"
              type="primary"
              title="详情"
              :underline="false"
            >
             详情
            </el-link>
            <el-link
              class="btn1"
              @click="editFn(scope.row)"
              type="primary"
              :underline="false"
              title="修改"
            >
            修改
            </el-link>
            <el-link
              class="btn1"
              :underline="false"
              @click="changeStatus(scope.row)"
              type="primary"
              >{{ scope.row.robotState == 0 ? "停用" : "启用" }}
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
    <!-- 查看详情弹出框 -->
    <div v-if="robotShow">
      <DetailItem :info="dialogForm" :manufacturList="manufacturId" 
      :deptOptions="deptOptions" :chargGroupList="chargGroupId" @closeItem="closeItem"/>
    </div>
    
    
    <!-- 新增修改弹出框 -->
    <div v-if="addRobotShow">
    <el-dialog
      v-dialogDrag 
      :visible.sync="addRobotShow"
      @closed="closeFn"
      width="80%"
      :title="title"
    >
      <el-form
        ref="dialogForm"
        :model="dialogForm"
        :rules="rules"
        size="medium"
        label-width="160px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="充电机器人编号 : " prop="assetNum">
              <el-input maxlength="32" v-model.trim="dialogForm.assetNum" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="机器人名称 : " prop="robotName">
              <el-input maxlength="32" v-model.trim="dialogForm.robotName" placeholder="请输入机器人名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="机器人型号 : " prop="robotMark">
               <el-input maxlength="32" v-model.trim="dialogForm.robotMark" placeholder="请输入机器人型号"/>
            </el-form-item>
          </el-col> 
          <el-col :span="8">
            <div class="orgList">
            <el-form-item label="所属组织机构 : " prop="orgId" :show-message="!dialogForm.orgId">
              <el-input v-model="dialogForm.nameCn" disabled v-if="title === '修改充电机器人'"/>
              <treeselect
                v-else
                v-model="dialogForm.orgId"
                :options="deptOptions"
                :clearable="false"
                placeholder="请选择所属组织机构"
              />
            </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属网点" prop="chargGroupId">
              <el-select v-model="dialogForm.chargGroupId" @change="changeSite" placeholder="请选择所属网点">
                <el-option
                        v-for="item in chargGroupId"
                        :key="item.chargGroupId"
                        :label="item.chargGroupName"
                        :value="item.chargGroupId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属充电设备名称 :" prop="chargId">
              <el-select
                      v-model="dialogForm.chargId"
                      :placeholder="dialogForm.chargGroupId ? '请选择所属充电设备名称' : '请先选择所属网点'"
                      @change="changeCharge"
              >
                <el-option
                        v-for="item in chargeList"
                        :key="item.chargId"
                        :label="item.chargName"
                        :value="item.chargId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> 
          <el-col :span="8">
            <el-form-item label="所属充电设备枪号 :" prop="gunNum">
              <el-select
                      v-model="dialogForm.gunNum"
                      placeholder="请选择所属充电设备枪号"
              >
                <el-option
                        v-for="item in gunList"
                        :key="item.gunNum"
                        :label="item.gunNum"
                        :value="item.gunNum"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="厂商 : " prop="manufacturId">
              <el-select v-model="dialogForm.manufacturId" placeholder="请选择厂商">
                <el-option
                  v-for="item in manufacturId"
                  :key="item.facturerId"
                  :label="item.facturerName"
                  :value="item.facturerId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="厂商联系人 : " prop="facturPerson">
              <el-input maxlength="32" v-model.trim="dialogForm.facturPerson" placeholder="请输入厂商联系人"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="厂商电话 : " prop="facturPhone">
              <el-input maxlength="32" v-model.trim="dialogForm.facturPhone" placeholder="请输入厂商电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="维保周期(月) : " prop="revolution">
              <el-input onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" v-model.trim="dialogForm.revolution" placeholder="请输入维保周期"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购时间 : " prop="purchTime">
              <el-date-picker
                      v-model="dialogForm.purchTime"
                      type="date"
                      placeholder="请选择采购时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="安装时间 : " prop="installTime">
              <el-date-picker
                      v-model="dialogForm.installTime"
                      type="date"
                      placeholder="请选择安装时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="负责人 : " prop="userId">
              <el-input maxlength="32" v-model.trim="dialogForm.userId" placeholder="请输入负责人"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话 : " prop="phone">
              <el-input maxlength="11" v-model.trim="dialogForm.phone" placeholder="请输入电话"/>
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="出厂编号 : " prop="robotOutFactoryId" >
              <el-input maxlength="32" v-model.trim="dialogForm.robotOutFactoryId" placeholder="请输入出厂编号"/>
            </el-form-item>
          </el-col>
         
          <el-col :span="8">
            <el-form-item label="安装位置 : " prop="instalPosition">
              <el-input maxlength="32" v-model.trim="dialogForm.instalPosition" placeholder="请输入安装位置"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="参数配置 : " prop="preferences">
              <el-input maxlength="32" v-model.trim="dialogForm.preferences" placeholder="请输入参数配置"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item  label="软件版本号 :" prop="versionNum">
              <el-input maxlength="32" v-model.trim="dialogForm.versionNum" placeholder="请输入软件版本号"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" :loading="loadingBtn" @click="submitFn"
          >确 定</el-button
        >
        <el-button size="mini" @click="closeFn">取 消</el-button>
      </span>
    </el-dialog>
    </div>
   <!-- 导入 -->
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

    <div v-if="showImport">
          <el-dialog
            :close-on-click-modal="false"
            v-dialogDrag
            title="充电机器人导入失败结果"
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
              name = "充电机器人导入失败结果.xls">
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
  getRobot,
  addRobot,
  editRobot,
  upDateOrStopRobotInfo,
  exportRobot,
  getGunNum,
  getNameInfos
} from "@/api/asset/chargingrobot";
import {
  getOrganization,
  chargGroupInfo,
} from "@/api/asset/charggroupinfo";
import { getChargeBySite } from '@/api/alarm/faultalarmBase'
import { getChargManu } from '@/api/alarm/faultalarmBase'
import { mapGetters } from "vuex";
import DetailItem from './detailItem.vue'
export default {
  components: { DetailItem },
  data() {
      var Phone = (rule, value, callback) => {
        // var str = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        var str = /(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/
        if (value) {
            if (!str.test(value)) {
                callback(new Error("手机号格式不正确"));
            } else {
                callback();
            }
        } else {
            callback();
        }
    };
    // /(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/
    return {
      // 表单数据
      form: {
        orgId: null,
        assetNum: null,
        robotMark:null,
        manufacturId: null,
        pageSize: 10,
        pageNum: 1,
      },
      loadingBtn: false,
      // 数据总条数
      showLoading: false,
      total: 0,
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
        url: "/app/assets/chargrobot/importData",
      },
      // 弹出框表单
      dialogForm: {
        serialNumber: "",
        assetNum: "",
        robotMark: "",
        manufacturId: "",
        leader: "",
        linkPhone: "",
        revolution: "",
        purchTime: "",
        installTime: "",
        orgId: null,
        contacts: "",
        phone: "",
        gunNum: null,
        instalPosition: "",
        preferences: "",
        chargId: "",
        robotState: "",
        chargGroupId: "",
        robotName: null,
      },
      // 表格数据
      tableData: [],
      // 弹出框标题
      title: "",
      // 所属组织机构
      deptOptions: [],
      // 厂商
      manuFacturer: [],
      // 查看详情弹出框
      robotShow: false,
      // 新增修改弹出框
      addRobotShow: false,
      // 所属网点下拉框数据
      chargGroupId: [],
      // 厂商下拉框数据
      manufacturId: [],

      gunList: [], //枪列表
      robotMark:[],//充电机器人名称
      chargeList: [], // 充电设备列表
      //校验规则
      rules: {
        chargId: [{ required: true, message: "请选择所属充电设备名称", trigger: "change" }],
        chargGroupId: [{ required: true, message: "请输入充电网点", trigger: "change" }],
        orgId: [{ required: true, message: "请选择所属组织机构", trigger: "change" }],
        robotMark: [{ required: true, message: "请选择机器人型号", trigger: "change" }],
        robotName: [{ required: true, message: "请输入机器人名称", trigger: "blur" }],
        // revolution: [{ required: true, message: "请输入维保周期", trigger: "blur" }],
        gunId: [{ required: true, message: "请选择枪号", trigger: "change" }],
        manufacturId: [{ required: true, message: "请选择厂商", trigger: "change" }],
        chargAsstsNum: [{ required: true, message: "请输入所属充电设备编号"}],
        gunNum: [{ required: true, message: "请选择枪号", trigger: "change" }],
        // facturPerson: [{ required: true, message: "请输入厂商联系人", trigger: "blur" }],
        // purchTime: [{ required: true, message: "请选择采购时间", trigger: "change" }],
        // installTime: [{ required: true, message: "请选择安装时间", trigger: "change" }],
        // userId: [{ required: true, message: "请输入负责人", trigger: "blur" }],
        phone: [
          {required: false, message: "请输入联系电话", trigger: "blur"},
          { validator: Phone, trigger: "blur", message: "电话格式不正确"}],
        facturPhone: [
          {required: false, message: "请输入厂商电话", trigger: "blur"},
          { validator: Phone, trigger: "blur", message: '厂商电话格式不正确'}],
        // instalPosition: [{ required: true, message: "请输入安装位置", trigger: "blur" }],
        preferences: [{ required: true, message: "请输入参数配置", trigger: "blur" }],
        versionNum: [{ required: true, message: "请输入软件版本号", trigger: "blur" }],
        robotOutFactoryId: [{ required: true, message: "请输入出厂编号", trigger: "blur" }],
      },
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

  computed: {
    ...mapGetters(["dictInfo"]),
  },
  created() {
    this.getList();
    this.getOrganization();
    this.chargGroupInfo();
    this.getManufacturId();
  },
  methods: {
      handleSelect(){
        if(this.dialogForm.chargAsstsNum) {
          this.getGunNum(this.dialogForm.chargAsstsNum) 
        } 
      },
      //通过网点查询机器人名称
      chargGroupClick(val){
          this.getNameInfo(val)
      },
      //获取充电机器人名称
      async getNameInfo(val){
          const res = await getNameInfos({chargGroupId:val});
          if (res.code === 200) {
            this.robotMark = res.data.result;
          }
      },
    // 获取列表数据
    async getList() {
      const res = await getRobot(this.form);
      if (res.code === 200) {
        this.total = res.total;
        this.tableData = res.data.result;
      }
    },

    resetSearch() {
      this.form = {
        orgId: null,
        assetNum: null,
        robotMark:null,
        manufacturId: null,
        pageSize: 10,
        pageNum: 1,
      }
    },

    //获取充电枪列表
    async getGunNum(val){
        const res = await getGunNum({chargAssetNum: val});
        if (res.code === 200) {
            this.gunList = res.data;
        }
    },
    // 获取厂商下拉框数据
    async getManufacturId() {
      const res = await getChargManu({ type: 3 });
      if (res.code === 200) {
        this.manufacturId = res.data;
      }
    },
    // 获取充电网点
    async chargGroupInfo() {
      const res = await chargGroupInfo();
      if (res.code === 200) {
        this.chargGroupId = res.data.result;
      }
    },

    // 表格厂商改写
    editType(type) {
      this.manufacturId.forEach((item) => {
        if (item.facturerId === type) {
          type = item.facturerName;
        }
      });
      return type;
    },
    // 查询按钮
    async queryFn() {
      this.form.pageNum = 1;
      this.form.pageSize = 10;
      this.getList();
    },
    // 查看详情方法
    previewFn(row) {
      this.dialogForm = JSON.parse(JSON.stringify(row));
      this.robotShow = true;
    },
    // 关闭弹出框
    closeFn() {
       this.dialogForm = {
        serialNumber: "",
        assetNum: "",
        robotMark: "",
        manufacturId: "",
        leader: "",
        linkPhone: "",
        revolution: "",
        purchTime: "",
        installTime: "",
        orgId: null,
        contacts: "",
        phone: "",
        gunNum: null,
        instalPosition: "",
        preferences: "",
        chargId: "",
        robotState: "",
        chargGroupId: "",
        robotName: null,
      },
      this.addRobotShow = false;
      this.robotShow = false;
      this.gunList = []
      this.chargeList = []
    },
    closeItem() {
      this.robotShow = false;
      this.dialogForm = {}
    },
    // 新增按钮
    addFn() {
      this.title = "新增充电机器人";
      this.addRobotShow = true;
      this.dialogForm = {
        serialNumber: "",
        assetNum: "",
        robotMark: "",
        manufacturId: "",
        leader: "",
        linkPhone: "",
        revolution: "",
        purchTime: "",
        installTime: "",
        orgId: null,
        contacts: "",
        phone: "",
        gunNum: null,
        instalPosition: "",
        preferences: "",
        chargId: "",
        robotState: "",
        chargGroupId: "",
        robotName: null,
      }
    },
    // 修改按钮
    editFn(row) {
      this.title = "修改充电机器人";
      this.dialogForm = JSON.parse(JSON.stringify(row));
      if(this.dialogForm.chargAsstsNum) {
       this.getGunNum(this.dialogForm.chargAsstsNum)
      }
      if(this.dialogForm.chargGroupId) {
        this.getChargeList({id: this.dialogForm.chargGroupId})
      }
      this.addRobotShow = true; 
    },
    // 切换网点
    changeSite(val) {
      this.chargeList = []
      this.dialogForm.chargId = ''
      this.dialogForm.chargAsstsNum = null
      this.dialogForm.gunNum = null
      this.gunList = []
      if(val) {
        this.getChargeList({id: val})
      }
    },
    // 切换充电设备
    changeCharge(val) {
      this.dialogForm.chargAsstsNum = null
      this.dialogForm.gunNum = null
      this.gunList = []
      if(this.chargeList.length > 0) {
        const arr = this.chargeList.filter(item => item.chargId === val)
        if(arr.length > 0) {
          this.dialogForm.chargAsstsNum = arr[0].assetsNum
          this.getGunNum(arr[0].assetsNum)
        }
      }
    },
    // 获取充电设备列表
    async getChargeList(val) {
      const rsp = await getChargeBySite(val)
      if(rsp.code === 200) {
        this.chargeList = rsp.data
      }
    },
    // dialog表单提交按钮
    submitFn() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          this.loadingBtn = true
          if (this.dialogForm.assetNum) {
            const res = await editRobot(this.dialogForm);
            if (res.code === 200) {
              this.msgSuccess(res.message);
              this.addRobotShow = false;
              this.getList();
              this.loadingBtn = false
            }else {
              this.loadingBtn = false
            }
          } else {
            const res = await addRobot(this.dialogForm);
            if (res.code === 200) {
              this.msgSuccess(res.message); 
              this.addRobotShow = false;
              this.getList();
              this.loadingBtn = false
            }else {
              this.loadingBtn = false
            }
          }
        }
      });
    },
    // 停用启用按钮
    changeStatus(row) {
       this.$confirm(row.robotState == 0 ? '是否确定停用该充电机器人': '是否确定启用该充电机器人', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then( async () => {
          const data = {
              robotState: row.robotState,
              robotId: row.robotId
          }
          const res = await upDateOrStopRobotInfo(data);
          if (res.code === 200) {
            this.msgSuccess(row.robotState == 0 ? '充电机器人停用成功' : '充电机器人启用成功');
            this.getList();
          }
        }).catch(() => {})
    },
    // 获取组织机构数据
    getOrganization() {
      getOrganization().then((response) => {
        if(response.code === 200) {
          this.deptOptions = response.data;
        }
      })
    },
    // 导出按钮
    async handleExport() {
      this.showLoading = true
       const res = await exportRobot(this.form);
        if(res && res.size > 0) {
          this.isExcel("xlsx", "充电机器人信息表", res);
        }else {
           this.$message({
            type: "error",
            message: '充电机器人信息导出失败'
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

    handleCloseImport() {
      this.showImport = false
    },
    // 导入操作
    handleImport() {
      this.upload.title = "充电机器人导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      let hrefStr = encodeURI(
        "/app/assets/download/excel?filename=" + "充电机器人导入模板"
      );
      // window.location.href = hrefStr;
      const link = document.createElement("a");
      link.href = hrefStr
      link.style.display = "none";
      link.setAttribute("download", `充电机器人导入模板.xlsx` );
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
         message: '充电机器人信息导入成功'
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
    handleSizeChange(size) {
      this.form.pageNum = 1
      this.form.pageSize = size;
      this.getList();
    },
    handleCurrentChange(currentPage) {
      this.form.pageNum = currentPage;
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.head-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topCard {
  margin-top: 10px;
  background-color: #fff;
  min-height: calc(100vh - 230px);
}

.el-date-editor.el-input > .el-input__suffix {
  right: 20px !important;
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
