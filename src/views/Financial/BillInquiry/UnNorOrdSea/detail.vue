<template>
  <el-dialog
    v-dialogDrag
    title="异常订单记录修复"
    :visible.sync="showUpdate"
    width="1200px"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :before-close="closeDialog">
      <el-form
        ref="info"
        :model="info"
        :rules="rules"
        size="medium"
        label-width="170px"
    >
       <el-row>
           <el-col :span="8">
             <el-form-item label="组织机构:" prop="groupName">
              <el-input v-model="info.groupName" disabled/>
            </el-form-item>
           </el-col>
            <el-col :span="8">
             <el-form-item label="订单号:" prop="orderNo">
              <el-input v-model="info.orderNo" disabled/>
            </el-form-item>
           </el-col>
            <el-col :span="8">
             <el-form-item label="充电设备名称:" prop="deviceName">
              <el-input v-model="info.deviceName" disabled/>
            </el-form-item>
           </el-col>
       </el-row>
        <el-row>
           <el-col :span="8">
             <el-form-item label="充电类型:" prop="deviceType">
               <el-select v-model="info.deviceType" disabled>
                     <el-option
                        v-for="item in deviceTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="Number(item.value)">
                        </el-option>
                    </el-select>
            </el-form-item>
           </el-col>
            <el-col :span="8">
             <el-form-item label="充电设备编号:" prop="deviceNo">
              <el-input v-model="info.deviceNo" disabled/>
            </el-form-item>
           </el-col>
            <el-col :span="8">
             <el-form-item label="网点编号:" prop="stationNo">
              <el-input v-model="info.stationNo" disabled/>
            </el-form-item>
           </el-col>
       </el-row>
         <el-row>
           <el-col :span="8">
             <el-form-item label="卡号:" prop="cardCode">
               <el-input v-model="info.cardCode" disabled/>
            </el-form-item>
           </el-col>
            <el-col :span="8">
             <el-form-item label="姓名:" prop="staffName">
              <el-input v-model="info.staffName" disabled/>
            </el-form-item>
           </el-col>
            <el-col :span="8">
             <el-form-item label="上报车牌号:" prop="carNo">
              <el-input v-model="info.carNo" disabled/>
            </el-form-item>
           </el-col>
       </el-row>
        <el-row>
           <el-col :span="8">
             <el-form-item label="消费方式:" prop="consumeType">
                <el-select v-model="info.consumeType" disabled>
                     <el-option
                        v-for="item in consumeTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
            </el-form-item>
           </el-col>
            <el-col :span="8">
             <el-form-item label="是否正常结束:" prop="isNormalOver">
               <el-select v-model="info.isNormalOver" disabled>
                     <el-option label="是" :value="1"></el-option>
                     <el-option label="否" :value="2"></el-option>
                    </el-select>
            </el-form-item>
           </el-col>
            <el-col :span="8">
             <el-form-item label="充满电策略:" prop="chargeModel">
               <el-select v-model="info.chargeModel" disabled>
                     <el-option
                        v-for="item in chargeModelList"
                        :key="item.value"
                        :label="item.label"
                        :value="Number(item.value)">
                        </el-option>
                    </el-select>
            </el-form-item>
           </el-col>
       </el-row>
        <el-row>
           <el-col :span="8">
             <el-form-item label="充满电策略参数:" prop="chargeModelParams">
                 <el-select v-model="info.chargeModelParams" disabled>
                     <el-option
                        v-for="item in chargeModelParamsList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
            </el-form-item>
           </el-col>
            <el-col :span="8">
             <el-form-item label="本次累计充电能(kWh):" prop="useEleValue">
               <el-input-number :controls="false" :min="0" :precision="3" v-model="info.useEleValue"/>
            </el-form-item>
           </el-col>
            <el-col :span="8">
             <el-form-item label="本次累计充电量(Ah):" prop="chargeEle">
               <el-input-number :controls="false" :min="0" :precision="3" v-model="info.chargeEle"/>
            </el-form-item>
           </el-col>
       </el-row>
        <el-row>
             <el-col :span="8">
             <el-form-item label="交易时间:" prop="dealTime">
                    <el-date-picker
                        disabled
                        v-model="info.dealTime"
                        format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择交易时间">
                    </el-date-picker>
            </el-form-item>
           </el-col>
           <el-col :span="8">
             <el-form-item label="充电开始时间:" prop="startTime">
                   <el-date-picker
                        v-model="info.startTime"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择充电开始时间">
                    </el-date-picker>
            </el-form-item>
           </el-col>
            <el-col :span="8">
             <el-form-item label="充电结束时间:" prop="endTime">
                <el-date-picker
                        v-model="info.endTime"
                        format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择充电结束时间">
                    </el-date-picker>
            </el-form-item>
           </el-col>
       </el-row>
        <el-row>
             <el-col :span="8">
             <el-form-item label="充电时长(秒):" prop="chargeTime">
                   <el-input-number :controls="false" :min="0" v-model="info.chargeTime"/>
            </el-form-item>
           </el-col>
           <el-col :span="8">
             <el-form-item label="开始电表度数:" prop="startEleValue">
                  <el-input-number :controls="false" :min="0" :precision="3" v-model="info.startEleValue"/>
            </el-form-item>
           </el-col>
            <el-col :span="8">
            <el-form-item label="结束电表度数:" prop="endEleValue">
               <el-input-number :controls="false" :min="0" :precision="3" v-model="info.endEleValue"/>
            </el-form-item>
           </el-col>
       </el-row>
       <el-row>
        <el-col :span="8">
             <el-form-item label="开始充电SOC:" prop="startSoc">
                <el-input-number :controls="false" :min="0" :max="100" v-model="info.startSoc"/>
            </el-form-item>
           </el-col>
           <el-col :span="8">
             <el-form-item label="结束充电SOC:" prop="endSoc">
                <el-input-number :controls="false" :min="0" v-model="info.endSoc"/>
            </el-form-item>
           </el-col>
       </el-row>
       <el-row>
        <el-col :span="24">
             <el-form-item label="错误信息:" prop="errorType">
                <el-input
                id="errorInfoInput"
                type="textarea"
                :rows="3"
                v-model="info.errorType">
                </el-input>
            </el-form-item>
           </el-col>
       </el-row>
      </el-form>

    <span slot="footer">
        <el-button type="primary" style="margin-right: 10px" :loading="showLoading" @click="saveOrder">保存</el-button>
        <el-button  @click="closeDialog">取消</el-button>
    </span>
    </el-dialog>
</template>

<script>
import { editErrorOrder } from '@/api/financial/order'
import moment from 'moment'
export default {
    props: {
        orderInfo: {
            type: Object,
            default: function() {
                return null
            }
        }
    },
    data() {
        return {
            showUpdate: true,
            info: null,
            consumeTypeList: [
                {label: 'APP', value: 1},
                {label: '刷卡', value: 2},
                {label: 'VIN', value: 3},
            ],
            deviceTypeList: [
                {label: '交流', value: 1},
                {label: '直流', value: 2},
            ],
              chargeModelList: [
                {label: '自定义时间充电', value: 1},
                {label: '自定义电度数充电', value: 2},
                {label: '自定义金额', value: 3},
                {label: '自然充电', value: 4},
            ],
            chargeModelParamsList: [
                {label: '自定义时间(分钟)', value: 1},
                {label: '自定义度数(KwH)', value: 2},
                {label: '自定义金额(元)', value: 3},
                {label: '自然充电', value: 4},
            ],
            showLoading: false,
            rules: {
               useEleValue: [{ required: true, message: "请输入本次累计充电能", trigger: "blur" },], 
               startTime: [{ required: true, message: "请输入充电开始时间", trigger: "blur" },], 
               endTime: [{ required: true, message: "请输入充电结束时间", trigger: "blur" },], 
               chargeTime: [{ required: true, message: "请输入充电时长(秒)", trigger: "blur" },], 
               startEleValue: [{ required: true, message: "请输入开始电表度数", trigger: "blur" },], 
               endEleValue: [{ required: true, message: "请输入结束电表度数", trigger: "blur" },], 
               startSoc: [{ required: true, message: "请输入开始充电SOC", trigger: "blur" },], 
               endSoc: [{ required: true, message: "请输入结束充电SOC", trigger: "blur" },], 
            }
        }
    },
    created() {
      this.info = this.orderInfo
    },  
    methods: {
        closeDialog() {
            this.info = null
            this.$emit('closeDialog', 1)
        },
        async saveOrder() {
            this
            this.$refs.info.validate(async (valid) => {
            if (valid) { 
                this.info.startTime = this.info.startTime ? moment(this.info.startTime).format('YYYY-MM-DD HH:mm:ss') : null   
                this.info.endTime = this.info.endTime ? moment(this.info.endTime).format('YYYY-MM-DD HH:mm:ss') : null  
                this.info.dealTime = this.info.dealTime ? moment(this.info.dealTime).format('YYYY-MM-DD HH:mm:ss') : null   
                this.showLoading = true
                console.log(new Date(this.info.startTime).getTime())
                if(this.info.startSoc > this.info.endSoc) {
                    this.$message({
                        type: 'error',
                        message: '开始充电SOC不能大于结束充电SOC'
                    })
                    this.showLoading = false
                    return
                }
                if(this.info.startEleValue > this.info.endEleValue) {
                    this.$message({
                        type: 'error',
                        message: '开始电表度数不能大于结束电表度数'
                    })
                    this.showLoading = false
                    return
                }
                if(new Date(this.info.startTime).getTime() > new Date(this.info.endTime).getTime()) {
                    this.$message({
                        type: 'error',
                        message: '充电开始时间不能大于充电结束时间'
                    })
                    this.showLoading = false
                    return
                }
                const rsp = await editErrorOrder(this.info) 
                if(rsp.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '订单修复成功'
                    })
                    this.$emit('closeDialog', 2) 
                }
                this.showLoading = false
            }
          })
        }
    }
}
</script>
<style lang="scss">
.el-input-number.is-without-controls .el-input__inner {
    text-align: left;   
}
</style>
<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.detailBox {
    margin-left: -60px;
    .line {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .item {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            .label {
                text-align: right;
                width: 160px;
                margin-right: 10px;
            }
            
        }
         .litem {
            display: flex;
            // align-items: center;
            justify-content: center;
            .llabel {
                text-align: right;
                width: 180px;
                margin-right: 10px;
            }
            .lvalue {
               flex: 1;
               display: flex;
               ::v-deep  #errorInfoInput {
                   width: 1020px;
               }
            }
            
        }
    }
}
</style>