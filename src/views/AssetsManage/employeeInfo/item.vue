<template>
  <el-dialog
    v-dialogDrag
    :visible.sync="showPersonItem"
    @close="closeDialog"
    :close-on-click-modal="false"
    width="75%"
    :title="type === 1 ? '新增职工' : '修改职工信息'"
  >
    <div class="personBox">
      <el-form
        :model="personInfo"
        :rules="rules"
        ref="personInfo"
        label-width="132px"
      >
        <el-row>
          <!-- <el-col :span="7" v-if="type === 1">
            <el-form-item label="工作编号:" prop="staffCode">
              <el-input v-model="personInfo.staffCode" />
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="姓名:" prop="workName">
              <el-input v-model.trim="personInfo.workName" placeholder="请输入姓名"/>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <div class="orgList">
              <el-form-item label="所属组织机构:" prop="workOrgId" :show-message="!personInfo.workOrgId">
                <treeselect
                  v-model="personInfo.workOrgId"
                  :options="deptList"
                  :default-expand-level="1"
                  placeholder="请选择组织机构"
                  :normalizer="normalizer"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="是否是司机:" prop="ifDriver">
              <el-radio-group v-model="personInfo.ifDriver" @change="changeIfDriver">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="personInfo.ifDriver == 0">
          <el-col :span="7">
            <el-form-item label="邮箱:" prop="email">
              <el-input v-model.trim="personInfo.email" placeholder="请输入邮箱"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话:" prop="phone">
              <el-input v-model.trim="personInfo.phone" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="应急角色:" prop="emergencyRole">
              <!-- <el-input v-model.trim="personInfo.emergencyRole" placeholder="请输入应急角色"/> -->
              <el-select
                v-model="personInfo.emergencyRole"
                :clearable="true"
                placeholder="请选择应急角色"
              >
                <el-option
                  v-for="item in []"
                  :key="item.value"
                  :label="item.label"
                  :value="Number(item.value)"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="是否私人充电:" prop="isPrivateRecharge">
              <el-radio-group v-model="personInfo.isPrivateRecharge" @change="changeIsPrivate">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="personInfo.isPrivateRecharge == '0'">
          <el-col :span="7">
            <el-form-item label="私家车牌:" prop="licensePriva">
              <el-input v-model.trim="personInfo.licensePriva" placeholder="请输入私家车牌"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆型号:" prop="cardModel">
              <el-input v-model.trim="personInfo.cardModel" placeholder="请输入车辆型号"/>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="车辆类型:" prop="cardType">
              <el-select
                v-model="personInfo.cardType"
                :clearable="true"
                placeholder="请选择车辆类型"
              >
                <el-option
                  v-for="item in dictInfo.carType"
                  :key="item.value"
                  :label="item.label"
                  :value="Number(item.value)"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否开通APP账号:" label-width="160" prop="openAppAcc">
              <el-radio-group v-model="personInfo.openAppAcc" @change="changeOpenApp">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="personInfo.openAppAcc == 0">
          <el-col :span="7">
            <el-form-item label="APP登录账号:"  prop="appAcc">
              <el-input v-model.trim="personInfo.appAcc" placeholder="请输入APP登录账号"/>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="APP登录密码:">
              <el-input disabled value="123456" type="password" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="personInfo.openAppAcc == 0">
           <el-col>
            <el-form-item label="用户头像: ">
              <div style="display: flex;">
                <div> 
                  <div class="tips">
                    (图片大小不能超过5MB,推荐尺寸178*178)
                </div>
                <el-upload
                        class="avatar-uploader"
                        action="#"
                        :http-request="uploadAvatar"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                    <div class="imgBox">
                      <img v-if="imgUrl" :src="imgUrl" class="avatar" title="点击头像可更换头像">
                    </div>
                    <i v-if="!imgUrl" class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
               
                </div>   
               <div v-if="imgUrl" style="margin:30px 0 0 -60px;">
              <el-link type="primary" :underline="false" @click="deleteImg">
                删除头像
              </el-link>
             </div>
            </div>
            </el-form-item>
        
        </el-col>
        </el-row>  
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loadingBtn" @click="submitFn">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import { addEmployeeInfo, editEmployeeInfo } from "@/api/asset/employeeinfo";
import { mapGetters } from "vuex";
export default {
  props: {
    type: {
      type: Number,
      default: 1, //新增 1, 修改 2
    },
    info: {
      type: Object,
      default: function() {
        return {};
      },
    },
  },
  computed: {
    ...mapGetters(["dictInfo", "deptList"]),
  },
  data() {
    var Phone = (rule, value, callback) => {
      var str = /^1[3456789]\d{9}$/;
      if (value) {
        if (!str.test(value)) {
          callback(new Error("手机号格式不正确"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var Email = (rule, value, callback) => {
      var str = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (value) {
        if (!str.test(value)) {
          callback(new Error("邮箱格式不正确"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var Account = (rule, value, callback) => {
      var regPos = /^\d+(\.\d+)?$/; //非负浮点数
      var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
      if (value) {
        if (regPos.test(value) || regNeg.test(value)) {
          callback(new Error("app登录账号不能为纯数字"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      showPersonItem: true,
      personInfo: null,
      imgUrl: '',
      file: '',
      rules: {
        staffCode: [
          { required: true, message: "请输入工作编号", trigger: "blur" },
        ],
        email: [{ validator: Email, trigger: "blur" }],
        workName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        workOrgId: [
          { required: true, message: "请选择组织机构", trigger: "change" },
        ],
        phone: [{ required: false, validator: Phone, trigger: "blur" }],
        appAcc: [{ required: true, message: "请输入App登录账号", trigger: "blur" }, 
        {validator: Account, trigger: "blur"}],
        openAppAcc: [{ required: true, message: "请选择是否开通APP登录", trigger: "blur" }],
        ifDriver: [{ required: true, message: "请选择是否是司机", trigger: "blur" }],
        isPrivateRecharge: [{ required: true, message: "请选择是否私人充电", trigger: "blur" }],
      },
    };
  },
  created() {
    this.personInfo = this.info
    if (this.type === 1) {
      this.personInfo.ifDriver = 0;
      this.personInfo.isPrivateRecharge = 0;
      this.personInfo.openAppAcc = 0;
    }else {
       this.imgUrl = this.info.photo || null;
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog", 2);
    },
    submitFn() {
      this.$refs.personInfo.validate(async (valid) => {
        if(valid) {
        this.loadingBtn = true
         let params = new FormData()
         if(this.file) {
           params.append('file', this.file)
         }
         params.append('basicUserInfo', JSON.stringify(this.personInfo))
         if(this.type === 1) {
         const rsp = await addEmployeeInfo(params) 
         if(rsp.code === 200) {
           this.$message({
             type: 'success',
             message: '新增成功'
           })
           this.loadingBtn = false
           this.$emit('closeDialog', 1)
         }else {
            this.loadingBtn = false
         }
      }else {
         let params = new FormData()
         if(this.file) {
            params.append('file', this.file)
         }
         params.append('basicUserInfo', JSON.stringify(this.personInfo))
          const rsp = await editEmployeeInfo(params) 
         if(rsp.code === 200) {
           this.$message({
             type: 'success',
             message: '修改成功'
           })
           this.loadingBtn = false
           this.$emit('closeDialog', 1)
         }else {
            this.loadingBtn = false
         }
        }
       }
      })
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.nameCN,
        children: node.children,
      };
    },
    changeIfDriver(val) {
      this.personInfo.ifDriver = val
    },
    changeOpenApp(val) {
      this.personInfo.openAppAcc = val
    },
    changeIsPrivate(val) {
      this.personInfo.isPrivateRecharge = val
    },
    handleAvatarSuccess(res, file) {
      this.imgUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      const isImage = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg'
      if (!isLt5M) {
        this.$message.error("上传头像图片只能是png,jpg,jpeg格式!");
      }
      if(!isImage) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isLt5M && isImage;
    },
    uploadAvatar(file) {
      this.file =  file.file
      this.imgUrl = URL.createObjectURL(file.file)
    },
    deleteImg() {
      this.file = null
      this.imgUrl = null
      if(this.type === 2) {
        this.personInfo.photo = null
      }
    }
  },
};
</script>
<style lang="scss">
@import "@/assets/styles/global.scss";
.personBox {
  .el-form-item {
    margin-bottom: 12px;
  }
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: $btnMainColor;
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
  .imgBox:hover {
    position: relative;
    .deleteIcon {
      display: block;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .deleteIcon {
    display: none;
  }

</style>
<style lang="scss" scoped>
.dialog-footer {
  width: 100%;
  text-align: center;
  display: inline-block;
  margin: 30px 0;
}  
.tips {
  &::before {
    content: '*';
    color: red;
    margin-right: 3px;
  }
  color: #999;
  font-size: 12px;
}
</style>
