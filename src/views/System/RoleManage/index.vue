<!--
角色管理
-->
<template>
  <div class="app-container">
    <div class="searchBox">
      <div class="item">
        <div class="label">角色中文名称</div>
        <div class="value">
          <el-input
            v-model="queryParams.nameCN"
            placeholder="请输入角色中文名称"
            @keyup.enter.native="handleQuery"
            clearable
          />
        </div>
      </div>
      <div class="item">
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </div>
    </div>

    <div style="padding: 15px;background: #fff;">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            icon="el-icon-plus"
            size="mini"
            type="primary"
            @click="handleAdd"
            v-hasPermi="['system:role:add']"
            >新增</el-button
          >
        </el-col>
        <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:role:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:role:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          icon="el-icon-download"
          size="mini"
          @click="handleImport"
          v-hasPermi="['system:role:import']"
          >导入</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          icon="el-icon-upload2"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:role:export']"
          >导出</el-button
        >
      </el-col> -->
        <!-- <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar> -->
      </el-row>

      <el-table
        :header-cell-style="tableHeaderStyle"
        border
        :data="roleList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="角色名称"
          prop="name"
          align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="中文名称"
          align="center"
          prop="nameCN"
          :show-overflow-tooltip="true"
        />
        <!-- <el-table-column
        label="角色类别"
        align="center"
        prop="type"
        :formatter="typeFormat"
        width="100"
      />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            :disabled="scope.row.name == 'administrator'"
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column> -->
        <el-table-column label="创建时间" align="center" prop="createTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              v-if="
                scope.row.ifChange != '1' && scope.row.name == 'qygly'
                  ? false
                  : true
              "
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:role:edit']"
            ></el-button>
            <!-- 修改 -->
            <!-- <el-button
            v-if="scope.row.name != 'administrator'"
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handleDataScope(scope.row)"
            v-hasPermi="['system:role:edit']"
            >数据权限</el-button
          > -->
            <el-button
              v-if="
                scope.row.ifChange != '1' && scope.row.name == 'qygly'
                  ? false
                  : true
              "
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:role:remove']"
            ></el-button>
            <!-- 删除 -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="40%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入角色英文名称"
            :disabled="disableInput"
          />
        </el-form-item>
        <el-form-item label="中文名称" prop="nameCN">
          <el-input v-model="form.nameCN" placeholder="请输入中文名称" />
        </el-form-item>
        <!-- <el-form-item label="角色类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="状态" style="display:none">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-checkbox
            v-model="menuExpand"
            @change="handleCheckedTreeExpand($event, 'menu')"
            >展开/折叠</el-checkbox
          >
          <el-checkbox
            v-model="menuNodeAll"
            @change="handleCheckedTreeNodeAll($event, 'menu')"
            >全选/全不选</el-checkbox
          >
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            :check-strictly="false"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.memo"
            type="textarea"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="openDataScope"
      width="500px"
      append-to-body
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="中文名称">
          <el-input v-model="form.nameCN" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope" @change="dataScopeSelectChange">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="form.dataScope == '2'">
          <el-checkbox
            v-model="deptExpand"
            @change="handleCheckedTreeExpand($event, 'dept')"
            >展开/折叠</el-checkbox
          >
          <el-checkbox
            v-model="deptNodeAll"
            @change="handleCheckedTreeNodeAll($event, 'dept')"
            >全选/全不选</el-checkbox
          >
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            ref="dept"
            node-key="id"
            :check-strictly="true"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">确 定</el-button>
        <el-button @click="cancelDataScope">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 角色导入对话框 -->
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
          <el-link type="info" style="font-size:12px" @click="importTemplate"
            >下载模板</el-link
          >
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
</template>

<script>
import {
  listRole,
  getRole,
  delRole,
  addRole,
  updateRole,
  exportRole,
  dataScope,
  changeRoleStatus,
  importTemplate
} from '@/api/system/role'
import {
  treeselect as menuTreeselect,
  roleMenuTreeselect
} from '@/api/system/menu'
import {
  treeselect as deptTreeselect,
  roleDeptTreeselect
} from '@/api/system/dept'

export default {
  name: 'Role',
  data() {
    return {
      // 角色导入参数
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
        url: '/sys/system/role/importData'
      },
      // 不可修改
      disableInput: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 选中角色名称
      nameCNs: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 类别字典
      typeOptions: [],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: '1',
          label: '全部数据权限'
        },
        {
          value: '2',
          label: '自定义数据权限'
        },
        {
          value: '3',
          label: '本部门数据权限'
        },
        {
          value: '4',
          label: '本部门及以下数据权限'
        },
        {
          value: '5',
          label: '仅本人数据权限'
        }
      ],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        roleKey: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
          {
            pattern: /^[^\u4e00-\u9fa5]+$/,
            message: '角色名称不允许输入中文',
            trigger: 'blur'
          }
        ],
        nameCN: [
          { required: true, message: '中文名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_normal_disable').then((response) => {
      if (response.code === 200) {
        this.statusOptions = response.data
      }
    })
    this.getDicts('sys_role_type').then((response) => {
      if (response.code === 200) {
        this.typeOptions = response.data
      }
    })
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      // this.loading = true;
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.roleList = response.rows
          this.total = response.total
          // this.loading = false;
        }
      )
    },
    // 字典状态字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type)
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then((response) => {
        this.menuOptions = response.data
        let num = 0
        this.menuOptions.forEach((item, index) => {
          if (item.name === 'system') {
            num = index
          }
        })
        let arr = [this.menuOptions[num]]
        this.menuOptions[num] = this.deepAdd(arr)[0]
      })
    },
    // 递归，给多维数组增加属性 disabled
    deepAdd(tree = []) {
      let that = this
      let array = []
      if (!!tree && tree.length !== 0) {
        tree.forEach((item) => {
          item.disabled = true
          item.children = that.deepAdd(item.children)
          array.push(item)
        })
      }
      return array
    },
    /** 查询部门树结构 */
    getDeptTreeselect() {
      deptTreeselect().then((response) => {
        this.deptOptions = response.data
        this.deptOptions[0].disabled = true
      })
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys()
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      let checkedKeys = this.$refs.dept.getCheckedKeys()
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(id, ifChange) {
      return roleMenuTreeselect(id).then((response) => {
        this.menuOptions = response.rescources
        let num = 0
        this.menuOptions.forEach((item, index) => {
          if (item.name === 'system') {
            num = index
          }
        })
        let arr = [this.menuOptions[num]]
        if (ifChange != '1') {
          this.menuOptions[num] = this.deepAdd(arr)[0]
        }
        return response
      })
    },
    /** 根据角色ID查询部门树结构 */
    getRoleDeptTreeselect(id) {
      return roleDeptTreeselect(id).then((response) => {
        this.deptOptions = response.depts
        return response
      })
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === '0' ? '启用' : '停用'
      this.$confirm('确认要' + text + '"' + row.nameCN + '"角色吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return changeRoleStatus(row.id, row.status)
        })
        .then(() => {
          this.msgSuccess(text + '成功')
        })
        .catch(function() {
          row.status = row.status === '0' ? '1' : '0'
        })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false
      this.reset()
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([])
      } else {
        this.menuExpand = false
        this.menuNodeAll = false
        this.deptExpand = true
        this.deptNodeAll = false
        this.form = {
          id: undefined,
          name: undefined,
          nameCN: undefined,
          resourceIds: [],
          deptIds: [],
          menuCheckStrictly: true,
          deptCheckStrictly: true,
          memo: undefined,
          status: '0'
        }
        // ;(this.menuExpand = false),
        //   (this.menuNodeAll = false),
        //   (this.deptExpand = true),
        //   (this.deptNodeAll = false),
        //   (this.form = {
        //     id: undefined,
        //     name: undefined,
        //     nameCN: undefined,
        //     resourceIds: [],
        //     deptIds: [],
        //     menuCheckStrictly: true,
        //     deptCheckStrictly: true,
        //     memo: undefined,
        //     status: '0'
        //   })
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.dateRange = [];
      // this.resetForm("queryForm");
      this.queryParams.nameCN = ''
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.nameCNs = selection.map((item) => item.nameCN)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == 'menu') {
        let treeList = this.menuOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
        }
      } else if (type == 'dept') {
        let treeList = this.deptOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : [])
      } else if (type == 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : [])
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.disableInput = false
      this.getMenuTreeselect()
      this.open = true
      this.title = '添加角色'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      if (row.ifChange != '1' && row.name == 'qygly') {
        return this.msgError('企业管理员不可修改')
      }
      this.reset()
      // this.disableInput = true;
      this.disableInput = false
      const roleId = row.id || this.ids
      const roleMenu = this.getRoleMenuTreeselect(roleId, row.ifChange)
      getRole(roleId).then((response) => {
        this.form = response.data
        // if(response.code )
        if (this.form.name == 'administrator') {
          this.msgError('系统管理员角色不可修改')
          return
        }
        this.open = true
        this.$nextTick(() => {
          roleMenu.then((res) => {
            let checkedKeys = res.checkedKeys
            checkedKeys.forEach((v) => {
              this.$nextTick(() => {
                this.$refs.menu.setChecked(v, true, false)
              })
            })
          })
        })
        this.title = '修改角色'
      })
    },
    /** 选择角色权限范围触发 */
    dataScopeSelectChange(value) {
      if (value !== '2') {
        this.$refs.dept.setCheckedKeys([])
      }
    },
    /** 分配数据权限操作 */
    handleDataScope(row) {
      this.reset()
      const roleDeptTreeselect = this.getRoleDeptTreeselect(row.id)
      getRole(row.id).then((response) => {
        this.form = response.data
        this.openDataScope = true
        this.$nextTick(() => {
          roleDeptTreeselect.then((res) => {
            this.$refs.dept.setCheckedKeys(res.checkedKeys)
          })
        })
        this.title = '分配数据权限'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            this.form.resourceIds = this.getMenuAllCheckedKeys()

            updateRole(this.form).then((res) => {
              if (res.code == 200) {
                this.msgSuccess('修改成功')
              }
              this.open = false
              this.getList()
            })
          } else {
            this.form.resourceIds = this.getMenuAllCheckedKeys()
            addRole(this.form).then((res) => {
              if (res.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              }
            })
          }
        }
      })
    },
    /** 提交按钮（数据权限） */
    submitDataScope: function() {
      if (this.form.id != undefined) {
        this.form.deptIds = this.getDeptAllCheckedKeys()
        dataScope(this.form).then(() => {
          this.msgSuccess('修改成功')
          this.openDataScope = false
          this.getList()
        })
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      const nameCNs = row.nameCN || this.nameCNs
      this.$confirm(
        '是否确认删除角色名称为"' + nameCNs + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function() {
          return delRole(ids)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有角色数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return exportRole(queryParams)
        })
        .then((response) => {
          this.download(response.msg)
        })
    },
    // 导出按钮
    // handleExport() {
    //   let params = this.queryParams;
    //   let that = this;
    //   this.$confirm("是否确认导出所有用户数据项?", "警告", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   }).then(async function() {
    //     const res = await exportRole(params);
    //     that.isExcel("xlsx", "角色管理表", res);
    //     that.msgSuccess("导出成功");
    //   });
    // },
    // isExcel(type, name, data) {
    //   const link = document.createElement("a");
    //   const blob = new Blob([data]);
    //   link.style.display = "none";
    //   link.href = URL.createObjectURL(blob);
    //   link.setAttribute("download", `${name}.` + type);
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.download(response.msg)
      })
      // let hrefStr = encodeURI( "/sys/system/role/importTemplate" );
      // window.location.href = hrefStr;
    },
    // 文件上传中处理
    handleFileUploadProgress() {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '用户导入'
      this.upload.open = true
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.searchBox {
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 13px 15px;
  margin-bottom: 10px;
  .item {
    display: flex;
    align-items: center;
    margin-right: 40px;
    .label {
      color: $mainTextColor;
      font-size: $fontSize14;
      margin-right: 10px;
    }
  }
}
::v-deep .el-tree > .el-tree-node {
  width: 100%;
}
::v-deep .el-tree-node__content {
  width: 100%;
}
</style>
