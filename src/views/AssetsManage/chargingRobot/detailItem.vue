<template>
 <div class="detailDialog">
   <el-dialog
    v-dialogDrag
    :visible.sync="showItem"
    @close="closeDialog"
    width="1200px"
    disabled
    title="充电机器人信息"
  >
    <div class="detailItemBox">
        <div class="right">
           <el-row>
              <el-col :span="4">
                <div class="label">充电机器人编号</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.assetNum || '--'}}</div>
              </el-col>
              <el-col :span="4">
                <div class="label">机器人名称</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.robotName || '--'}} </div>
              </el-col>
               <el-col :span="4">
                <div class="label">机器人型号</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.robotMark || '--'}}</div>
              </el-col>
            </el-row> 
            <el-row>
              <el-col :span="4">
                <div class="label">厂商</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{formatManuName(dialogForm.manufacturId)}}</div>
              </el-col>
              <el-col :span="4">
                <div class="label">厂商联系人</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.facturPerson || '--'}} </div>
              </el-col>
               <el-col :span="4">
                <div class="label">厂商电话</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.facturPhone || '--'}}</div>
              </el-col>
            </el-row> 
            <el-row>
              <el-col :span="4">
                <div class="label">维保周期(月)</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.revolution || '--'}}</div>
              </el-col>
              <el-col :span="4">
                <div class="label">采购时间</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.purchTime || '--'}} </div>
              </el-col>
               <el-col :span="4">
                <div class="label">安装时间</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.installTime || '--'}}</div>
              </el-col>
            </el-row> 
             <el-row>
              <el-col :span="4">
                <div class="label">所属组织机构</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{formatDeptName(dialogForm.orgId)}}</div>
              </el-col>
              <el-col :span="4">
                <div class="label">机构负责人</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.userId || '--'}} </div>
              </el-col>
               <el-col :span="4">
                <div class="label">电话</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.phone || '--'}}</div>
              </el-col>
            </el-row> 
             <el-row>
              <el-col :span="4">
                <div class="label">安装位置</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.instalPosition || '--'}}</div>
              </el-col>
              <el-col :span="4">
                <div class="label">参数配置</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.preferences || '--'}} </div>
              </el-col>
               <el-col :span="4">
                <div class="label">软件版本号</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.versionNum || '--'}}</div>
              </el-col>
            </el-row> 
              <el-row>
              <el-col :span="4">
                <div class="label">所属网点</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{formatSiteName(dialogForm.chargGroupId)}}</div>
              </el-col>
              <el-col :span="4">
                <div class="label">所属充电设备编号</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.chargAsstsNum || '--'}} </div>
              </el-col>
               <el-col :span="4">
                <div class="label">所属充电设备枪号</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.gunNum || '--'}}</div>
              </el-col>
            </el-row> 
             <el-row>
              <el-col :span="4">
                <div class="label">出厂编号</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.robotOutFactoryId || '--'}}</div>
              </el-col>
             
            </el-row> 
        </div>
    </div>
 </el-dialog>
</div>
</template>

<script>
import { treeToList } from '@/utils/utils'
export default {
    props: { 
        info: { 
            type: Object,
            default: () => {
                return {}
            }
        },
        manufacturList: { 
            type: Array,
            default: () => {
                return []
            }
        },
        deptOptions: { 
            type: Array,
            default: () => {
                return []
            }
        },
       chargGroupList: { 
            type: Array,
            default: () => {
                return []
            }
       }
    },
    data() {
        return {
            dialogForm: {},
            showItem: true
        }
    },
    created() {
        this.dialogForm = this.info    
    },
    methods: {
    closeDialog() {
        this.$emit('closeItem')
    },
     formatDeptName(val) {
        const arr = treeToList(this.deptOptions).filter(item => item.id === val)
        if(arr.length > 0) {
            return arr[0].label
        }else {
            return '--'
         }
        },
        formatManuName(val) {
        const arr = this.manufacturList.filter(item => item.facturerId === val)
        if(arr.length > 0) {
            return arr[0].facturerName
        }else {
            return '--'
         }
        },
        formatSiteName(val) {
        const arr = this.chargGroupList.filter(item => item.chargGroupId === val)
        if(arr.length > 0) {
            return arr[0].chargGroupName
        }else {
            return '--'
         }
        },
    }
}
</script>

<style>

</style>
