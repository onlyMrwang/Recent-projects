<template>
<div class="detailDialog">
  <el-dialog
    v-dialogDrag
    :visible.sync="showDetailItem"
    @close="closeView"
    width="1200px"
    title="充电网点信息"
  >
    <div class="detailItemBox">
        <div class="right">
             <el-row>
              <el-col :span="4">
                <div class="label">充电网点编码</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.recSiteNum || '--'}}</div>
              </el-col>
              <el-col :span="4">
                <div class="label">充电网点名称</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.chargGroupName || '--'}} </div>
              </el-col>
               <el-col :span="4">
                <div class="label">归属组织机构</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{formatDeptName(dialogForm.orgId, 1)}}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div class="label">地市</div>
              </el-col>
              <el-col :span="4">
                <!-- <div class="value">{{formatAreaName(dialogForm.areaId, 1)}}</div> -->
                <div class="value">{{dialogForm.areaIdCn}}</div>
              </el-col>
              <el-col :span="4">
                <div class="label">片区</div>
              </el-col>
              <el-col :span="4">
                <!-- <div class="value">{{formatAreaName(dialogForm.area, 2)}} </div> -->
                <div class="value">{{dialogForm.areaCn}} </div>
              </el-col>
               <el-col :span="4">
                <div class="label">地址</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.address || '--'}}</div>
              </el-col>
            </el-row>
             <el-row>
              <el-col :span="4">
                <div class="label">经度</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.longitude || '--'}}</div>
              </el-col>
              <el-col :span="4">
                <div class="label">纬度</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.latitude || '--'}} </div>
              </el-col>
               <el-col :span="4">
                <div class="label">负责人</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.chargePerson || '--'}}</div>
              </el-col>
            </el-row>
             <el-row>
              <el-col :span="4">
                <div class="label">联系电话</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.phone || '--'}}</div>
              </el-col>
              <el-col :span="4">
                <div class="label">运维组织机构</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{formatDeptName(dialogForm.ywInstitution, 2)}} </div>
              </el-col>
               <el-col :span="4">
                <div class="label">站点类型</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{Number(dialogForm.chargGroupNature) >= 0 ? dictInfo.chargGroupNatureObj[dialogForm.chargGroupNature] : '--'}}</div>
              </el-col>
            </el-row>
             <el-row>
              <el-col :span="4">
                <div class="label">支付方式</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{formatpayMent(dialogForm.paymentMeth)}}</div>
              </el-col>
              <el-col :span="4">
                <div class="label">是否启用网点监控</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.ifUseMonitor == '1' ? '是' : '否'}} </div>
              </el-col>
               <el-col :span="4">
                <div class="label">运营启动日期</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.operateStartTime || '--'}}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div class="label">装机容量(kW)</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.disCapBranch || '--'}}</div>
              </el-col>
              <el-col :span="4">
                <div class="label">配电容量(kW)</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.disCapTotal || '--'}} </div>
              </el-col>
               <el-col :span="4">
                <div class="label">是否有人值守</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.ifOnDuty == '1' ? '是' : '否'}}</div>
              </el-col>
            </el-row>
             <el-row>
              <el-col :span="4">
                <div class="label">是否24小时营业</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.ifPeopDoBus == '1' ? '是' : '否'}}</div>
              </el-col>
              <el-col :span="4">
                <div class="label">开放类型</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{Number(dialogForm.openRange) >= 0 ? dictInfo.openRangeObj[dialogForm.openRange] : '--'}}</div>
              </el-col>
               <el-col :span="4">
                <div class="label">营业时间</div>
              </el-col>
              <el-col :span="4">
                <div class="value">{{dialogForm.doBusTime}} - {{dialogForm.doBusEndTime}}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                <div class="label labelRemark">备注</div>
              </el-col>
              <el-col :span="20">
                <div class="value valueRemark">{{dialogForm.remarks || '--'}}</div>
              </el-col>
            </el-row>
        </div>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { getAreaId } from "@/api/asset/charggroupinfo";
import { getAllOrgOfCompany } from '@/api/common'
import { mapGetters } from 'vuex'
import { treeToList } from '@/utils/utils'
    export default {
        data() {
            return {
                dialogForm: {},
                deptOptions: [],//组织机构树
                areaList: [],//片区
                showDetailItem: true, 
            }
        },
        props: {
            cityAreaList: {
                type: Array,
                required: true
            },
            dialogForms: {
                type: Object,
                required: true
            },
        },
        computed: {
            ...mapGetters(['dictInfo', 'deptList'])
        },
        created() {
            this.fetchOrgList()
            this.dialogForm = this.dialogForms;
            this.dialogForm.paymentMeth = this.dialogForm.paymentMeth ? this.dialogForm.paymentMeth.split(',') : []
            if(this.dialogForm.areaId) {
                this.fetchAreaList(this.dialogForm.areaId)
            }
        },
        methods: {
            async fetchOrgList() {
                const rsp = await getAllOrgOfCompany()
                if(rsp.code === 200) {
                    this.deptOptions = rsp.data
                }
            },
            closeView(){
                this.$emit('closeView', 2)
            },
            async fetchAreaList(val) {
              const res = await getAreaId({relationCode: val});
                if(res.code === 200) {
                   this.areaList = res.data.result;
                }
            },
            // 1 获取所属组织机构名称 2 获取运维机构名称
            formatDeptName(val, type = 1) {
                const arr = treeToList(type === 1 ? this.deptList : this.deptOptions).filter(item => item.id === val)
                if(arr.length > 0) {
                    return type === 1 ? arr[0].nameCN : arr[0].label
                }else {
                    return '--'
                }
             },
             // 1 获取地市名称， 2 获取片区名称
              formatAreaName(val, type = 1) {
                const arr = type === 1 ? this.cityAreaList : this.areaList.filter(item => item.areaCode === val)
                if(arr.length > 0) {
                    return arr[0].areaName
                }else {
                    return '--'
                }
             },
             formatpayMent(val) {
               if(val?.length > 0) {
                  let arr = []
                  val.forEach((item) => {
                      arr.push(this.dictInfo.paymentMethObj[item])
                  })
                  return arr.join(',')
               }else {
                 return '--'
               }
             }
        },
    }
</script>

