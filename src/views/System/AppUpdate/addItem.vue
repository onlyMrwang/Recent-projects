<template>
  <div class="addItem">
    <div class="back" @click="goBack">
      <img src="@/assets/images/fanhui.png"/>
      <span>返回上一页</span>
    </div>
    <div class="content">
        <el-row :gutter="15">
            <el-col :span="8" class="left">
               <div class="showItem">
                    <!-- <div class="overlay"></div> -->
                    <div class="updateBox">
                        <div v-html="appInfo.content"></div>
                    </div>
               </div>
            </el-col>
            <el-col :span="16">
               <div class="right">
                   <el-row style="margin-bottom: 20px">
                       <el-col :span="12">
                           <div class="item">
                               <div class="label">版本号:</div>
                               <div class="value">
                                   <el-input-number :controls="false" :min="0" v-model.trim="appInfo.versionCode"/>
                               </div>
                           </div>
                       </el-col>
                        <el-col :span="12">
                           <div class="item">
                               <div class="label">版本名称:</div>
                               <div class="value">
                                     <el-input v-model.trim="appInfo.versionName"/>
                               </div>
                           </div>
                       </el-col>
                   </el-row>
                    <el-row>
                       <el-col :span="12">
                           <div class="item">
                               <div class="label">系统类型:</div>
                               <div class="value">
                                    <el-radio v-model="appInfo.os" :label="1">android</el-radio>
                                    <el-radio v-model="appInfo.os" :label="0">ios</el-radio>
                               </div>
                           </div>
                       </el-col>
                        <el-col :span="12">
                           <div class="item">
                               <div class="label">是否强制更新:</div>
                               <div class="value">
                                    <el-radio v-model="appInfo.ifForce" :label="1">是</el-radio>
                                    <el-radio v-model="appInfo.ifForce" :label="0">否</el-radio>
                               </div>
                           </div>
                       </el-col>
                   </el-row>
                  <div class="line">
                      <div class="label">更新内容:</div>
                      <div class="value">
                          <Editor @changeText="changeText"/>
                      </div>
                  </div>
                  <div class="line">
                      <div class="label">上传安装包:</div>
                      <div class="value">
                           <el-upload
                                action="#"
                                :limit="1"
                                :file-list="fileList"
                                :on-change="changeData"
                                :on-remove="removeFile"
                                :http-request="handleRequest"
                                :before-upload="beforeUpload">
                                <div style="margin-left: 30px">
                                <i class="el-icon-upload" style="color: #cfcfcf;font-size: 30px;margin-top: 8px;"></i>
                                <div slot="tip" style="color: #999;font-size: 12px">上传文件大小不超过100M</div>
                                </div>
                            </el-upload>
                      </div>   
                  </div>
                  <div class="bottom">
                      <el-button type="primary" @click="submitAppInfo" :loading="showLoading">确定</el-button>
                      <el-button @click="goBack">取消</el-button>
                  </div>
                </div> 
            </el-col>
        </el-row>
    </div>
  </div>
</template>

<script>
import { addAppUpdateInfo } from '@/api/system/app'
import Editor from '@/components/Editor'
export default {
    components: { Editor },
   data() {
       return { 
           content: null, 
           appInfo: { 
               versionCode: undefined,
               versionName: null,
               os: null,
               content: null,
               ifForce: null,
           },
           file: null,
           fileList: [],
           showLoading: false
       }
   },
   methods: {
       goBack() {
           this.$emit('closeAdd')
       },
       async submitAppInfo() { 
           if(!this.appInfo.versionCode) {
               this.$message({
                   type: 'error',
                   message: '请填写版本号'
               })
               return
           }
             if(!this.appInfo.versionName) {
               this.$message({
                   type: 'error',
                   message: '请填写版本名称'
               })
               return
           }
             if(this.appInfo.os != '0' && !this.appInfo.os) {
               this.$message({
                   type: 'error',
                   message: '请选择系统类型'
               })
               return
           }
             if(this.appInfo.ifForce != '0' && !this.appInfo.ifForce) {
               this.$message({
                   type: 'error',
                   message: '请选择是否强制更新'
               })
               return
           }
         
           if(!this.appInfo.content) {
               this.$message({
                   type: 'error',
                   message: '请填写更新内容'
               })
               return
           }
           if(!this.file) {
               this.$message({
                   type: 'error',
                   message: '请上传安装包'
               })
               return
           }
         this.showLoading = true
         let params = new FormData()
         params.append('file', this.file)
         params.append('appRenewRecord', JSON.stringify(this.appInfo))
         const rsp = await addAppUpdateInfo(params)
         if(rsp.code === 200) {
             this.$message({
                 type: 'success',
                 message: '新增成功'
             })
              this.showLoading = false
             this.goBack()
         }else {
              this.showLoading = false
         }
       },
       removeFile() {
           this.file = null
       },
        beforeUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 100;
            if (!isLt2M) {
                this.$message.error('上传文件大小大小不能超过 100MB!');
                return isLt2M;
            }
        },
        changeData (file, fileList) {
            // 数据小于0.1M的时候按KB显示
            const size = file.size/1024/1024 > 0.1 ? `(${(file.size/1024/1024).toFixed(1)}M)` : `(${(file.size/1024).toFixed(1)}KB)`
            file.name.indexOf('M')>-1 || file.name.indexOf('KB')>-1 ? file.name : file.name += size
        },
        handleRequest (data) {
            this.file = data.file
        },
       changeText(val) {
         if(val) {
             this.appInfo.content = val
         }else {
             this.appInfo.content = null
         }
       }
   }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.addItem {
  padding: 10px;
 .back {
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    img {
      width: 20px;
      height: 20px;
    } 
    span {
        padding-left: 10px;
        color: $topMenuActiveColor;
        font-size: 14px;
      }
  }
  .content {
      .left {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        .showItem {  
          position: relative; 
          background-color: #fff;
          border-radius: 10px;  
          width: 375px;
          height: 520px;
          position: relative; 
        //   .overlay {
        //     position: absolute;
        //     top: 0;
        //     left: 0;
        //     z-index: 2009; 
        //     width: 100%;
        //     height: 100%;
        //     background-color: rgba(0, 0, 0, 0.6);
        //   }
          .updateBox {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 240px;
              min-height: 260px;
              max-height: 260px;
              overflow-y: auto;
              border: 1px solid #cfcfcf;
          }
        }
      }
      .right {
           background: #fff;
           min-height: calc(100vh - 170px);
           padding: 20px 40px 20px 10px;
           .bottom {
               text-align: center;
               position: absolute;
               bottom: 10px;
               right: 10px;
               transform: translate(-50%, -50%);
           }
          .item {
              display: flex;
              align-items: center;
              .label {
                  width: 120px;
                  text-align: right;
                  color: #484848;
                  font-size: 14px;
                  &::before {
                      content: '*';
                      color: red;
                  }
              }
              .value {
                  flex: 1;
                  margin-left: 10px;
              }
          }
          .line {
              display: flex;
              margin-bottom: 20px;
              .label {
                  width: 120px;
                  margin-top: 35px;
                  text-align: right;
                  color: #484848;
                  font-size: 14px;
                  &::before {
                      content: '*';
                      color: red;
                  } 
              }
              .value {
                  flex: 1;
              }
          }
      }
  }
}
</style>