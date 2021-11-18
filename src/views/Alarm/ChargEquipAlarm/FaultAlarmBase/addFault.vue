<template>
    <div class="addFault">
        <el-form :model="dataInfo" :rules="rules" size="small" ref="dataInfo" label-width="120px" class="demo-dataInfo">
            <el-row :gutter="10">
                   <el-col :span="12">
                    <el-form-item label="告警名称 :" prop="alarmTitle">
                        <el-input v-model.trim="dataInfo.alarmTitle"  maxlength="32" :disabled="subType === 2" />
                    </el-form-item>
                   </el-col>
                   <el-col :span="12">
                         <el-form-item label="告警等级 :" prop="alarmSeverity">
                        <el-select v-model="dataInfo.alarmSeverity" clearable placeholder="请选择告警级别">
                            <el-option
                                    v-for="item in levelList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    </el-col> 
            </el-row>
            <el-row  :gutter="10">
                <el-col :span="12">
                   <el-form-item label="告警类型 :" prop="alarmType">
                        <el-select v-model="dataInfo.alarmType" clearable placeholder="请选择告警类型">
                         <el-option
                            v-for="item in dictInfo.alarmType"
                            :key="item.value"
                            :label="item.label"
                            :value="Number(item.value)"
                            >
                            </el-option>
                        </el-select>
                 </el-form-item>    
                </el-col>
                <el-col :span="12">
                    <el-form-item label="告警实体 :" prop="alarmDto">
                        <el-input v-model.trim="dataInfo.alarmDto"  maxlength="32" placeholder="请输入告警实体"/>
                    </el-form-item>
                </el-col>
                <el-col :span="13">
                   <el-form-item label="是否与运营服务相关 :" label-width="200" prop="operationService">
                        <el-switch v-model="dataInfo.operationService" active-text="是"
                                   inactive-text="否"></el-switch>
                    </el-form-item>
                </el-col>
                 <el-col :span="11">
                     <el-form-item label="是否停机 :" label-width="200" prop="stopTag">
                        <el-switch v-model="dataInfo.stopTag" active-text="是"
                                   inactive-text="否"></el-switch>
                    </el-form-item>
                </el-col>
            </el-row>
        
             <el-form-item label="相关故障代码 :" prop="msgCode">
                <el-select v-model="dataInfo.msgCode" clearable placeholder="请选择相关故障代码">
                    <el-option
                            v-for="item in dictInfo.msgCode"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="告警描述 :" prop="alarmDesc">
                <el-input v-model.trim="dataInfo.alarmDesc"  maxlength="255" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="告警影响 :" prop="affect">
                <el-input v-model.trim="dataInfo.affect"  maxlength="255" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="处理措施 :" prop="treatNeasures">
                <el-input v-model.trim="dataInfo.treatNeasures"  maxlength="255" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="处置方案 :" prop="treatProgram">
                <el-input v-model.trim="dataInfo.treatProgram"  maxlength="255" type="textarea"></el-input>
            </el-form-item>
            <el-form-item >
                <div class="foots">
                    <el-button type="primary" @click="submitSetting('dataInfo')"  :loading="btnLoading">确定</el-button>
                    <el-button @click="closeSetting">取消</el-button>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { addList, upDateList  } from "@/api/alarm/faultalarmBase";
import { mapGetters } from 'vuex'
export default {
    props:{
        levelList:{ 
            type: Array,
            default: function() {
                return []
            }
        },
        faultInfo:{ 
            type: Object,
            default: function() {
                return null
            }
        },
        subType: {
            type:Number,
            default: 1
        },
      },
        data(){
            return {
                rules:{//form表单验证逻辑
                    alarmTitle:[{ required: true, message: '请输入告警名称', trigger: 'blur' }],//告警名称
                    alarmSeverity:[{ required: true, message: '请选择告警等级', trigger: 'change' }],//告警等级
                    alarmType:[{ required: true, message: '请选择告警类型', trigger: 'change' }],//告警类型
                    alarmDto:[{ required: true, message: '请输入告警实体', trigger: 'blur' }],//告警实体
                    alarmDesc:[{ required: true, message: '请输入告警描述', trigger: 'blur' }],//告警描述
                    // affect:[{ required: true, message: '请输入告警影响', trigger: 'blur' }],//告警影响
                    treatNeasures:[{ required: true, message: '请输入处理措施', trigger: 'blur' }],//处理措施
                    operationService:[{ required: true, message: '请选择是否与运营服务有关', trigger: 'blur' }],
                    stopTag:[{ required: true, message: '请选择是否停机', trigger: 'blur' }],
                    // treatProgram:[{ required: true, message: '请输入处理方案', trigger: 'blur' }],//处理方案
                },
                btnLoading:false, // 提交按钮提交得时候不得再重复点击
                dataInfo: null
            }
        },
        computed: {
            ...mapGetters(['dictInfo'])
        },
        created() {
            this.dataInfo = this.faultInfo
        },
        methods: {
            // 修改告警知识库方法
            submitSetting(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dataInfo.stopTag = this.dataInfo.stopTag?1:0;
                        this.dataInfo.operationService = this.dataInfo.operationService ? 1:0;
                        this.btnLoading=true;
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

            closeSetting() {
                this.$emit('clearDialog', 2)
            },

            //新增告警知识库
            async addList(){
                const res = await addList(this.dataInfo);
                if(res.code==200){
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.btnLoading = false;
                    this.$emit('clearDialog', 1);
                }
            },

            //修改知识库
            async upDateList(){
                const res = await upDateList(this.dataInfo);
                if(res.code==200){
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.btnLoading = false;
                    this.$emit('clearDialog', 1);
                }
            }
        },
    }
</script>

<style scoped lang="scss">
    .foots{
        text-align: center;
    }
</style>