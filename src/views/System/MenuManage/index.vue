<template>
  <div class="menuBox">
    <div class="searchBox">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item prop="nameCN" label="菜单中文名称">
        <el-input
          v-model="queryParams.nameCN"
          placeholder="请输入中文名称"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="status" label="菜单状态">
        <el-select v-model="queryParams.status" placeholder="菜单状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
     
    </el-form> 
    <div>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button  @click="resetQuery">重置</el-button>
      </div>
  </div>
   <div class="zw"></div>
    <el-row :gutter="10" class="mb8" style="margin-top :10px">
      <el-col :span="1.5">
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="handleAdd"
          v-hasPermi="['system:menu:add']"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table
      :data="menuList"
      row-key="id"
      :header-cell-style="tableHeaderStyle"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="nameCN" label="名称" :show-overflow-tooltip="true" width="160"></el-table-column>
      <!-- <el-table-column prop="image" label="图标" align="center" width="100">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.image" />
        </template>
      </el-table-column> -->
      <el-table-column prop="perms" label="权限标识" ></el-table-column>
      <el-table-column prop="url" label="资源路径" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="statusFormat" width="80"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:menu:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:menu:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:menu:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <div v-if="open">
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="600px" :close-on-click-modal="false" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="kind">
              <el-radio-group v-model="form.kind">
                <el-radio label="0">菜单</el-radio>
                <el-radio label="1">操作</el-radio>
                <el-radio label="5">目录</el-radio>
                <el-radio label="6">按钮</el-radio>
                <el-radio label="4">外部菜单</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.kind != '6'" label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.image" placeholder="点击选择图标" >
                  <!-- <svg-icon
                    v-if="form.image"
                    slot="prefix"
                    :icon-class="form.image"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  /> -->
                  <i  slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" :disabled="disableInput"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中文名称" prop="nameCN">
              <el-input v-model="form.nameCN" placeholder="请输入中文名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="order">
              <el-input-number v-model="form.order" controls-position="right" :min="0" />
              <!-- <el-input-number
                v-model="form.order" 
                controls-position="right" 
                @change="handleChange" 
                :min="0" 
                :max="10">
              </el-input-number> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="呈现方式" prop="target">
              <el-input v-model="form.target" placeholder="请输入呈现方式" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.kind != '6'" label="显示状态">
              <el-radio-group v-model="form.visible">
                <el-radio
                  v-for="dict in visibleOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.kind == '4'">
            <el-form-item label="外部路径" prop="location">
              <el-input v-model="form.location" placeholder="请输入外部路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.kind != '5'" label="权限标识">
              <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.kind == '0' || form.kind == '4'">
            <el-form-item label="资源路径" prop="url">
              <el-input v-model="form.url" type="textarea" placeholder="请输入资源路径"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="备注" prop="memo">
              <el-input v-model="form.memo" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    </div>
  </div>
</template>

<script>
import { listMenu, getMenu, delMenu, addMenu, updateMenu } from "@/api/system/menu";
import IconSelect from "@/components/IconSelect";

  export default {
    name: "Menu",
    components: { IconSelect },
    data() {
      return {
        disableInput: false,
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 菜单表格树数据
        menuList: [],
        // 菜单树选项
        menuOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 显示状态数据字典
        visibleOptions: [],
        // 菜单状态数据字典
        statusOptions: [],
        // 查询参数
        queryParams: {
          name: undefined,
          nameCN: undefined,
          visible: undefined,
          status: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          name: [
            { required: true, message: "菜单名称不能为空", trigger: "blur" }
          ],
          order: [
            { required: true, message: "菜单顺序不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getList();
      this.getDicts("sys_show_hide").then(response => {
        this.visibleOptions = response.data;
    });
      this.getDicts("sys_menu_status").then(response => {
        this.statusOptions = response.data;
    });
    },
    methods: {
      // 选择图标
      selected(name) {
        this.form.image = name;
      },
      /** 查询菜单列表 */
      getList() {
        this.loading = true;
        listMenu(this.queryParams).then(response => {
          this.menuList = this.handleTree(response.data, "id");
        this.loading = false;
      });
      },
      /** 转换菜单数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.id,
          label: node.nameCN,
          children: node.children
        };
      },
      /** 查询菜单下拉树结构 */
      getTreeselect() {
        listMenu().then(response => {
          this.menuOptions = [];
        const menu = { id: "0", nameCN: '主类目', children: [] };
        menu.children = this.handleTree(response.data, "id");
        this.menuOptions.push(menu);
      });
      },
      // 显示状态字典翻译
      visibleFormat(row, column) {
        if (row.kind == "6") {
          return "";
        }
        return this.selectDictLabel(this.visibleOptions, row.visible);
      },
      // 菜单状态字典翻译
      statusFormat(row, column) {
        if (row.kind == "6") {
          return "";
        }
        return this.selectDictLabel(this.statusOptions, row.status);
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
          parentId: null,
          name: undefined,
          image: undefined,
          kind: "5",
          order: 1,
          visible: "0",
          status: "0"
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 新增按钮操作 */
      handleAdd(row) {
        this.reset();
        this.getTreeselect();
        this.disableInput = false;
        if (row != null && row.id) {
          this.form.parentId = row.id;
        } else {
          this.form.parentId = "0";
        }
        this.open = true;
        this.title = "添加菜单";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.getTreeselect();
        getMenu(row.id).then(response => {
          this.form = response.data;
        this.open = true;
        this.title = "修改菜单";
        this.disableInput = true;
      });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateMenu(this.form).then(() => {
                this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
            } else {
              addMenu(this.form).then(() => {
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
        this.$confirm('是否确认删除名称为"' + row.nameCN + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMenu(row.id);
        }).then(() => {
          this.getList();
        this.msgSuccess("删除成功");
      })
      }
    }
  };
</script>
<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.menuBox {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 15px;
}
.zw {
  background-color: $pageBgColor;
  width: 110%;
  height: 10px;
  margin: 0 -15px;
}
.searchBox {
  display: flex;
  justify-content: space-between;
  // margin-bottom: 10px;
}
</style>