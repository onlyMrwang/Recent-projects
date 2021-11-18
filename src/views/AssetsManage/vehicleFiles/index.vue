<template>
    <div class="app-container">
        <!--工具栏-->
        <div class="card">
            <el-form ref="form" :model="form" size="small" label-width="80px">
                <el-row :gutter="5">
                    <el-col :span="6">
                        <el-form-item prop="carNumber" label="车牌号">
                            <el-input v-model.trim="form.carNumber"  placeholder="请输入车牌号"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="carVin" label="车辆VIN">
                            <el-input v-model.trim="form.carVin"  placeholder="请输入车辆VIN"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="carModel" label="车辆型号">
                            <el-input v-model.trim="form.carModel"  placeholder="请输入车辆型号"/>
                        </el-form-item>
                    </el-col>
                     <el-col :span="6">
                        <el-form-item prop="carType" label="能源类型">
                            <el-select v-model="form.carType" clearable placeholder="请选择能源类型">
                                <el-option
                                        v-for="item in dictInfo.carType"
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
                        <el-form-item prop="userBroaHead" label="车辆类型">
                            <el-select
                                    clearable
                                    v-model="form.userBroaHead"
                                    @change="changeCar"
                                    placeholder="请选择车辆类型"
                            >
                                <el-option
                                        v-for="item in dictInfo.usebroaHead"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="userSubcHead" label="车辆用途">
                            <el-select
                                clearable
                                filterable
                                v-model="form.userSubcHead"
                                :placeholder="form.userBroaHead ? '请选择车辆用途' : '请先选择车辆类型'"
                            >
                            <el-option
                                v-for="item in subcHeadList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> 
                    <el-col :span="6">
                        <div class="orgList">
                        <el-form-item prop="orgId" label="组织机构">
                            <treeselect
                                    clearable
                                    :options="deptList"
                                    v-model="form.orgId"
                                    :default-expand-level="1"
                                    placeholder="请选择组织机构"
                                    :normalizer="normalizer"
                            />
                        </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="xnkh" label="虚拟卡号">
                            <el-input v-model.trim="form.xnkh"  placeholder="请输入虚拟卡号"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="5">
                    <el-col :span="6">
                        <el-form-item prop="stkh" label="实体卡号">
                            <el-input v-model.trim="form.stkh"  placeholder="请输入实体卡号"/>
                        </el-form-item>
                    </el-col>
                        <el-col :span="18" style="text-align: right;">
                            <el-form-item>
                               <el-button size="mini" type="primary" @click="queryFn">查询</el-button>
                               <el-button  @click="resetSearch">重置</el-button>
                            </el-form-item>
                        </el-col>
                </el-row>
            </el-form>
        </div>
        <!--表格渲染-->
        <el-card class="topCard" style="margin-bottom: 15px">
            <div class="head-container">
                <!-- <h1><span class="online"></span> 车辆信息列表</h1> -->
                <div style="margin-bottom: 8px">
                    <el-button type="primary" icon="el-icon-plus" @click="editFn(1)" class="btn">增加</el-button
                    >
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
                style="width: 100%;"
            >
                <el-table-column prop="carId" align="center" width="180" show-overflow-tooltip fixed="left" label="车辆编码"/>
                <el-table-column prop="carNumber" align="center" width="100" show-overflow-tooltip label="车牌号"/>
                <el-table-column prop="carVin" align="center" width="180" show-overflow-tooltip label="车辆VIN"/>
                <el-table-column prop="carModel" align="center" width="120" show-overflow-tooltip label="车辆型号"/>
                <el-table-column align="center"  width="100" show-overflow-tooltip label="能源类型">
                    <template slot-scope="scope">
                        {{Number(scope.row.carType) >= 0 ?  dictInfo.carTypeObj[scope.row.carType] : null}}
                    </template>
                </el-table-column>
                <el-table-column prop="broaHead" sortable align="center" label="车辆类型" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="subcHead" sortable align="center" label="车辆用途" width="150" show-overflow-tooltip>
                </el-table-column>
                    <el-table-column
                            prop="nameCn"
                            align="center"
                            width="180px"
                            label="所属组织机构"
                           show-overflow-tooltip
                    /> 
                    <el-table-column prop="isOpenCard" align="center" label="是否已开卡" width="120" show-overflow-tooltip />
                    <el-table-column prop="xnkh" align="center" label="虚拟卡号" width="180" show-overflow-tooltip/>
                    <el-table-column prop="stkh" align="center" label="实体卡号" width="180" show-overflow-tooltip/>
                    <el-table-column align="center" label="状态" width="100" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row.delState == 0 ? "启用" : "停用" }}
                        </template>
                    </el-table-column>
                <el-table-column
                        align="center"
                        fixed="right"
                        label="操作"
                        width="160"
                >
                    <template slot-scope="scope">
                        <el-link
                                class="btn1"
                                :underline="false"
                                @click="editFn(3,scope.row)"
                                type="primary"
                                title="详情"
                        >
                          详情
                        </el-link>
                        <el-link
                                class="btn1"
                                :underline="false"
                                @click="editFn(2,scope.row)"
                                type="primary"
                                title="修改"
                        >
                           修改
                        </el-link>
                        <el-link
                                class="btn1"
                                :underline="false"
                                @click="changeStatus(scope.row)"
                                type="primary"
                        >{{ scope.row.delState == 0 ? "停用" : "启用" }}
                        </el-link
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
        <!-- 查看详情弹出框 -->    
        <div v-if="viewShow">
        <el-dialog
           :close-on-click-modal="false"
            v-dialogDrag
            :visible.sync="viewShow"
            width="80%"
            :title="title"
        >
            <AddDetail :listDetail="listDetail" :listType="listType" @closeView="closeView(arguments)" :listTypes="listTypes" />
        </el-dialog>
        </div> 

        <div v-if="upload.open">
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
        </el-dialog></div>


         <div v-if="showImport">
          <el-dialog
            :close-on-click-modal="false"
            v-dialogDrag
            title="车辆导入失败结果"
            :visible.sync="showImport"
            width="800px"
            append-to-body
            @close="handleCloseImport"
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
    import { mapGetters } from 'vuex'
    import { getCarInfo, exportCarInfo, upDateStopCarInfo } from "@/api/asset/vehiclefiles";
    import { getOrganization } from "@/api/asset/charggroupinfo";
    import AddDetail from './addDetail'
    export default {
        components: {
            AddDetail
        },
        computed: {
            ...mapGetters(['deptList', 'dictInfo'])
        },
        data() {
            return {
                listTypes: 1, // 1 新增 2 修改 3 查看
                listType: false,
                listDetail:{},
                baseForm:{},
                // 表单数据
                subcHeadList: [], // 车辆用途
                form: {
                    pageNum: 1,
                    pageSize: 10,
                    carVin: "",
                    carNumber: "",
                    carModel: "",
                    carType: "",
                    userBroaHead: "",
                    userSubcHead: "",
                    orgId: null,
                    xnkh: "",
                    stkh: null,
                },
                // 数据总条数
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
                    headers: {Authorization: "Bearer " + localStorage.getItem("token")},
                    // 上传的地址
                    url: "/app/assets/carinfo/importData",
                },
                showLoading: false,
                // 弹出框标题
                title: "",
                // 表格数据
                tableData: [],
                // 车辆小类新增修改下拉框
                addUserSubcHead: [],
                // 整车厂商
                carFacturer: [],
                // 电机厂商
                motorFacturer: [],
                // 电池厂商
                batteryFacturer: [],
                // 型号
                model: [],
                // 所属组织机构
                deptOptions: [],
                // 省
                province: [],
                // 市
                city: [],
                // 区
                carAreaCode: [],
                // 所属运营部门
                opeDept: [],
                // 所属公司
                company: [],
                // 所属集团
                group: [],
                // 所属地区
                areaId: [],
                // 查看详情弹出框显示
                viewShow: false,
                // 新增按钮弹出框
                addDialogShow: false,
                // 状态数据
                status: [
                    {
                        value: "0",
                        label: "启用",
                    },
                    {
                        value: "1",
                        label: "停用",
                    },
                ],
                subcObj: null,
                dictArr: [],
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
            // this.getDictInfo();
        },
        methods: {
             getSubList(pVal) {
            if(Number(pVal) >= 0 && this.dictInfo.usesubcHead.length > 0 && this.dictInfo.usebroaHead.length > 0) {
                const parr = this.dictInfo.usebroaHead.filter(item => item.value == pVal)
                let arr = []
                if(parr.length > 0) {
                    arr = this.dictInfo.usesubcHead.filter(item => item.parentValue == parr[0].id)   
                }
                this.subcHeadList = arr
            }else {
                this.subcHeadList = []
             }
            },
            // 获取车辆信息表格数据
            async getList() {
                const res = await getCarInfo(this.form);
                if (res.code === 200) {
                    this.tableData = res.data.list;
                    this.total = res.data.total;
                }
            },

            resetSearch() {
                this.form = {
                    pageNum: 1,
                    pageSize: 10,
                    carVin: "",
                    carNumber: "",
                    carModel: "",
                    carType: "",
                    userBroaHead: "",
                    userSubcHead: "",
                    orgId: null,
                    xnkh: "",
                    stkh: null,
                }
            },

            // 查询按钮
            queryFn() {
                this.form.pageNum = 1;
                this.getList();
            },
            // 修改表格数据方法
            editFn(type,row) {
                this.listTypes=type;
                this.listType=false;
                this.viewShow = true;
                if(type==1){
                    this.title = "新增车辆信息";
                    this.listDetail={};
                }else{
                if(type==2){
                        this.title = "修改车辆信息";
                    }else{
                        this.title = "查看车辆信息";
                        // this.listType=true;
                         this.listType=false;
                    }
                    this.editFnDetail(row);
                }
            },
            //打开弹出框给数组赋值查看详情方法
            editFnDetail(row){
                this.listDetail = JSON.parse(JSON.stringify(row));
            },
            // 关闭弹出框事件
            closeView(val) {
                if(val) {
                    if(val[0] === 1) {
                        this.getList(); 
                    }
                    this.viewShow = false;
                }
            },
            // 获取组织机构数据
            getOrganization() {
                getOrganization().then((response) => {
                    if (response.code === 200) {
                        this.deptOptions = response.data;
                    }

                });
            },
            // 停用启用按钮
            async changeStatus(row) {
                 this.$confirm(row.delState === 0 ? '是否确定停用该车辆': '是否确定启用该车辆', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                    }).then( async () => {
                    const data = {
                        id: row.id,
                        delState: row.delState
                    }
                    const res = await upDateStopCarInfo(data);
                        if(res.code==200){
                            this.msgSuccess(row.delState === 0 ? '车辆停用成功' : '车辆启用成功');
                            this.getList();
                        }
                    }).catch(() => {})
            },
            // 导出按钮
            async handleExport() {
                this.showLoading = true
               const res = await exportCarInfo(this.form);
                if(res && res.size > 0) {
                    this.isExcel("xlsx", "车辆信息表", res);  
                }else {
                    this.$message({
                    type: "error",
                    message: '车辆信息导出失败'
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
                this.upload.title = "车辆档案导入";
                this.upload.open = true;
            },
            /** 下载模板操作 */
            importTemplate() {
                let hrefStr = encodeURI(
                    "/app/assets/download/excel?filename=" + "车辆档案管理导入模板"
                );
                // window.location.href = hrefStr;
                const link = document.createElement("a");
                link.href = hrefStr
                link.style.display = "none";
                link.setAttribute("download", `车辆档案管理导入模板.xlsx` );
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
                    message: '车辆信息导入成功'
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

            handleSizeChange(pageSize) {
                this.form.pageNum = 1
                this.form.pageSize = pageSize
                this.getList()
            },

            handleCurrentChange(currentPage) {
                this.form.pageNum = currentPage;
                this.getList()
            },

            normalizer(node){
                //去掉children=[]的children属性
                if(node.children && !node.children.length){
                    delete node.children;
                }
                return {
                    id: node.id,
                    label:node.nameCN,
                    children:node.children
                }
            },
            changeCar(val) {
                this.form.userSubcHead = null
                this.subcHeadList = []
                this.getSubList(val)
            },
        },
    };
</script>

<style scoped lang="scss">


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
