<template>
    <div class="addFault">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
            <div class="formContent">
                <div class="formList">
                    <el-form-item label="过滤策略名称 :" prop="ruleName">
                        <el-input v-model.trim="ruleForm.ruleName" placeholder="请输入过滤策略名称"></el-input>
                    </el-form-item>
                </div> 
                <div class="formList">
                    <el-form-item label="告警等级 :" prop="alarmSeverity">
                        <el-select v-model="ruleForm.alarmSeverity" clearable @change="severityClick" placeholder="请选择告警级别">
                            <el-option
                                v-for="item in levelList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </div>
            <div class="formContent">
                <div class="formList">
                    <el-form-item label="告警名称 :" prop="alarmCode">
                        <el-select v-model="ruleForm.alarmCode" filterable clearable  placeholder="请选择告警名称">
                            <el-option
                                    v-for="item in alarmTitleSelect"
                                    :key="item.alarmCode"
                                    :label="item.alarmTitle"
                                    :value="item.alarmCode"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div> 
                <div class="formList">
                    <el-form-item label="设备类型 :" prop="deviceType">
                        <el-select v-model="ruleForm.deviceType" clearable placeholder="请选择设备类型">
                            <el-option
                                    v-for="item in dictInfo.chargEquipType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </div>
            <div class="formContent">
                <div class="formList">
                    <el-form-item label="设备型号 :" prop="deviceModel">
                        <el-input v-model.trim="ruleForm.deviceModel" placeholder="请输入设备型号"></el-input>
                    </el-form-item>
                </div> 
                <div class="formList">
                    <el-form-item label="网点 :" prop="stations">
                        <el-select v-model="ruleForm.deviceStie" @change="changeSite" clearable placeholder="请选择网点">
                            <el-option
                                    v-for="item in siteList"
                                    :key="item.chargGroupId"
                                    :label="item.chargGroupName"
                                    :value="item.chargGroupId"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </div>
            <div class="formContent">
                <div class="formList">
                    <el-form-item label="充电设备名称 :" prop="deviceNames">
                        <el-select v-model="ruleForm.deviceNos" clearable
                         :placeholder="ruleForm.deviceStie ? '请选择充电设备名称' : '请先选择网点'">
                            <el-option
                                    v-for="item in chargList"
                                    :key="item.chargId"
                                    :label="item.chargName"
                                    :value="item.chargId"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div> 
                <div class="formList">
                    <el-form-item label="设备厂商 :" prop="vender">
                        <el-select v-model="ruleForm.vender" clearable placeholder="请选择设备厂商">
                            <el-option
                                v-for="item in vendersSelect"
                                :key="item.facturerId"
                                :label="item.facturerName"
                                :value="item.facturerId"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </div>
         
             <div class="formContent">
             <div class="item">
                <div class="label">触发时机:</div>
                <div class="value">
                每&nbsp; 
                <div class="numInput">
                    <el-input-number :precision="0" :min="1" :controls="false" v-model="ruleForm.period"/>
                </div> 
                <div class="numInput1" style="margin-left: 5px">
                    <el-select v-model="ruleForm.timeUnit"  placeholder="单位">
                        <el-option label="小时" value="小时"></el-option>
                        <el-option label="分钟" value="分钟"></el-option>
                        <el-option label="秒" value="秒"></el-option>
                    </el-select>
                </div>
                <span style="margin: 0 5px">达到告警次数>=</span>
                <div class="numInput">
                    <el-input-number :min="1" :controls="false" :precision="0"  v-model="ruleForm.count"/>
                </div>
                <span style="margin-left: 5px">次，将执行告警过滤</span>
              </div>
            </div>
      </div>
            <div class="foots">
                <el-button type="primary" :loading="showLoading" @click="submitSetting('ruleForm')">确定</el-button>
                <el-button  @click="closeSetting">取消</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import{ mapGetters  } from 'vuex'
    import { listChargGroupCode } from "@/api/alarm/alarmmonitorcenter.js";
    import { upDateLists, addList, getAlarmTitle } from "@/api/alarm/celve.js";
    import { getChargManu,  getChargeBySite } from "@/api/alarm/faultalarmBase.js";
    export default {
         props:{
            levelLists:{//定义接收报警级别数组
                type:Array,//数据类型
                required:true//是否必传
            },
            ruleForms:{//接收父组件传来的修改值
                type:Object,
                required:false,
            },
            subTypes:{
                type:Number,
                required:true,
            },
            treeType:{
                type:Number,
                required:true
            },
        },  
        data(){
            return {
                alarmTitleSelect:[],//告警名称数组
                treeArray:[],//存树被选中的值
                siteList:[],//网点
                treeTypes:1,//控制是否显示树
                vendersSelect:[],//厂商数组
                chargList:[],//充电设备数组
                DataInfoSelect:[],//设备类型数组
                ruleForm:{
                    alarmCode: null,
                    alarmSeverity: null,
                    count: undefined,
                    deviceModel: null,
                    deviceNos: null,
                    deviceStie: null,
                    deviceType: null,
                    period: undefined,
                    ruleName: null,
                    timeUnit: null,
                    type: 1,
                    vender: null
                },
                AlarmTypeSelect:[],//告警类型下拉数组
                rules:{//form表单验证逻辑
                    ruleName:[{ required: true, message: '请输入告警过滤策略名称', trigger: 'blur' }],
                    alarmSeverity:[{ required: true, message: '请选择告警等级', trigger: 'change' }],
                    alarmCode:[{ required: true, message: '请选择告警名称', trigger: 'change' }],
                    period:[{ required: true, message: '请输入计数周期', trigger: 'blur' }],
                    count:[{ required: true, message: '请输入告警计数', trigger: 'blur' }],
                },
                levelList:[],
                subType:1,
                showLoading: false
            }
        },
        computed: {
            ...mapGetters(['dictInfo'])
        },
        created(){ 
            this.levelList = this.levelLists
            this.subType = this.subTypes
            this.getName()//网点
            this.getChargManu()//获取设备厂商下拉
            if(this.ruleForms.deviceStie) {
                this.fetchChargeList(this.ruleForms.deviceStie)
            }
            if(this.subType != 1) {
                this.ruleForm = this.ruleForms  
            }
            // this.getChargingInfos()//获取充电设备
            //  if (!this.ruleForm.timeUnit) {
            //     this.ruleForm.timeUnit = "小时";
            // }
            if(this.subType != 1 && this.ruleForm.alarmSeverity) {
                this.getAlarmTitle(this.ruleForm.alarmSeverity)//获取告警名称
            }
        },
        methods: {
            severityClick(val){
                this.alarmTitleSelect = []
                if(val) {
                 this.getAlarmTitle(val);   
                }
            },

            //获取告警名称
            async getAlarmTitle(val){
                const res = await getAlarmTitle({alarmSeverity:val, type: 1});
                if(res.code==200){
                    this.alarmTitleSelect = res.data;
                }
            },

            // 切换网点
          changeSite(val) {
            this.chargeList = []
            this.ruleForm.deviceNos = null
            if(val) {
                this.fetchChargeList(val)
            }
          },

             // 获取充电设备
            async fetchChargeList(val) {
                const rsp =  await getChargeBySite({id: val})
                if(rsp.code === 200) {
                this.chargList = rsp.data
                }
            },

            //获取设备厂商
            async getChargManu(){
                const res = await getChargManu();
                if(res.code==200){
                    this.vendersSelect=res.data;
                }
            },

            changeTimeUtil(val) {
                this.ruleForm.timeUnit = val
            },

            closeSetting() {
                this.$emit('clearDialog', 2)
            },
            // 修改告警知识库方法
            submitSetting(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                           if(!this.ruleForm.period) {
                        this.$message({
                                type: 'warning',
                                message: '请输入告警周期'
                            })
                            return  
                        }
                        if(!this.ruleForm.count) {
                        this.$message({
                                type: 'warning',
                                message: '请输入告警次数'
                            })
                            return  
                        }
                         if(!this.ruleForm.timeUnit) {
                            this.$message({
                                    type: 'warning',
                                    message: '请选择时间单位'
                                })
                                return  
                            }
                        this.ruleForm.stopTag = this.ruleForm.stopTag?1:0;
                        this.ruleForm.operationService = this.ruleForm.operationService?1:0;
                        if(this.subType==1){
                            //调用列表新增方法
                            this.addList();

                        }else{
                            //调用列表修改方法
                            this.upDateList();
                        }
                    } else {
                      
                        return false;
                    }
                });
            },

            //新增告警知识库
            async addList(){
                this.showLoading = true
                this.ruleForm.type = 1
                const res = await addList(this.ruleForm);
                if(res.code==200){
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.$emit('clearDialog', 1);
                }
                this.showLoading = false
            },

            //修改知识库
            async upDateList(){
                 this.showLoading = true
                 this.ruleForm.type = 1
                const res = await upDateLists(this.ruleForm);
                if(res.code==200){
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                   this.$emit('clearDialog', 1)
                }
                this.showLoading = false
            },
            //获取网点下拉数据
            async getName(){
                const res = await listChargGroupCode()
                if(res.code === 200) {
                  this.siteList = res.data  
                }
            }
        }
    }
</script>
<style lang="scss">
.numInput {
    .el-input__inner{
        width: 65px !important;
    }
}
.numInput1 {
    .el-input__inner{
        width: 80px !important;
    }
}
    .addFault {
        .formContent{
            .el-form-item{
                margin-bottom: 0;
            }
        }
        .dataInput{
            display: inline-block;
            width: 70px;
            /*margin-right: 5px;*/
        }
        .dataInput .el-input__inner{
            width: 70px !important;
        }
        .el-radio{
            margin-right: 3px !important;
            /*margin-left: 10px;*/
        }
        .el-form-item{
            margin-bottom: 10px;
        }
    }
</style>


<style scoped lang="scss">
@import "@/assets/styles/global.scss";
    .formContent{
        display: flex;
        margin-bottom: 20px;
        .item {
            display: flex;
            align-items: center;
            margin-bottom: 16px; 
            margin-left:  75px;
            font-size: 14px;
            .label {
                margin-right: 10px;
                color: #484848;
                &::before {
                  content: '*';
                  color: #f56c6c;
                  margin-right: 4px;
                }
            }
            .value {
               display: flex;
               align-items: center;
               .checkBox {
                   margin-left: 10px;
                   display: flex;
                   align-items: center;
                   .checkBoxIcon {
                       margin-right: 4px;
                       img {
                          width: 24px;
                          height: 24px; 
                       }
                   }
               }
            }
        }
    }
    .formList{
        flex: 1;
        max-width: 49%;
    }
    .foots{
        text-align: center;
    }
</style>