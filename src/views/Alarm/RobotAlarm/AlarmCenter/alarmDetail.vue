<template>
    <div class="addFault">
     <el-form :model="dataInfo" size="medium" ref="dataInfo" label-width="130px" class="demo-dataInfo">
            <el-row :gutter="10">
                   <el-col :span="12">
                     <el-form-item label="告警编码 :" prop="alarmCode">
                        <el-input  maxlength="32" v-model.trim="dataInfo.alarmCode" placeholder="请输入告警编码"></el-input>
                      </el-form-item>
                   </el-col>
                   <el-col :span="12">
                      <el-form-item label="告警类型 :" prop="alarmType">
                        <el-select
                          v-model="dataInfo.alarmType"
                        >
                          <el-option
                            v-for="item in dictInfo.robotAlarmType"
                            :key="item.value"
                            :label="item.label"
                            :value="Number(item.value)"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col> 
                <el-col :span="12">
                   <el-form-item label="告警等级 :" prop="alarmSeverity">
                      <el-select
                        v-model="dataInfo.alarmSeverity"
                      >
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
                <el-col :span="12">
                    <el-form-item label="告警名称 :" prop="alarmTitle">
                    <el-input maxlength="32" v-model.trim="dataInfo.alarmTitle" placeholder="请输入告警名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="充电机器人厂商 :" prop="vender">
                    <el-select
                      v-model="dataInfo.vender"
                    >
                      <el-option
                        v-for="item in robotFacturerList"
                        :key="item.facturerId"
                        :label="item.facturerName"
                        :value="item.facturerName"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                 <el-col :span="12">
                   <el-form-item label="软件版本号 :" prop="protocolVersion">
                      <el-select
                        v-model="dataInfo.protocolVersion"
                      >
                        <el-option
                          v-for="item in robotSoftList"
                          :key="item.versionNum"
                          :label="item.versionNum"
                          :value="item.versionNum"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                   <el-form-item label="充电机器人型号 :" prop="deviceVersion">
                    <el-select
                      v-model="dataInfo.deviceVersion"
                    >
                      <el-option
                        v-for="item in robotModelList"
                        :key="item.robotMark"
                        :label="item.robotMark"
                        :value="item.robotMark"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                 <el-col :span="12">
                    <el-form-item label="相关故障代码 :" prop="msgCode">
                      <el-input maxlength="32" v-model.trim="dataInfo.msgCode" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="告警描述 :" prop="alarmDesc">
                <el-input maxlength="225" v-model.trim="dataInfo.alarmDesc" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="处理措施 :" prop="treatNeasures">
                <el-input maxlength="225" v-model.trim="dataInfo.treatNeasures" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="处理方案 :" prop="treatProgram">
                <el-input maxlength="225" v-model.trim="dataInfo.treatProgram" type="textarea"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { getAlarmDetail } from '@/api/alarm/faultalarmBase'
import { getFacturer } from '@/api/asset/manufacturer'
import { getRobotTypeList, getRobotSoftList } from '@/api/alarm/robot/alarm'
import { mapGetters } from 'vuex'
export default {
    props: {
        alarmTitle: { 
            type: String,
            default: null
        }
      },
        data(){
            return {
                levelList: [
                    {label: '1级', value: 1},
                    {label: '2级', value: 2},
                ],
                dataInfo: {},
                robotModelList: [], // 机器人型号
                robotSoftList: [], // 机器人版本号
                robotFacturerList: [] // 机器人厂商
            }
        },
        computed: {
            ...mapGetters(['dictInfo'])
        },
        created() {
           if(this.alarmTitle) {
               this.fetchAlarmDetail({alarmTitle: this.alarmTitle, type: 3})
           }
            this.fetchRobotType()
            this.fetchRobotSoft()
            this.fetchRobotFacturer()
        },
        methods: {
            async fetchRobotType() {
            const rsp = await getRobotTypeList()
            if(rsp.code === 200) {
                this.robotModelList = rsp.data.result
            }
            },
            async fetchRobotSoft() {
            const rsp = await getRobotSoftList()
            if(rsp.code === 200) {
                this.robotSoftList = rsp.data.result
            }
            },
            async fetchRobotFacturer() {
            const rsp = await getFacturer({facturerType: 3})
            if(rsp.code === 200) {
                this.robotFacturerList = rsp.data.result
            }
            },
            async fetchAlarmDetail(data) {
                const rsp =  await getAlarmDetail(data)
                if(rsp.code === 200) {
                    this.dataInfo = rsp.data
                    this.dataInfo.stopTag = this.dataInfo.stopTag==1?true:false;
                    this.dataInfo.operationService = this.dataInfo.operationService==1?true:false;
                }
            },
            closeSetting() {
                this.$emit('closeDialog')
            },
        }
    }
</script>
<style lang="scss">
    /*弹出框form样式样式重构修改*/
    /*//修改form表格列表下边距位置*/
    /*修改滑块lebel宽度以及又边距*/
    .addFault {
        .formContent{
            .el-form-item{
                margin-bottom: 0;
            }
        }
        .el-form-item{
            margin-bottom: 10px;
        }
        .switchs{
            .el-form-item__label{
                width: 160px !important;
                margin-right: 10px;
            }
        }
        .switchContent{
            .el-form-item__label{
                margin-right: 20px;
            }
        }
    }
</style>

<style scoped lang="scss">
@import "@/assets/styles/global.scss";
    .formContent{
        display: flex;
        margin-bottom: 10px;
    }
    .formList{
        flex: 1;
        max-width: 49%;
    }
    .foots{
        text-align: center;
    }
</style>