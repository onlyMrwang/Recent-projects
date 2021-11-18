<template>
  <div class="app-container" style="">
    <el-row>
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="datarouteName"
            placeholder="请输入字典名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-scrollbar style="width: 100%;">
            <el-tree
              :data="dataRouteOptions"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="tree"
              default-expand-all
              @node-click="handleNodeClick"
            />
          </el-scrollbar>
        </div>
      </el-col>
      <el-col
        :span="1"
        :xs="24"
        :style="{ height: clientHeight - 200 + 'px', paddingTop: '20px' }"
      >
        <el-divider direction="vertical" content-position="center"></el-divider>
      </el-col>
      <el-col :span="19" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入字典名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item prop="key">
            <el-input
              v-model="queryParams.key"
              placeholder="请输入字典类型"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:dict:add']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:dict:edit']"
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
              v-hasPermi="['system:dict:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:dict:export']"
              >导出</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="handleClearCache"
              v-hasPermi="['system:dict:remove']"
              >清理缓存</el-button
            >
          </el-col>
        </el-row>
        <input type="button" id="TEST" value="" hidden="true" />
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="typeList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column
            label="字典名称"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="字典类型"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="
                  drawer = true;
                  dataId = scope.row.id;
                "
                >{{ scope.row.key }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            label="装载到缓存"
            align="center"
            prop="isLoaded"
            :formatter="isLoadedFormat"
          />
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:dict:edit']"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:dict:remove']"
                >删除</el-button
              >
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
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="字典类型" prop="key">
          <el-input
            v-model="form.key"
            placeholder="请输入字典类型"
            :disabled="disableInput"
          />
        </el-form-item>
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="装载到缓存" prop="isLoaded">
          <el-radio-group v-model="form.isLoaded">
            <el-radio
              v-for="dict in isLoadedOptions"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="归属字典" prop="parentId">
          <el-tree
            class="tree-border"
            :data="dataRouteOptions"
            ref="dataRoute"
            show-checkbox
            default-expand-all
            node-key="id"
            :check-strictly="true"
            empty-text="暂无数据"
            :props="defaultProps"
            @check-change="checkChange"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--  字典详情  -->
    <el-drawer
      append-to-body
      :destroy-on-close="true"
      title="字典数据"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose"
      :size="size"
    >
      <DataIndex v-bind:dataId="dataId" />
    </el-drawer>
  </div>
</template>

<script>
import {
  listType,
  getType,
  delType,
  addType,
  updateType,
  exportType,
  clearCache
} from "@/api/system/dict/type";
import { treeselect } from "@/api/system/dataroute";
import dataIndex from "./data.vue";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Dict",
  data() {
    return {
      dataId: "",
      // 抽屉宽度
      size: "70%",
      // 抽屉隐藏
      drawer: false,
      // 字典归属名称
      datarouteName: undefined,
      clientHeight: document.body.clientHeight,
      disableInput: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 选中字典名称
      names: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 字典树选项
      dataRouteOptions: undefined,
      // 字典表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 字典归类名称
      label: undefined,
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      isLoadedOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        parentId: undefined,
        name: undefined,
        key: undefined,
        parentKey: undefined,
        isLoaded: undefined
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "字典名称不能为空", trigger: "blur" }
        ],
        key: [{ required: true, message: "字典类型不能为空", trigger: "blur" }]
      }
    };
  },
  watch: {
    // 根据名称筛选部门树
    datarouteName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.getDicts("sys_dict_isloaded").then(response => {
      this.isLoadedOptions = response.data;
    });
  },
  methods: {
    /** 查询字典类型列表 */
    getList() {
      this.loading = true;
      listType(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.typeList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    checkChange(item, node, self) {
      if (node == true) {
        this.$refs.dataRoute.setCheckedKeys([item.id]);
      }
    },
    // 字典状态字典翻译
    isLoadedFormat(row, column) {
      return this.selectDictLabel(this.isLoadedOptions, row.isLoaded);
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.parentId = data.id;
      if (data.children && data.children.length > 0) {
        this.getChildId(data.children);
      }
      this.getList();
    },
    getChildId(data) {
      if (data.length > 0) {
        data.forEach(item => {
          if (item.children) {
            this.getChildId(item.children);
          }
          this.queryParams.parentId = this.queryParams.parentId + "," + item.id;
        });
      }
    },
    getTreeselect() {
      treeselect().then(response => {
        this.dataRouteOptions = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        parentId: undefined,
        name: undefined,
        key: undefined,
        parentKey: undefined,
        isLoaded: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.queryParams.parentId = undefined;
      this.handleQuery();
    },
    // 所有菜单节点数据
    getDataRouteCheckedKeys() {
      // 目前被选中的菜单节点
      return this.$refs.dataRoute.getCheckedKeys();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加字典类型";
      this.disableInput = false;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.names = selection.map(item => item.name);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getType(id).then(response => {
        this.form = response.data;
        this.$nextTick(() => {
          this.$refs.dataRoute.setCheckedKeys([row.parentId]);
        });
        this.open = true;
        this.title = "修改字典类型";
        this.disableInput = true;
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            this.form.parentId = this.getDataRouteCheckedKeys()[0];
            updateType(this.form).then(() => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.parentId = this.getDataRouteCheckedKeys()[0];
            addType(this.form).then(() => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const names = row.name || this.names;
      this.$confirm('是否确认删除字典为"' + names + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delType(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有类型数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportType(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        });
    },
    /** 清理缓存按钮操作 */
    handleClearCache() {
      clearCache().then(() => {
        this.msgSuccess("清理成功");
      });
    },
    /** 关闭抽屉 */
    handleClose(done) {
      done();
    }
  },
  components: {
    DataIndex: dataIndex
  }
};
</script>
<style>
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
.el-divider--vertical {
  display: inline-block;
  width: 1px;
  height: 100%;
  margin: 0 8px;
  vertical-align: middle;
  position: relative;
}
.el-tree-node__content {
  width: 358px;
}
</style>
