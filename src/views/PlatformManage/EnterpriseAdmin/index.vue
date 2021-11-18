<template>
  <div class="app-container">
    <div class="searchBox">
      <div class="item">
        <div class="label">企业名称:</div>
        <div class="value">
          <el-input
            v-model="queryParams.teantname"
            placeholder="请输入企业名称"
            clearable
          />
        </div>
      </div>
      <div class="item">
        <el-button type="primary" @click="queryFn">查询</el-button>
      </div>
    </div>

    <el-card class="bottom">
      <div class="head-container">
        <div style="margin-bottom: 10px">
          <el-button
            size="mini"
            icon="el-icon-plus"
            type="primary"
            @click="addFn"
            class="btn"
            >增加</el-button
          >
        </div>
      </div>
      <div class="line"></div>
      <el-table border :header-cell-style="tableHeaderStyle" :data="tableData">
        <el-table-column
          label="用户名"
          align="center"
          prop="userName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="姓名"
          align="center"
          prop="fullName"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="手机号码" align="center" prop="phone" />
        <el-table-column
          label="邮箱"
          align="center"
          prop="email"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="所属企业"
          align="center"
          prop="teantname"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="状态" align="center" prop="delFlag">
          <template slot-scope="scope">
            {{ scope.row.delFlag === '0' ? '启用' : '停用' }}
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="操作" align="center" width="240">
          <template slot-scope="scope">
            <el-button
              class="btn1"
              @click="upDateList(scope.row)"
              size="mini"
              type="text"
              icon="el-icon-edit"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              class="btn1"
              icon="el-icon-key"
              @click="handleResetPwd(scope.row)"
              >密码重置</el-button
            >
            <el-button
              class="btn1"
              @click="change(scope.row)"
              size="mini"
              type="text"
              icon="el-icon-edit"
              >{{ scope.row.delFlag === '0' ? '停用' : '启用' }}</el-button
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
    </el-card>
    <!-- 新增修改弹出框 -->
    <el-dialog :visible.sync="show" width="660px" append-to-body :title="title">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名: " prop="userName">
              <el-input v-model="form.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职工姓名: " prop="fullName">
              <el-input v-model="form.fullName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="密码: " prop="password">
              <el-input v-model="form.password" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码: " prop="phone">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱: " prop="email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属企业: " prop="tenantId">
              <el-select
                v-model="form.tenantId"
                :clearable="true"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in enterprise"
                  :key="item.tenantId"
                  :label="item.name"
                  :value="item.tenantId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFn">确 定</el-button>
        <el-button @click="cancelFn">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTableList, addList, upDateList } from '@/api/system/enterpriseadmin'
import { getOrgList, resetUserPwd } from '@/api/platformmanage/Enterprise'
export default {
  data() {
    let code = (rule, value, cb) => {
      let reg = /^[A-Za-z0-9]*$/
      if (!reg.test(value)) {
        cb(new Error('只能输入字母或数字'))
      } else {
        cb()
      }
    }
    let phone = (rule, value, cb) => {
      let reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (!reg.test(value)) {
        cb(new Error('请输入正确的手机号'))
      } else {
        cb()
      }
    }
    return {
      listType: 1,
      // 表单信息
      form: {},
      // 表格数据
      tableData: [],
      // 弹出框显示
      show: false,
      // 数据条数
      total: 0,
      // 弹出框标题
      title: '',
      // 查询参数
      queryParams: {
        teantname: '',
        pageNum: 1,
        pageSize: 10
      },
      enterprise: [], //获取企业
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { max: 20, message: '最长为20字符', trigger: 'blur' },
          { validator: code, trigger: 'blur' }
        ],
        fullName: [
          { required: true, message: '请输入职工姓名', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入职工姓名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: phone, trigger: 'blur' }
        ],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        teantname: [
          { required: true, message: '请选择所属企业', trigger: 'change' }
        ],
        tenantId: [{ required: true, message: '请选择企业', trigger: 'change' }]
      },
      //   省级城市列表
      provinces: []
    }
  },
  created() {
    this.getEnterprise()
    this.getList()
  },
  methods: {
    upDateList(val) {
      this.listType = 2
      this.form = val
      this.form.password = 123456
      this.show = true
      this.title = '企业管理员修改'
    },
    //查询企业管理员
    async getList() {
      const res = await getTableList(this.queryParams)
      if (res.code === 200) {
        this.tableData = res.rows
        this.total = res.total
      }
    },
    // 获取企业列表
    async getEnterprise() {
      const res = await getOrgList()
      if (res.code === 200) {
        this.enterprise = res.rows
      }
    },
    // 查询企业
    queryFn() {
      this.getList()
    },
    // 添加企业
    addFn() {
      this.show = true
      this.title = '企业管理员新增'
      this.listType = 1
      this.form = {}
      this.form.password = 123456
    },

    // 停用启用按钮
    change(row) {
      // row.delFlag = row.delFlag === '0' ? '1' : '0'
      let obj = JSON.parse(JSON.stringify(row))
      obj.delFlag = obj.delFlag === '0' ? '1' : '0'
      row.password = 123456
      this.$confirm(
        `确定是否${row.delFlag === '0' ? '停用' : '启用'}`,
        '提示',
        {
          confirmButtonText: '确定',
          type: 'warning',
          center: true
        }
      )
        .then(() => {
          upDateList(obj).then((rsp) => {
            if (rsp.code === 200) {
              this.$message({
                type: 'success',
                message: rsp.msg
              })
              this.getList()
            }
          })
        })
        .catch(() => {})
      // upDateList(row).then((rsp) => {
      //   if (rsp.code === 200) {
      //     this.$message({
      //       type: 'success',
      //       message: rsp.msg
      //     })
      //     this.getList()
      //   }
      // })
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
    // 保存按钮
    submitFn() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.listType == 1) {
            addList(this.form).then((rsp) => {
              if (rsp.code === 200) {
                this.msgSuccess('保存企业配置成功')
                this.show = false
                this.getList()
              }
            })
          } else {
            upDateList(this.form).then((rsp) => {
              if (rsp.code === 200) {
                this.msgSuccess('修改企业配置成功')
                this.show = false
                this.getList()
              }
            })
          }
        }
      })
    },
    // 取消按钮
    cancelFn() {
      this.$refs.form.resetFields()
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global.scss';

.el-input--medium ::v-deep .el-input__inner {
  width: 221px !important;
  border-radius: 10px !important;
}
.disUoloadSty ::v-deep .el-upload--picture-card {
  display: none !important; /* 上传按钮隐藏 */
}
.bottom {
  margin-top: 10px;
}
.searchBox {
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 13px 15px;
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
