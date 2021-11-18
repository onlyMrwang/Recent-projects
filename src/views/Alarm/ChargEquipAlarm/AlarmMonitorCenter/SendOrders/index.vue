<template>
    <!--派单界面-->
        <el-form
                ref="dialogform"
                :model="dialogForm"
                :rules="rules"
                size="medium"
                label-width="110px"
        >
            <el-row>
                <!-- <el-col :span="12">
                    <el-form-item label="工单编号 : " prop="jobCode">
                        <el-input v-model="dialogForm.jobCode" disabled />
                    </el-form-item>
                </el-col> -->
                <el-col :span="12">
                    <el-form-item label="网点名称 : " disabled prop="chargGroupName">
                        <el-input v-model="dialogForm.chargGroupName" disabled/>
                    </el-form-item>
                </el-col>
          
                <el-col :span="12">
                    <el-form-item label="工单来源 : " prop="jobFrom">
                         <el-select v-model="dialogForm.jobFrom" disabled>
                            <el-option
                            v-for="item in orderOriginList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="设备名称 : " disabled prop="chargName">
                        <el-input v-model="dialogForm.chargName" disabled/>
                    </el-form-item>
                </el-col>
          
                <el-col :span="12">
                    <el-form-item label="设备类型 : " prop="deviceType">
                         <el-select v-model="dialogForm.chargEquipType" disabled>
                            <el-option
                            v-for="item in dictInfo.chargEquipType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
              
           </el-row>
                <!-- <el-col :span="12">
                    <el-form-item label="报修时间 : " prop="createTime">
                        <el-input v-model="dialogForm.createTime" disabled />
                    </el-form-item>
                </el-col> -->
                <el-row>  <el-col :span="12">
                    <el-form-item label="设备编码 : " disabled prop="assetsNum">
                        <el-input v-model="dialogForm.assetsNum" disabled/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="报修人 : " disabled prop="inspector">
                        <el-input v-model="dialogForm.inspector" disabled/>
                    </el-form-item>
                </el-col>
          </el-row>  
          <el-row>
          <el-col :span="12">
                <el-form-item label="报修电话 : " prop="inspectorPhone">
                        <el-input-number :min="0" :controls="false" v-model.trim="dialogForm.inspectorPhone" />
                    </el-form-item>
                </el-col>
        </el-row>
          <el-row>
                <el-col :span="24">
                    <el-form-item label="故障描述 : " prop="faultDesc">
                        <el-input v-model.trim="dialogForm.faultDesc" maxlength="255" type="textarea" />
                    </el-form-item>
                </el-col>
            </el-row>
              <el-row :gutter="24">
                <el-col :span="12">
                    <div class="orgList">
                    <el-form-item label="处理组 : " prop="handleOrgId">
                        <treeselect
                            :options="orgList"
                            v-model="dialogForm.handleOrgId"
                            :default-expand-level="1"
                            placeholder="请选择处理组"
                            />
                    </el-form-item>
                    </div>
                </el-col>
            </el-row>
          <div style="text-align: center">
                <el-button size="mini" type="primary" @click="submitFn('dialogform')">确 定</el-button>
                <el-button size="mini" @click="closeView">取 消</el-button>
          </div>
        </el-form>
</template>

<script>
import { getOrderPoleInfo, submitOrderPole } from '@/api/alarm/celve'
import { getAllOrgOfCompany } from '@/api/common'
import { mapGetters } from 'vuex'
import { treeToList } from '@/utils/utils'
    export default {
        data(){
              var Phone = (rule, value, callback) => {
                var str = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
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
            return {
                listType: "1",
                dialogForm: {},
                orgList: [], // 企业下所有组织机构
                orderOriginList: [
                    {label: '自建', value: 0},
                    {label: '客服派单', value: 1},
                    {label: '转派', value: 2},
                    {label: '告警', value: 3},
                    {label: '预警', value: 4},
                ],
                rules:{
                    handleOrgId: [ { required: true, message: "请选择处理组", trigger: "change" } ],
                    faultDesc: [ { required: true, message: "请输入故障描述", trigger: "blur" } ],
                    inspectorPhone:[
                        {required: true, message: "请输入报修电话", trigger: "blur"},
                      { validator: Phone, trigger: "blur", message: "报修电话格式不正确"}],
                },
            }
        },
        props:{
            siteList:{
                type:Array,
                required:true
            },
            rowInfo: {
                type: Object,
                default: function() {
                    return null
                }
            }
        },
        computed: {
            ...mapGetters(['dictInfo'])
        },
        created() {
            this.fetchOrderInfo()
            this.fetchOrgList()
        },
        methods:{
            async fetchOrderInfo() {
                const rsp = await getOrderPoleInfo(this.rowInfo)
                if(rsp.code === 200) {
                    this.dialogForm = rsp.data
                    console.log(this.dialogForm)
                }
            },
            async fetchOrgList() {
                const rsp = await getAllOrgOfCompany()
                if(rsp.code === 200) {
                    this.orgList = rsp.data
                }
            },
            //派单提交方法
            submitFn(formName){
              this.$refs[formName].validate(async (valid) => {
               if (valid) {
                const list = treeToList(this.orgList)
                const arr = list.filter(item => item.id === this.dialogForm.handleOrgId)
                if(arr.length > 0) {
                    this.dialogForm.handleOrgName = arr[0].label
                }
                const rsp = await submitOrderPole(this.dialogForm)
                if(rsp.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '派单成功'
                    })
                     this.$emit('freshList')
                     this.$emit('closeView')
                }
               }
              })
            },
            closeView(){
                this.$emit('closeView')
            },
        },
    }
</script>