<template>
  <div class="app-container">
    <el-card>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="企业名称: " prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="联系人: " prop="adminUser">
          <el-input v-model="form.adminUser"></el-input>
        </el-form-item>

        <el-form-item label="联系电话: " prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>

        <el-form-item label="Email: " prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>

        <el-form-item label="所在城市: " prop="cityId">
          <el-select
            v-model="form.cityId"
            placeholder="请选择城市"
            style="width:200px"
          >
            <!-- <el-option :key="''" :label="'请选择城市'" :value="''"> </el-option> -->
            <el-option
              v-for="item in provinces"
              :key="item.areaCode"
              :label="item.areaName"
              :value="item.areaCode"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="公司地址: " prop="cmyId">
          <el-input v-model="form.cmyId"></el-input>
        </el-form-item>

        <el-form-item label="企业logo: ">
          <div class="flex-img">
            <div
              class="el-upload-list el-upload-list--picture-card"
              v-show="hideShow"
            >
              <div class="el-upload-list__item is-success">
                <img class="flex-img__image" :src="dialogImageUrl" />
                <label class="el-upload-list__item-status-label">
                  <i class="el-icon-upload-success el-icon-check"></i>
                </label>
                <span class="el-upload-list__item-actions">
                  <span @click="handlePictureCardPreview()">
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span class="el-upload-list__item-delete">
                    <i class="el-icon-delete" @click.stop="handleRemove()"></i>
                  </span>
                </span>
              </div>
            </div>
            <el-upload
              ref="newupload"
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card"
              :on-change="imgChange"
              :http-request="beforeUpload"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :auto-upload="false"
              :limit="1"
              :file-list="fileList"
              v-show="!hideShow"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFn">确 定</el-button>
          <el-button @click="cancelFn">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { upDate, getData } from '@/api/system/enterprise'
// import City from '@/assets/city/index'
import { getCity } from '@/api/platformmanage/Enterprise'
export default {
  data() {
    return {
      showBtnImg: true,
      noneBtnImg: false,
      limitCountImg: 0, //上传图片的最大数量
      // logo图片上传框信息
      dialogImageUrl: '',
      dialogVisible: false,
      // 表单信息
      form: {
        name: '',
        adminUser: '',
        phone: '',
        cityId: '',
        email: '',
        gsdz: ''
      },
      fileList: [],
      file: null,
      // 表格数据
      tableDate: [],
      // 弹出框显示
      show: false,
      // 弹出框标题
      title: '',
      // 查询参数
      queryParams: {},
      rules: {
        name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        adminUser: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        email: [{ required: true, message: '请输入电子邮箱', trigger: 'blur' }],
        cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
        cmyId: [{ required: true, message: '请输入公司地址', trigger: 'blur' }]
      },
      //   省级城市列表
      provinces: []
      //   绑定省级数据
    }
  },
  computed: {
    hideShow() {
      return this.fileList.length > 0 ? true : false
    }
  },
  created() {
    getData().then((res) => {
      this.form = res.data
      this.form.cityId += ''
      if (res.data.fileAddre) {
        this.fileList.push({
          url: res.data.fileAddre,
          name: 'logo'
        })
        this.dialogImageUrl = res.data.fileAddre
      } else {
        this.fileList = []
        this.dialogImageUrl = ''
      }
    })
    this.getCity()
  },
  methods: {
    // 上传钩子
    beforeUpload(params) {
      let fd = new FormData()
      fd.append('file', params.file)
      fd.append('tenants', JSON.stringify(this.form))
      upDate(fd).then((res) => {
        if (res.code === 200) {
          this.msgSuccess('保存企业配置成功')
        }
      })

      return true
    },
    // 查询企业
    queryFn() {},
    // 添加企业
    addFn() {
      this.show = true
      this.title = '新增企业'
    },
    // 移除操作
    handleRemove(file, fileList) {
      this.fileList = []
      this.dialogImageUrl = ''
      this.file = null
      if (fileList) {
        this.noneBtnImg = fileList.length >= this.limitCountImg
      }
    },
    imgChange(file, fileList) {
      this.file = file
      this.fileList = [
        {
          url: file.url,
          name: file.name
        }
      ]
      this.dialogImageUrl = file.url
      if (fileList) {
        this.noneBtnImg = fileList.length >= this.limitCountImg
      }
    },
    // 点击查看钩子
    handlePictureCardPreview(file) {
      this.dialogVisible = true
      this.noneBtnImg = false
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 获得省级列表
    async getCity() {
      const res = await getCity({ areaLevel: 3 })
      if (res.code == 200) {
        this.provinces = res.data.result
      }
    },
    // getProvince() {
    //   this.provinces = City
    // },
    // 保存按钮
    submitFn() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let fd = new FormData()
          if (this.file) {
            fd.append('file', this.file.raw)
            this.form.delUrl = null
          } else {
            if (this.dialogImageUrl == '') {
              this.form.delUrl = 1
            }
          }
          fd.append('tenants', JSON.stringify(this.form))
          // console.log(fd.append('tenants', JSON.stringify(this.form)))
          // console.log('this.file------', this.file)
          // fd.append('file', this.file)
          upDate(fd).then((res) => {
            if (res.code === 200) {
              this.msgSuccess('保存企业配置成功')
            }
          })
          // upDate(this.form).then((res) => {
          //   if(res.code === 200){
          //     this.msgSuccess("保存企业配置成功");
          //   }
          // });
          // this.$refs.newupload.submit()
        }
      })
    },
    // 取消按钮
    cancelFn() {
      // this.$refs.form.resetFields()
    }
  }
}
</script>

<style scoped>
.el-input--medium /deep/ .el-input__inner {
  width: 221px !important;
  border-radius: 10px !important;
}
.disUoloadSty /deep/ .el-upload--picture-card {
  display: none !important; /* 上传按钮隐藏 */
}
::v-deep .el-input__inner {
  width: 12.5rem;
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
