<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
    >
      <el-form-item prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入图片名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="module">
        <el-select
          v-model="queryParams.module"
          placeholder="请选择图片模块"
          clearable
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="dict in moduleOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="format">
        <el-select
          v-model="queryParams.format"
          placeholder="请选择图片格式"
          clearable
          size="small"
          style="width: 150px"
        >
          <el-option
            v-for="dict in formatOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['system:image:add']"
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
          v-hasPermi="['system:image:edit']"
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
          v-hasPermi="['system:image:remove']"
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="imageList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="图片名称"
        prop="name"
        align="center"
        width="180"
      />
      <el-table-column label="图标" align="center" width="100">
        <template slot-scope="scope">
          <el-icon v-html="scope.row.image"></el-icon>
        </template>
      </el-table-column>
      <el-table-column
        label="图片模块"
        align="center"
        prop="module"
        :formatter="moduleFormat"
        width="180"
      />
      <el-table-column
        label="图片格式"
        align="center"
        prop="format"
        :formatter="formatFormat"
        width="180"
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
            v-hasPermi="['system:image:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:image:remove']"
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

    <!-- 添加或修改图片配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="图片名称" prop="name" v-if="disableInput">
          <el-input v-model="form.name" placeholder="请输入图片名称" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="图片模块" prop="module">
              <el-select v-model="form.module" placeholder="请选择">
                <el-option
                  v-for="dict in moduleOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="原图标" v-if="disableInput">
          <el-icon
            v-html="form.image"
            style="padding-top: 8px;margin-left: 3px;"
          ></el-icon>
        </el-form-item>
        <el-form-item label="上传">
          <el-upload
            :file-list="fileList"
            ref="upload"
            :multiple="!disableInput"
            action=""
            class="avatar-uploader"
            list-type="picture-card"
            :http-request="ImgUploadSectionFile"
            :class="{ hide: dialogVisible }"
            accept=".svg"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

i svg {
  width: 18px;
  height: 18px;
}
</style>
<script>
import {
  listImage,
  addImage,
  getImage,
  delImage,
  updateImage
} from "@/api/system/image";

export default {
  name: "Image",
  data() {
    return {
      fileList: [],
      // 上传图标数组
      uploadList: [],
      // 图标路径
      dialogImageUrl: "",
      // 是否显示
      dialogVisible: false,
      // 是否可输入
      disableInput: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 选中图片名称
      names: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 图片表格数据
      imageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 格式字典
      formatOptions: [],
      // 模块字典
      moduleOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        module: undefined,
        name: undefined,
        format: undefined
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        module: [
          { required: true, message: "图片模块不能为空", trigger: "blur" }
        ],
        format: [
          { required: true, message: "图片格式不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_image_format").then(response => {
      this.formatOptions = response.data;
    });
    this.getDicts("sys_image_module").then(response => {
      this.moduleOptions = response.data;
    });
  },
  methods: {
    handleRemove(param, paramList) {
      var index = param.name.lastIndexOf(".");
      var name = param.name.substr(0, index);
      let deleteIndex = this.uploadList.findIndex(item => item.name === name);
      this.uploadList.splice(deleteIndex, 1);
      let vm = this;
      if (this.disableInput == true) {
        vm.dialogVisible = paramList.length >= 1;
      } else {
        vm.dialogVisible = false;
      }
    },
    ImgUploadSectionFile(param) {
      //图片上传
      let upload = {
        name: undefined,
        module: undefined,
        format: undefined,
        image: undefined
      };
      var index = param.file.name.lastIndexOf(".");
      upload.name = param.file.name.substr(0, index);
      var format = param.file.name.substr(index + 1);
      if (format == "icon") {
        upload.format = 0;
      } else if (format == "jpg") {
        upload.format = 1;
      } else if (format == "svg") {
        upload.format = 2;
      }
      let reader = new FileReader();
      reader.readAsText(param.file);
      reader.onload = e => {
        const fileString = e.target.result;
        upload.image = window.btoa(fileString);
      };
      this.uploadList.push(upload);
      let vm = this;
      if (this.disableInput == true) {
        this.dialogVisible = this.uploadList.length >= 1;
      } else {
        vm.dialogVisible = false;
      }
    },
    /** 查询图片列表 */
    getList() {
      this.loading = true;
      listImage(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.imageList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },

    // 表单重置
    reset() {
      // 初始化
      this.dialogVisible = false;
      (this.fileList = []),
        (this.uploadList = []),
        (this.form = {
          id: undefined,
          name: undefined,
          module: undefined,
          format: undefined,
          image: undefined
        });
      this.resetForm("form");
    },
    // 字典状态字典翻译
    formatFormat(row, column) {
      return this.selectDictLabel(this.formatOptions, row.format);
    },
    moduleFormat(row, column) {
      return this.selectDictLabel(this.moduleOptions, row.module);
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
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.names = selection.map(item => item.name);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.disableInput = false;
      this.title = "添加图片";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getImage(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.disableInput = true;
        this.title = "修改图片";
      });
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            if (this.uploadList.length > 0) {
              this.form.image = this.uploadList[0].image;
            } else {
              this.form.image = null;
            }
            updateImage(this.form).then(() => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.uploadList.forEach(i => {
              i.module = this.form.module;
            });
            addImage(this.uploadList).then(() => {
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
      this.$confirm('是否确认删除图片名称为"' + names + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delImage(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    }
  }
};
</script>
