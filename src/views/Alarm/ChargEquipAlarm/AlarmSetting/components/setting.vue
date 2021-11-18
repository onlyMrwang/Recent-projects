<template>
  <div class="settingBox">
      <!-- 门限配置header -->
      <div class="stepHeader">
          <div class="icon">
              <img :src="DetailIcon"/>
          </div>
          <div class="title" @click="changeThreshold">门限配置</div>
          <div class="arrowIcon" @click="changeThreshold">
              <i :class="showThreshold ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"/>
          </div>
          <div class="line"></div>
      </div>
      <!-- 门限配置 -->
      <div class="threshold" v-show="showThreshold">
           <div class="item">
               <div class="label">门限名称:</div>
               <div class="value">
                   <el-input v-model.trim="thresholdInfo.ruleName" placeholder="请输入门限名称"/>
               </div>
            </div> 
            <div class="item">
                <div class="label">预警周期:</div>
                <div class="value">
                每&nbsp; 
                <div class="numInput">
                    <el-input-number :min="0" :controls="false" v-model="thresholdInfo.period"/>
                </div> 
                <div class="numInput1" style="margin-left: 5px">
                    <el-select v-model="thresholdInfo.timeUnit" >
                        <el-option label="小时" value="小时"></el-option>
                        <el-option label="分钟" value="分钟"></el-option>
                        <el-option label="秒" value="秒"></el-option>
                    </el-select>
                </div>
                <span style="margin: 0 5px">达到告警次数>=</span>
                <div class="numInput">
                    <el-input-number :min="1" :controls="false" :precision="0" v-model="thresholdInfo.count"/>
                </div>
                <span style="margin-left: 5px">次，触发告警</span>
              </div>
            </div>
            <div class="sitem">
                <div class="label">预警类型:</div>
                <div class="value">
                    <div :class="index === radioIndex ? 'checkRadioItem' : 'radioItem'"  v-for="(item, index) in dictInfo.preAlarmList" :key="item.value" @click="changeRadio(item, index)">
                        <div class="radioIcon">
                            <img :src="index === radioIndex ? CheckRadioIcon : RadioIcon"/>
                        </div>
                        <div class="name">{{item.label}}</div>
                          <div class="numInput" style="margin: 0 5px 0 5px">
                            <el-input-number v-if="index === radioIndex" :min="index === 1 ? -999999 : 0" :max="index === 0 ? 24 : index === 5 ? 100 : 999999"  :controls="false" v-model="thresholdInfo.threshold"/> 
                            <el-input-number v-else :min="0" disabled :controls="false" /> 
                        </div>
                        <span style="margin-left:5px">
                          {{unitList[index]}}  
                        </span>  
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="label">选择配置:</div>
                <div class="value">
                    <el-checkbox-group class="elcheckBox" v-model="thresholdInfo.disposalMethod">
                        <el-checkbox label="1">
                            <div class="checkBox">
                                <div class="checkBoxIcon">
                                    <img :src="TingjiIcon"/>
                                </div>
                                <div class="checkBoxLabel">停机</div>
                            </div>
                        </el-checkbox>
                        <el-checkbox label="0" disabled>
                             <div class="checkBox">
                                <div class="checkBoxIcon">
                                     <img :src="TongzhiIcon"/>
                                </div>
                                <div class="checkBoxLabel">通知</div>
                            </div>
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
      </div>
      <!-- 监控对象header -->
       <div class="stepHeader">
          <div class="icon">
              <img :src="LingxingIcon"/>
          </div>
          <div class="title" @click="changeMonitor">监控对象</div>
          <div class="arrowIcon" @click="changeMonitor">
              <i :class="showMonitor ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"/>
          </div>
          <div class="line"></div>
      </div>
      <!-- 监控对象 -->
      <div class="monitorObj" v-show="showMonitor">
          <Monitor ref="monitor" :type="type" :rowInfo="rowInfo"/>
      </div>

      <div class="footer">
          <el-button type="primary" :loading="showLoading" @click="submitSetting">确定</el-button>
          <el-button @click="closeBox">取消</el-button>
      </div>
  </div>
</template>

<script>
import TongzhiIcon from '@/assets/images/tongzhi.png'
import TingjiIcon from '@/assets/images/tingji.png'
import DetailIcon from '@/assets/images/detail.png'
import LingxingIcon from '@/assets/images/lingxing.png'
import RadioIcon from '@/assets/images/radio.png'
import CheckRadioIcon from '@/assets/images/checkRadio.png'
import Monitor from './monitorObj'
import { addPreAlarm, updatePreAlarm } from '@/api/alarm/preAlarm'
import { mapGetters } from 'vuex'
export default {
    components: { Monitor },
    props: {
        type: {
            type: Number,
            default: 1
        },
        rowInfo: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    data() {
        return {
            TongzhiIcon,
            TingjiIcon,
            DetailIcon,
            LingxingIcon,
            RadioIcon,
            CheckRadioIcon,
            step: 1,
            showThreshold: true,
            showMonitor: false,
            radioIndex: 0,
            thresholdInfo: {
                ruleName: '',
                period: undefined,
                count: undefined,
                timeUnit: '分钟',
                objectNo: null,
                threshold: undefined,
                disposalMethod: ['0']
            },
            unitList: ['V', '度', 'V', 'A', 'V', '%'],
            showLoading: false
        }
    },
    computed: {
        ...mapGetters(['dictInfo'])
    },
    created() {
        if(this.type === 2) {
            this.thresholdInfo = {
                ruleName: this.rowInfo.ruleName,
                period: this.rowInfo.period,
                count: this.rowInfo.count,
                timeUnit: this.rowInfo.timeUnit,
                threshold: Number(this.rowInfo.threshold) >= 0 ? this.rowInfo.threshold : undefined,
                disposalMethod: this.rowInfo.disposalMethod.split(','),
            }
            this.radioIndex = Number(this.rowInfo.objectNo) 
        }
    },
    methods: {
        changeStep() {
            if(this.step === 1) {
                this.step = 2
            }else {
                this.step = 1
            }
        },
        changeRadio(item, index) {
            if(this.radioIndex !== index) {
              this.thresholdInfo.threshold = undefined  
            }
            this.radioIndex = index
        },
        changeThreshold() {
            this.showThreshold = !this.showThreshold
        },
        changeMonitor() {
            this.showMonitor = !this.showMonitor
        },
        closeBox() {
            this.$emit('closeBox')
        },
        submitSetting() {
            // if(this.$refs.monitor.carList.length === 0 && this.$refs.monitor.chargeList.length === 0) {
            //     this.$message({
            //         type: 'warning',
            //         message: '请添加车辆或者充电设备'
            //     })
            // }else {
            //   this.toSubmit()
            // }  
            this.toSubmit()
        },
        async toSubmit() {
            if(!this.thresholdInfo.ruleName) {
               this.$message({
                    type: 'warning',
                    message: '请输入门限名称'
                })
                return  
            }
              if(this.thresholdInfo.threshold !== 0 && !this.thresholdInfo.threshold) {
                this.$message({
                    type: 'warning',
                    message: '请输入预警类型阈值'
                })
                return
            }
             if(!this.thresholdInfo.period) {
               this.$message({
                    type: 'warning',
                    message: '请输入预警周期'
                })
                return  
            }
              if(!this.thresholdInfo.count) {
               this.$message({
                    type: 'warning',
                    message: '请输入告警次数'
                })
                return  
            }
            let obj = null
            if(this.type === 1) {
                obj = {
                count: this.thresholdInfo.count,
                disposalMethod: this.thresholdInfo.disposalMethod.join(','),
                objectNo: this.radioIndex,
                threshold: this.thresholdInfo.threshold,
                period: this.thresholdInfo.period,
                ruleName: this.thresholdInfo.ruleName,
                timeUnit: this.thresholdInfo.timeUnit,
                type: 1,
             }
            }else {
                obj = {
                count: this.thresholdInfo.count,
                disposalMethod: this.thresholdInfo.disposalMethod.join(','),
                objectNo: this.radioIndex,
                threshold: this.thresholdInfo.threshold,
                period: this.thresholdInfo.period,
                ruleName: this.thresholdInfo.ruleName,
                timeUnit: this.thresholdInfo.timeUnit,
                detailid: this.rowInfo.detailid,
                id: this.rowInfo.id,
                warningRuleId: this.rowInfo.id,
                type: 1,
            }
            }
        
            const arr = []
            if(this.$refs.monitor.carList.length > 0) {
               this.$refs.monitor.carList.forEach(item => {
                arr.push({
                    type: 2,
                    objectNo: item.carNumber
                })
             }) 
            }
            const arr1 = []
             if(this.$refs.monitor.chargeList.length > 0) {
               this.$refs.monitor.chargeList.forEach(item => {
                arr1.push({
                    type: 3,
                    objectNo: item.assetsNum
                })
             }) 
            }
            const data = {
                warningConfigurationVo: obj,
                warningConfigurationVoS: arr.concat(arr1)    
            }
            let rsp = null
            if(this.type === 1) {
             this.showLoading = true
              rsp = await addPreAlarm(data)  
            }else {
                rsp = await updatePreAlarm(data)
            }
            if(rsp.code === 200) {
                this.$message({
                    type: 'success',
                    message: this.type === 1 ? '新增成功': '修改成功'
                })
                this.$emit('refresh')   
            }
            this.showLoading = false
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
.elcheckBox {
    margin-left: 5px;
    .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #222;
        }

    .el-checkbox__inner {
        width: 18px;
        height: 18px;
    }
    .el-checkbox__input {
        cursor: pointer;
        line-height: 1;
        margin-top: -10px;
    }
 .el-checkbox__inner::after {
    height: 13px;
    left: 4px;
    top: -2px;
    width: 7px;
}
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    border-color: #fff;
}

.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #41b8c3; 
    border: none;
 }  


}
</style>
<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.settingBox {
    position: relative;
    padding: 30px 17px;
    .stepHeader {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        .icon {
            margin-right: 8px;
            img {
                width: 16px;
                height: 16px;
            }
        }
       
        .title {
            color: $btnMainColor;
            font-size: 16px;
            margin-right: 9px;
            cursor: pointer;
        }
        .arrowIcon {
            margin-right: 16px;
            cursor: pointer;
            i {
                color: $btnMainColor;
            }
        }
        .line {
            flex: 1;
            height: 0.5px;
            background-color: #AFC1C4;
        }
    }

    .threshold {
        margin: 15px 0;
        padding: 0 25px;
        .item {
            display: flex;
            align-items: center;
            margin-bottom: 16px; 
            color: #222;
            font-size: 13px;
            .label {
                margin-right: 10px;
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
         .sitem {
            display: flex;
            margin-bottom: 16px; 
            color: #222;
            font-size: 13px;
            .label {
                margin-right: 10px;
            }
            .value {
               margin-top: -5px;
               .radioItem {
                   cursor: pointer;
                   color: #999;
                   display: flex;
                   align-items: center;
                   margin-bottom: 15px;
                   padding-bottom: 10px;
                   border-bottom: 1px solid #DEDEDE;
                    .radioIcon {
                         padding-left: 5px;
                      img {
                          width: 18px;
                          height: 18px;
                      }
                  }
                  .name {
                       width: 320px;
                       text-align: right;
                   }
                   .checkName {
                       width: 360px;
                       text-align: right;
                       color: $btnMainColor;
                   }
               }
                .checkRadioItem {
                  cursor: pointer;
                   color: #222;
                   display: flex;
                   align-items: center;
                   margin-bottom: 15px;
                   padding-bottom: 10px;
                   border-bottom: 1px solid #DEDEDE;
                  .radioIcon {
                      padding-left: 5px;
                      img {
                          width: 18px;
                          height: 18px;
                      }
                  }
                  .name {
                       width: 320px;
                       text-align: right;
                   }
                   .checkName {
                        width: 360px;
                       text-align: right;
                       color: $btnMainColor;
                   }
               }
            }
        }
    }

    .monitorObj {
        padding: 30px 15px;
    }

    .footer {
        position: absolute;
        bottom: 0;
        right: 30px;
    }
}
</style>