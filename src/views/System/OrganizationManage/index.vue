<!--
组织机构管理
-->
<template>
  <div class="app-container">
    <div class="searchBox">
      <div class="item">
        <div class="label">机构名称</div>
        <div class="value">
          <el-input
            v-model="queryParams.nameCN"
            placeholder="请输入机构名称"
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
            v-hasPermi="['system:dept:add']"
            >新增</el-button
          >
        </el-col>
        <!-- <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar> -->
      </el-row>

      <el-table
        :data="deptList"
        row-key="id"
        border
        :header-cell-style="tableHeaderStyle"
        :expand-row-keys="treeExpandData"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          prop="depCode"
          label="机构编码"
          width="300"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="nameCN"
          label="机构名称"
          width="200"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="type"
          label="机构类型"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="provincecn"
          label="省"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="citycn"
          label="市"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="areacn"
          label="区"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-button
                v-if="scope.row.parentId !== '0'"
                size="mini"
                type="text"
                circle
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:dept:remove']"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <el-button
                v-if="scope.row.parentId !== '0'"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:dept:edit']"
              ></el-button>
            </el-tooltip>
            <!-- <el-button size="mini" type="text" @click="handleChange(scope.row)">{{
            scope.row.delFlag === "0" ? "停用" : "启用"
          }}</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加或修改部门对话框 -->
    <div v-if="open">
      <el-dialog
        :title="title"
        :visible.sync="open"
        v-dialogDrag
        width="600px"
        append-to-body
      >
        <el-form ref="form" :model="form" :rules="rule" label-width="80px">
          <!-- <el-row> -->
          <!-- <el-col :span="24" v-if="form.parentId !== '0'"> -->
          <div class="orgList">
            <el-form-item label="上级机构" prop="parentId">
              <treeselect
                style="width:200px"
                v-model="form.parentId"
                :options="deptOptions"
                :normalizer="normalizer"
                @input="inputSelect"
                placeholder="选择上级部门"
              />
            </el-form-item>
          </div>
          <el-form-item label="机构名称" prop="nameCN">
            <el-input
              style="width:200px"
              v-model="form.nameCN"
              placeholder="请输入机构名称"
            />
          </el-form-item>

          <el-form-item label="机构类型" prop="type">
            <el-select
              style="width:200px"
              v-model="form.type"
              placeholder="请选择"
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="驻地地图" prop="map">
            <el-select
              style="width:200px"
              v-model="form.map"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in mapList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="省" prop="province">
            <el-select
              style="width:200px"
              v-model="form.province"
              placeholder="请选择"
              @change="getselected"
            >
              <el-option
                v-for="item in provinceList"
                :key="item.areaId"
                :label="item.areaName"
                :value="item.areaCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="市" prop="city">
            <el-select
              style="width:200px"
              v-model="form.city"
              placeholder="请选择"
              @change="getCity"
            >
              <el-option
                v-for="item in cityList"
                :key="item.areaId"
                :label="item.areaName"
                :value="item.areaCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区" prop="area">
            <el-select
              style="width:200px"
              v-model="form.area"
              placeholder="请选择"
              @change="getarea"
            >
              <el-option
                v-for="item in areaList"
                :key="item.areaId"
                :label="item.areaName"
                :value="item.areaCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="memo">
            <el-input
              style="width:200px"
              v-model="form.memo"
              placeholder="请输入备注"
              maxlength="50"
            />
          </el-form-item>
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
import {
  listDepts,
  listDept,
  getDept,
  delDept,
  addDept,
  updateDept,
  listDeptExcludeChild
} from '@/api/system/dept'
import { debounce } from '@/utils/utils'
import { mapGetters } from 'vuex'
export default {
  data() {
    // const maptry = (rule, value, callback) => {
    //   if (this.form.map.length === 0) {
    //     callback(new Error('不能为空'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      // 机构类型下拉框数据
      typeList: [
        {
          value: '0',
          label: '自有'
        },
        {
          value: '1',
          label: '他有'
        }
      ],
      // 省市区选项
      provinceList: [],
      cityList: [],
      areaList: [],
      mapList: [],
      // 省市区总数据
      allData: [],
      // 部门树级别
      treeLevel: 1,
      // 部门树展开部分
      treeExpandData: [],
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        name: '',
        nameCN: ''
      },

      // 表单参数
      form: {},
      // 表单校验
      rule: {
        parentId: [{ required: true, message: '不能为空', trigger: 'input' }],
        nameCN: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { max: 128, message: '最长为128字符', trigger: 'blur' }
        ],
        type: [
          {
            required: true,
            message: '不能为空',
            trigger: 'change'
          }
        ],
        map: [
          { required: true, message: '不能为空', trigger: 'blur' }
          // { validate: maptry, trigger: 'change' }
        ]
        // province: [{ required: true, message: '不能为空', trigger: 'blur' }],
        // city: [{ required: true, message: '不能为空', trigger: 'blur' }],
        // area: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      // 表单校验
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        // nameCN: [
        //   { required: true, message: "中文名称不能为空", trigger: "blur" }
        // ],
        order: [
          { required: true, message: '显示顺序不能为空', trigger: 'blur' }
        ],
        email: [
          {
            type: 'email',
            message: "'请输入正确的邮箱地址",
            trigger: ['blur', 'change']
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['dictInfo'])
  },
  watch: {
    // 'form.map'() {
    //   if (this.form.map !== []) {
    //     this.rule.map = [
    //       { required: true, message: '不能为空', trigger: 'change' }
    //     ]
    //   } else {
    //     this.rule.map = [
    //       { required: true, message: '不能为空', trigger: 'blur' }
    //     ]
    //   }
    // }
  },
  created() {
    this.rule.map = [{ required: true, message: '不能为空', trigger: 'blur' }]
    this.getList()
  },
  methods: {
    // electtree的校验问题
    inputSelect() {
      this.$refs.form.validateField('parentId')
    },
    // 选中区
    getarea(e) {
      this.$set(this.form, this.form.area, e)
    },
    // select选中省
    getselected(e) {
      if (this.form.area !== '') {
        this.form.area = ''
      }
      this.form.city = ''
      this.areaList = []
      this.cityList = this.allData.filter((item) => {
        return item.parentArea == e
      })
    },
    // select选中市
    getCity(e) {
      this.form.area = ''
      this.areaList = this.allData.filter((item) => {
        return item.parentArea == e
      })
    },
    // 请求数据
    getData() {
      // 请求省市区
      listDepts().then((res) => {
        if (res.code === 200) {
          let data = res.data.result
          this.allData = res.data.result
          this.provinceList = data.filter((item) => {
            return item.areaLevel == 2
          })
        }

        // this.cityList = data.filter((item)=>{
        //   return item.areaLevel == 3
        // })
        //  this.areaList = data.filter((item)=>{
        //   return item.areaLevel == 4
        // })
      })
    },
    iterFn(arr) {
      arr.forEach((item) => {
        this.treeExpandData.push(item.id)
        if (item.children && item.children.length > 0) {
          // 展开所有五级及以上的部门
          if (this.treeLevel + 1 == 3) return
          this.treeLevel++
          this.iterFn(item.children)
          this.treeLevel--
        }
      })
    },
    /** 查询部门列表 */
    getList() {
      // 10.100.10.173:31501/assets/apparea/manage
      this.loading = true
      listDept(this.queryParams).then((response) => {
        this.deptList = this.handleTree(response.data, 'id')
        if (this.deptList != null && this.deptList.length > 0) {
          this.iterFn(this.deptList)
        }
        this.loading = false
      })
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.nameCN,
        children: node.children
      }
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        parentId: undefined,
        name: undefined,
        nameCN: undefined,
        order: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        memo: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.nameCN = ''
      // this.reset()
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.getData()
      this.mapList = this.dictInfo.mapList
      this.cityList = []
      this.areaList = []
      this.reset()
      this.open = true
      this.title = '新增组织机构'
      listDept().then((response) => {
        if (response.code === 200) {
          this.deptOptions = this.handleTree(response.data, 'id')
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // 请求省市区
      listDepts().then((res) => {
        let data = res.data.result
        this.provinceList = data.filter((item) => {
          return item.areaLevel == 2
        })
        this.cityList = data.filter((item) => {
          return item.areaLevel == 3
        })
        this.areaList = data.filter((item) => {
          return item.areaLevel == 4
        })
      })
      this.mapList = this.dictInfo.mapList
      this.reset()
      getDept(row.id).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改部门'
      })
      listDeptExcludeChild(row.id).then((response) => {
        if (response.code === 200) {
          this.deptOptions = this.handleTree(response.data, 'id')
        }
      })
    },
    /** 提交按钮 */
    submitForm: debounce(function() {
      this.rule.map = [
        { required: true, message: '不能为空', trigger: 'change' }
      ]
      const that = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (that.title === '修改部门') {
            if (this.form.type === '自有') {
              this.form.type = 0
            } else if (this.form.type === '他有') {
              this.form.type = 1
            }
            updateDept(this.form).then((rsp) => {
              if (rsp.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              }
            })
          } else {
            addDept(this.form).then((rsp) => {
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
      this.$confirm('是否确认删除名称为"' + row.nameCN + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDept(row.id).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.getList()
          }
        })
      })
      // .then(() => {
      //   this.getList()
      //   this.msgSuccess('删除成功')
      // })
    },
    // 停用启用按钮
    async handleChange(row) {
      if (row.delFlag === '0') {
        row.delFlag = '1'
      } else {
        row.delFlag = '0'
      }
      const res = await updateDept(row)
      this.msgSuccess(res.msg)
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
</style>
