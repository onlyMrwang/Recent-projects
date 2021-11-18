<template>
   <el-dialog
    v-dialogDrag
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="uploadVisible"
    width="600px"
    :before-close="closeUpload">
   <div>
    <el-upload
        action="#"
        :limit="limitNum"
        :file-list="fileList"
        :on-change="changeData"
        :http-request="handleRequest"
        :before-upload="beforeUpload">
        <div style="margin-left: 220px">
          <i class="el-icon-upload" style="color: #cfcfcf;font-size: 50px"></i>
        <div slot="tip" style="color: #999;font-size: 12px">上传文件大小不超过10M</div>  
   
        </div>
    </el-upload>
        <div slot="footer" style="text-align: center; margin: 50px 0 5px 0">
            <el-button type="primary" @click="tosubmit">确 定</el-button>
            <el-button @click="closeUpload">取 消</el-button>
        </div> 
     </div>
  </el-dialog>
 
</template>

<script>
export default {
    props: {
        limitNum: {
            type: Number,
            default: 1
        },
        title: {
            type: String,
            default: '上传文件'
        },
        uploadVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            fileList: [],
            file: null,
        }
    },
    methods: {
          
  //上传前对文件大小进行校验
  beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error('上传文件大小大小不能超过 10MB!');
        return isLt2M;
      }
   },
   changeData (file, fileList) {
       // 数据小于0.1M的时候按KB显示
      const size = file.size/1024/1024 > 0.1 ? `(${(file.size/1024/1024).toFixed(1)}M)` : `(${(file.size/1024).toFixed(1)}KB)`
      file.name.indexOf('M')>-1 || file.name.indexOf('KB')>-1 ? file.name : file.name += size
   },
   closeUpload() {
       this.fileList = []
       this.file = null
       this.$emit('closeUpload')
   },
   handleRequest (data) {
      this.file = data.file
  },
  tosubmit() {
      if(this.file) {
        this.$emit('submitUpload', this.file)  
      }else {
          this.$message.warning('请先上传文件')
      }
      
  }
}
}
</script>

<style lang="scss">
.el-upload-list__item-name {
    text-align: center;
}
</style>