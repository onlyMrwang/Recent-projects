<template>
  <div class="app-container">
    <div class="searchBox">
      <div class="item">
        <div class="label">企业名称:</div>
        <div class="value">
          <el-input
            v-model="queryParams.name"
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
            @click="addFn(1, '')"
            class="btn"
            >增加</el-button
          >
        </div>
      </div>
      <div class="line"></div>
      <el-table :data="tableDate" border :header-cell-style="tableHeaderStyle">
        <el-table-column
          label="企业编码"
          align="center"
          prop="tenantNum"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="企业名称"
          align="center"
          prop="name"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="联系人"
          align="center"
          prop="adminUser"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="联系电话"
          prop="phone"
          align="center"
          width="120"
        />
        <el-table-column
          label="Email"
          prop="email"
          align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="所在城市"
          align="center"
          prop="areaName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="公司地址"
          align="center"
          prop="cmyId"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            {{ scope.row.status === '0' ? '启用' : '停用' }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="创建时间" align="center" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              class="btn1"
              size="mini"
              type="text"
              @click="addFn(2, scope.row)"
              icon="el-icon-edit"
              >修改</el-button
            >
            <el-button
              class="btn1"
              @click="change(scope.row)"
              size="mini"
              type="text"
              icon="el-icon-edit"
              >{{ scope.row.status === '0' ? '停用' : '启用' }}</el-button
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
    <div v-if="show">
      <el-dialog
        :visible.sync="show"
        v-dialogDrag
        width="45%"
        append-to-body
        :close-on-click-modal="false"
        :title="title"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="90px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="企业编码: " prop="tenantNum">
                <el-input v-model="form.tenantNum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业名称: " prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人: " prop="adminUser">
                <el-input v-model="form.adminUser"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话: " prop="phone">
                <el-input v-model="form.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="Email: " prop="email">
                <el-input v-model="form.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所在城市: " prop="cityId">
                <el-select v-model="form.cityId" placeholder="请选择城市">
                  <!-- <el-option :key="''" :label="'请选择城市'" :value="''">
                  </el-option> -->
                  <el-option
                    v-for="item in provinces"
                    :key="item.areaCode"
                    :label="item.areaName"
                    :value="item.areaCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="公司地址: " prop="cmyId">
                <el-input v-model="form.cmyId"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="企业logo: ">
            <div class="flex-img">
              <div
                class="el-upload-list el-upload-list--picture-card"
                v-show="hideShow"
              >
                <div class="el-upload-list__item is-success">
                  <img class="flex-img__image" :src="imageUrl" />
                  <label class="el-upload-list__item-status-label">
                    <i class="el-icon-upload-success el-icon-check"></i>
                  </label>
                  <span class="el-upload-list__item-actions">
                    <span @click="handlePictureCardPreview()">
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span class="el-upload-list__item-delete">
                      <i
                        class="el-icon-delete"
                        @click.stop="handleRemove()"
                      ></i>
                    </span>
                  </span>
                </div>
              </div>
              <el-upload
                ref="newupload"
                action="https://jsonplaceholder.typicode.com/posts/"
                :http-request="beforeUpload"
                list-type="picture-card"
                :headers="upload.headers"
                :on-change="imgChange"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :auto-upload="false"
                :limit="1"
                :file-list="fileList"
                :before-upload="beforeAvatarUpload"
                v-show="!hideShow"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitFn">确 定</el-button>
          <el-button @click="cancelFn">取 消</el-button>
        </div>
      </el-dialog>
      <div v-if="dialogVisible" class="diaimg">
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="imageUrl" alt="" />
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getOrgList,
  getCity,
  uplatetenant,
  addtenant,
  toStop
} from '@/api/platformmanage/Enterprise'
import { upDate, addArray } from '@/api/system/enterprise'
export default {
  data() {
    let code = (rule, value, cb) => {
      let reg = /^[A-Za-z0-9]*$/
      if (!reg.test(value)) {
        cb(new Error('编码只能为数字，大小写字母'))
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
      imageUrl: '',
      showBtnImg: true,
      noneBtnImg: false,
      limitCountImg: 0, //上传图片的最大数量
      // logo图片上传框信息
      dialogImageUrl: '',
      dialogVisible: false,
      // 表单信息
      form: {
        tenantNum: '',
        name: '',
        adminUser: '',
        phone: '',
        email: '',
        cityId: '',
        cmyId: ''
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
        url: '/app/system/tenant'
      },
      // 表格数据
      tableDate: [],
      // 弹出框显示
      show: false,
      // 弹出框标题
      title: '',
      // 文件列表
      fileList: [],
      // 查询参数
      queryParams: {
        name: '',
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      type: null,
      rules: {
        tenantNum: [
          { required: true, message: '请输入企业编码', trigger: 'blur' },
          { min: 3, max: 3, message: '长度为3个字符', trigger: 'blur' },
          { validator: code, trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        adminUser: [
          { max: 32, message: '最长为32字符', trigger: 'blur' },
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: phone, trigger: 'blur' }
        ],
        email: [{ required: true, message: '请输入电子邮箱', trigger: 'blur' }],
        cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
        cmyId: [
          { required: true, message: '请输入公司地址', trigger: 'blur' },
          { max: 128, message: '最长为128字符', trigger: 'blur' }
        ]
      },
      //   省级城市列表
      provinces: [],
      file: null
    }
  },
  computed: {
    hideShow() {
      return this.fileList.length > 0 ? true : false
    }
  },
  created() {
    this.getList()
    this.getCity()
  },
  methods: {
    async getCity() {
      const res = await getCity({ areaLevel: 3 })
      if (res.code == 200) {
        this.provinces = res.data.result
      }
    },
    handlePictureCardPreview() {
      this.dialogVisible = true
    },
    // //删除照片是清空所有
    handleRemove() {
      this.file = ''
      this.imageUrl = ''
      this.imageForm = ''
      this.fileList = []
    },
    // 停用启用按钮
    change(row) {
      const obj = {
        status: row.status === '0' ? '1' : '0',
        tenantId: row.tenantId
      }
      // row.status = row.enabled === '0' ? '1' : '0'
      // row.tenantId = row.tenantId
      this.$confirm(`确定是否${row.status === '0' ? '停用' : '启用'}`, '提示', {
        confirmButtonText: '确定',
        type: 'warning',
        center: true
      })
        .then(() => {
          toStop(obj).then((rsp) => {
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
    },
    // 上传前
    beforeAvatarUpload(file) {
      this.fileList.push({
        url: file.file,
        name: 'logo'
      })
    },
    // 上自定义上传
    beforeUpload(params) {
      let fd = new FormData()
      fd.append('file', params.file)
      fd.append('tenants', JSON.stringify(this.form))
      if (this.type === 2) {
        uplatetenant(fd).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.getList()
            this.show = false
          }
        })
      } else {
        addtenant(fd).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.getList()
          }
        })
      }

      return true
    },
    // 获取企业列表
    async getList() {
      const res = await getOrgList(this.queryParams)
      if (res.code === 200) {
        this.tableDate = res.rows
        this.total = res.total
      }
    },
    // 查询企业
    queryFn() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 添加企业
    addFn(type, value) {
      this.type = type
      if (type == 1) {
        this.title = '新增企业'
        this.form = {
          name: '',
          adminUser: '',
          phone: '',
          email: '',
          cityId: '',
          cmyId: ''
        }
        this.fileList = []
        this.imageUrl = ''
      } else {
        this.form = value
        this.title = '修改企业'
        this.fileList = []
        if (value.fileAddre) {
          this.fileList.push({
            url: value.fileAddre,
            name: 'logo'
          })
          this.imageUrl = value.fileAddre
        } else {
          this.fileList = []
          this.imageUrl = ''
        }
      }
      this.show = true
    },
    imgChange(file, fileList) {
      if (file) {
        this.file = file
        this.fileList.push({
          url: file.raw,
          name: 'logo'
        })
        this.imageUrl = file.url
        this.noneBtnImg = fileList.length >= this.limitCountImg
      }
    },
    // 查看操作
    // handlePictureCardPreview(file) {
    //   this.noneBtnImg = false
    //   this.dialogImageUrl = file.url
    //   this.dialogVisible = true
    // },
    // 保存按钮
    submitFn() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // if(this.type === 2) {
          // this.upDateList();
          let fd = new FormData()
          // if (this.file) {

          //   this.$refs.newupload.submit()

          //   fd.append('file', this.file.raw)
          // }
          if (this.file) {
            fd.append('file', this.file.raw)
            this.form.delUrl = null
          } else {
            if (this.dialogImageUrl == '') {
              this.form.delUrl = 1
            }
          }
          fd.append('tenants', JSON.stringify(this.form))
          if (this.type === 2) {
            uplatetenant(fd).then((res) => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: res.msg
                })
                this.getList()
                this.show = false
              }
            })
          } else {
            addtenant(fd).then((res) => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: res.msg
                })
                this.show = false
                this.getList()
              }
            })
          }
          // }else {
          // this.addInfo()

          // }
        }
      })
    },
    async upDateList() {
      const res = await upDate(this.form)
      if (res.code === 200) {
        this.msgSuccess('企业信息修改成功')
        this.show = false
        this.getList()
      }
    },
    async addInfo() {
      const res = await addArray(this.form)
      if (res.code === 200) {
        this.msgSuccess('企业新增成功')
        this.show = false
        this.getList()
      }
    },
    // 取消按钮
    cancelFn() {
      this.show = false
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
::v-deep .el-dialog__header {
  height: 10px;
}
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
.flex-img {
  display: flex;
}
.image-uploader {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 148px;
  height: auto;
  cursor: pointer;
  line-height: 146px;
  vertical-align: top;
  text-align: center;
}

.image-uploader {
  font-size: 28px;
  color: #8c939d;
}

.image-uploader .el-upload:hover {
  border-color: #409eff;
}

.flex-img__image {
  width: 146px;
  height: 146px;

  border-radius: 6px;
}
</style>

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
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
