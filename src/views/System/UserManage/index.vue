<template>
  <div>
    <el-row :gutter="10">
      <!--部门数据-->
      <el-col :span="5" :xs="24">
        <div
          style="background-color:#fff;box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.08);"
        >
          <div style="padding: 15px;">
            <el-input v-model="deptName" placeholder="请输入部门名称" />
          </div>
          <div style="width:240px">
            <el-scrollbar style="width: 100%">
              <el-tree
                highlight-current
                :data="deptOptions"
                :props="defaultProps"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="tree"
                node-key="id"
                :default-expand-all="true"
                @node-click="handleNodeClick"
              >
                <div slot-scope="{ node, data, el }" class="tree-node">
                  <el-tooltip
                    :content="node.label"
                    :disabled="isShowTooltip"
                    :open-delay="300"
                    placement="top"
                    effect="dark"
                  >
                    <span class="over-ellipsis" @mouseover="mouseOver($event)">
                      {{ node.label }}
                    </span>
                  </el-tooltip>
                </div>
              </el-tree>
            </el-scrollbar>
          </div>
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="19" :xs="24">
        <div style="background-color: #fff;padding: 15px 10px;">
          <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            v-show="showSearch"
            @keydown.enter.native="submit"
            @submit.native.prevent
            label-width="48px"
          >
            <el-form-item prop="userName" label="姓名">
              <el-input
                v-model="queryParams.fullName"
                placeholder="请输入姓名"
              />
              <!-- <el-input
                v-model="queryParams.fullName"
                placeholder="请输入姓名"
                style="margin-right: 40px"
              /> -->
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="handleQuery"
                >搜索</el-button
              >
              <el-button size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                type="primary"
                v-hasPermi="['system:user:add']"
                >新增</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['system:user:remove']"
                >删除</el-button
              >
            </el-col>
          </el-row>

          <el-table
            border
            :header-cell-style="tableHeaderStyle"
            :data="userList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
              label="用户账号"
              align="center"
              prop="userName"
              key="userId"
              fixed="left"
              width="120"
              v-if="columns[0].visible"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="归属组织机构"
              align="center"
              prop="organization"
              key="organization"
              :show-overflow-tooltip="true"
              width="180"
            >
              <template slot-scope="scope">
                {{ scope.row.dept ? scope.row.dept.nameCN : null }}
              </template>
            </el-table-column>
            <el-table-column
              label="姓名"
              align="center"
              prop="fullName"
              key="fullName"
              v-if="columns[1].visible"
              :show-overflow-tooltip="true"
              width="120"
            />
            <el-table-column
              label="手机号"
              align="center"
              prop="phone"
              key="phone"
              v-if="columns[2].visible"
              width="120"
            />
            <el-table-column
              label="邮箱地址"
              align="center"
              prop="email"
              key="email"
              v-if="columns[3].visible"
              :show-overflow-tooltip="true"
              width="120"
            />
            <el-table-column
              label="用户状态"
              key="state"
              v-if="columns[4].visible"
              align="center"
              width="100"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enabled"
                  :disabled="!isShow(scope.row)"
                  active-value="0"
                  inactive-value="1"
                  @change="handleStatusChange(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
            <!-- <el-table-column
              label="创建时间"
              align="center"
              key="createTime"
              prop="createTime"
              v-if="columns[5].visible"
              width="175"
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column> -->
            <el-table-column
              label="操作"
              align="center"
              width="160"
              fixed="right"
            >
              <template slot-scope="scope">
                <div
                  style="display: flex;align-items: center;margin-left: 10px"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="编辑"
                    placement="top"
                  >
                    <!-- "scope.row.roles[0].name === 'qygly' ? false : true" -->
                    <el-button
                      v-if="isShow(scope.row)"
                      circle
                      icon="el-icon-edit"
                      @click="handleUpdate(scope.row)"
                      v-hasPermi="['system:user:edit']"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="删除"
                    placement="top"
                  >
                    <el-button
                      v-if="isShow(scope.row)"
                      circle
                      icon="el-icon-delete"
                      @click="handleDelete(scope.row)"
                      v-hasPermi="['system:user:remove']"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="重置密码"
                    placement="top"
                  >
                    <el-button
                      v-if="isShow(scope.row)"
                      circle
                      icon="el-icon-key"
                      @click="handleResetPwd(scope.row)"
                      v-hasPermi="['system:user:resetPwd']"
                    ></el-button>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </div>
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      v-dialogDrag
      :visible.sync="open"
      width="42%"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-col :span="12">
          <div class="orgList">
            <el-form-item label="组织机构" prop="dept">
              <treeselect
                style="height: 32px !important;"
                :options="deptOptions"
                v-model="form.dept"
                :default-expand-level="1"
                placeholder="请选择组织机构"
              />
            </el-form-item>
          </div>
        </el-col>
        <!-- 新增 -->
        <el-col :span="12" v-if="title == '添加用户'">
          <el-form-item label="职工" prop="staffId">
            <el-select
              v-model="form.staffId"
              @change="changeStaff"
              placeholder="请选择职工"
            >
              <el-option
                v-for="(item, index) in employeeList"
                :key="index"
                :label="item.workName"
                :value="item.workersId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 修改 -->
        <el-col :span="12" v-else>
          <el-form-item label="职工" prop="fullName">
            <el-select
              v-model="form.fullName"
              @change="changeStaff"
              placeholder="请选择职工"
            >
              <el-option
                v-for="(item, index) in employeeList"
                :key="index"
                :label="item.workName"
                :value="item.workersId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="userName" label="账号">
            <el-input v-model="form.userName" placeholder="请输入账号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="请输入手机号码"
              maxlength="11"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色" prop="roleIds">
            <el-select
              v-model="form.roleIds"
              multiple
              placeholder="请选择角色"
              :disabled="disableInput"
            >
              <el-option
                v-for="item in roleOptions"
                :key="item.id"
                :label="item.nameCN"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 用户导入对话框 -->
    <el-dialog
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
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
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
          <el-checkbox
            v-model="upload.updateSupport"
          />是否更新已经存在的用户数据
          <el-link type="info" style="font-size: 12px" @click="importTemplate"
            >下载模板</el-link
          >
        </div>
        <div class="el-upload__tip" style="color: red" slot="tip">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  exportUser,
  resetUserPwd,
  changeUserStatus,
  importTemplate,
  getList
} from '@/api/system/user'
import { getInfo } from '@/api/common'
import { treeselect, userDeptTreeselect } from '@/api/system/dept'
import { getEmployeeList } from '@/api/asset/employeeinfo'
import { debounce } from '@/utils/utils'
export default {
  name: 'User',
  data() {
    return {
      disableInput: false,
      currentUserLevel: undefined,
      clientHeight: document.body.clientHeight,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 选中用户中文名称
      fullNames: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: '',
      // 部门树选项
      deptOptions: [],
      // 部门树展开部分
      treeExpandData: [],
      // 部门树展开级别
      treeLevel: 1,
      // 用户部门树
      userDeptOptions: [],
      // 项目选项
      postOptions: [],
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 性别状态字典
      sexOptions: [],
      // 角色选项
      roleOptions: [],
      // 用户等级字典
      userLevelOptions: [],
      // 职工下拉框
      employeeList: [],
      // 表单参数
      form: {
        deptIds: []
      },
      // 企业数据隔离
      enterpriseId: '',
      deptId: [], // 数组
      deptIdStr: null, // 字符串
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        // 上传的地址
        url: '/sys/system/user/importData'
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        fullName: undefined,
        phone: undefined,
        email: undefined,
        sex: undefined,
        owner: undefined,
        userLevel: undefined,
        startTime: undefined,
        endTime: undefined,
        deptIds: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: `用户账号`, visible: true },
        { key: 1, label: `用户名`, visible: true },
        { key: 2, label: `手机号码`, visible: true },
        { key: 3, label: `邮箱`, visible: true },
        { key: 4, label: `状态`, visible: true },
        { key: 5, label: `创建时间`, visible: true }
      ],
      // 表单校验
      rules: {
        dept: [
          { required: true, message: '组织机构不能为空', trigger: 'blur' }
        ],
        staffId: [{ required: true, message: '职工不能为空', trigger: 'blur' }],
        userName: [
          { required: true, message: '用户账号不能为空', trigger: 'blur' },
          {
            pattern: /^[^\u4e00-\u9fa5]+$/,
            message: '用户账号不允许输入中文',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        roleIds: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
        phone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      },
      isShowTooltip: false
    }
  },

  mounted() {
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        that.clientHeight = window.screenHeight
      })()
    }
  },
  computed: {
    isShow() {
      return function(row) {
        if (row.roles.length == 0) {
          return true
        } else {
          return row.roles[0].name == 'qygly' ? false : true
        }
      }
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val)
    },
    'form.dept'(newVal, oldVal) {
      this.employeeList = []
      if (newVal) {
        getList({ workOrgId: this.form.dept }).then((res) => {
          if (res.code === 200) {
            this.employeeList = res.data.result
          }
        })
      }
    }
  },
  created() {
    this.getUserLevel()
    this.getList()
    this.getTreeselect()
    this.getDicts('sys_user_sex').then((response) => {
      if (response.code === 200) {
        this.sexOptions = response.data
      }
    })
    this.getConfigKey('sys.user.initPassword').then((response) => {
      if (response.code === 200) {
        this.initPassword = response.msg
      }
    })
  },
  methods: {
    submit() {},
    // 超出显示
    mouseOver(event) {
      this.isShowTooltip =
        event.currentTarget.scrollWidth <= event.currentTarget.clientWidth
    },
    // 角色根据用户级别来判断是否可选
    setDisable(val) {
      if (val == 1) {
        this.form.roleIds = []
        this.disableInput = true
      } else {
        this.disableInput = false
      }
    },
    /** 查询登录用户userLevel */
    getUserLevel() {
      getInfo().then((response) => {
        if (response.code === 200) {
          this.currentUserLevel = response.user.userLevel
          this.enterpriseId = response.user.tenantId
        }
      })
    },
    /** 查询用户列表 */
    getList() {
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          if (response.code === 200) {
            this.userList = response.rows
            this.total = response.total
          }
        }
      )
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        if (response.code === 200) {
          this.deptOptions = response.data
        }
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptIds = data.id
      this.getList()
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.enabled === '0' ? '启用' : '停用'
      this.$confirm(
        '确认要"' + text + '""' + row.userName + '"用户吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function() {
          return changeUserStatus(row.id, row.enabled)
        })
        .then(() => {
          this.msgSuccess(text + '成功')
        })
        .catch(function() {
          row.enabled = row.enabled === '0' ? '1' : '0'
        })
    },

    changeStaff(val) {
      this.form.phone = this.employeeList.filter(
        (item) => item.workersId === val
      )[0].phone
      this.form.email = this.employeeList.filter(
        (item) => item.workersId === val
      )[0].email
      this.form.fullName = this.employeeList.filter(
        (item) => item.workersId === val
      )[0].workName
      this.form.staffId = this.employeeList.filter(
        (item) => item.workersId === val
      )[0].workersId
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        userLevel: '3',
        userName: undefined,
        fullName: undefined,
        password: undefined,
        phone: undefined,
        email: undefined,
        sex: undefined,
        roleIds: [],
        deptIds: null,
        postIds: [],
        employee: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // this.queryParams.page = 1;
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.fullName = ''
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.fullNames = selection.map((item) => item.fullName)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.getTreeselect()
      getUser().then((response) => {
        if (response.code === 200) {
          this.postOptions = response.posts
          this.roleOptions = response.roles
          this.setDisable(3)
          this.title = '添加用户'
          this.form.password = this.initPassword
        }
        this.open = true
      })
    },
    /** 根据用户ID查询菜单树结构 */
    getUserDeptTreeselect(userId) {
      return userDeptTreeselect(userId).then((response) => {
        if (response.code === 200) {
          this.userDeptOptions = response.depts
        }
        return response
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      // const userDept = this.getUserDeptTreeselect(id);
      getUser(id).then((response) => {
        if (response.code === 200) {
          this.form = response.data
          this.deptId = response.deptIds || null
          this.form.dept = response.deptIds ? response.deptIds[0] : null
          this.postOptions = response.posts
          this.roleOptions = response.roles
          this.form.postIds = response.postIds
          this.form.roleIds = response.roleIds
        }
        this.setDisable(response.data.userLevel)
        this.open = true
        this.title = '修改用户'
        this.form.password = ''
      })
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$confirm('重置密码为初始密码：123456，请知悉！', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        resetUserPwd(row.id).then((rsp) => {
          if (rsp.code === 200) {
            this.msgSuccess('修改成功')
          }
        })
      })
    },
    /** 提交按钮 */
    submitForm: debounce(function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.userLevel == '1') {
            this.form.roleIds = []
          }
          if (this.form.id != undefined) {
            this.form.deptIds = [this.form.dept]
            delete this.form.dept
            updateUser(this.form).then((rsp) => {
              if (rsp.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              }
            })
          } else {
            this.form.deptIds = [this.form.dept]
            delete this.form.dept
            addUser(this.form).then((rsp) => {
              if (rsp.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              }
            })
          }
        }
      })
    }, 500),
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      const fullNames = row.fullName || this.fullNames
      this.$confirm(
        '是否确认删除用户名称为"' + fullNames + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function() {
          return delUser(ids)
        })
        .then((res) => {
          if (res.code == 200) {
            this.getList()
            this.msgSuccess('删除成功')
          }
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有用户数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return exportUser(queryParams)
        })
        .then((response) => {
          this.download(response.msg)
        })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '用户导入'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.download(response.msg)
      })
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    }
  }
}
</script>
<style lang="scss">
/*此处是为了将原有的横向滚动条隐藏，原本的滚动条很丑*/
.el-scrollbar__wrap {
  overflow-x: hidden;
  padding-bottom: 30px;
}

/*此处是为了添加横向滚动条*/
.el-tree > .el-tree-node {
  /*min-width: 100%;*/
  width: 120%;
  display: inline-block;
}

.el-tree-node__content {
  width: auto;
}
</style>
<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.item {
  display: flex;
  align-items: center;
  .label {
    width: 80px;
    text-align: right;
    color: $mainTextColor;
    font-size: $fontSize14;
    margin-right: 10px;
  }
  .value {
    flex: 1;
  }
}
.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  /* padding-right: 8px; */
}
.over-ellipsis {
  display: block;
  width: calc(100% - 50px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  -webkit-line-clamp: 1;
}
.top-right {
  display: block;
  min-width: 50px;
  width: 50px;
  text-align: right;
  position: absolute;
  right: 0px;
}
</style>
