<template>
  <div class="addFault">
    <el-form
      :model="ruleForm"
      :rules="rules"
      size="medium"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <div class="formContent">
        <div class="formList">
          <el-form-item label="通知策略名称 :" prop="ruleName">
            <el-input
              v-model.trim="ruleForm.ruleName"
              placeholder="请输入通知策略名称"
            ></el-input>
          </el-form-item>
        </div>
        <div class="formList">
          <el-form-item label="设备类型 :" prop="deviceTypes">
            <el-select
              v-model="ruleForm.deviceTypes"
              clearable
              placeholder="请选择设备类型"
            >
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
          <el-form-item label="告警等级 :" prop="alarmSeverity">
            <el-select
              v-model="ruleForm.alarmSeverity"
              clearable
              @change="severityClick"
              placeholder="请选择告警等级"
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
        </div>
        <div class="formList">
          <el-form-item label="告警名称 :" prop="alarmCodes">
            <el-select
              v-model="ruleForm.alarmCodes"
              filterable
              placeholder="请选择告警名称"
            >
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
      </div>
      <div class="formContent">
        <div class="formList">
          <el-form-item label="网点 :" prop="stations">
            <el-select
              v-model="ruleForm.stations"
              clearable
              @change="changeSite"
              placeholder="请选择网点"
            >
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
        <div class="formList">
          <el-form-item label="设备型号 :" prop="deviceVersons">
            <el-input
              v-model.trim="ruleForm.deviceVersons"
              placeholder="请输入设备型号"
            ></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="formContent">
        <div class="formList">
          <el-form-item label="充电设备名称 :" prop="deviceNames">
            <el-select
              v-model="ruleForm.deviceNames"
              clearable
              placeholder="请选择充电设备名称"
            >
              <el-option
                v-for="item in chargList"
                :key="item.chargId"
                :label="item.chargName"
                :value="`${item.chargId}`"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="formList">
          <el-form-item label="设备厂商 :" prop="deviceVenders">
            <el-select
              v-model="ruleForm.deviceVenders"
              clearable
              placeholder="请选择设备厂商"
            >
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
                    <el-input-number :precision="0" :min="1"  :controls="false" v-model="ruleForm.period"/>
                </div> 
                <div class="numInput1" style="margin-left: 5px">
                    <el-select v-model="ruleForm.timeUnit" placeholder="单位">
                        <el-option label="小时" value="小时"></el-option>
                        <el-option label="分钟" value="分钟"></el-option>
                        <el-option label="秒" value="秒"></el-option>
                    </el-select>
                </div>
                <span style="margin: 0 5px">达到告警次数>=</span>
                <div class="numInput">
                    <el-input-number :min="1" :controls="false" :precision="0" v-model="ruleForm.alarmCounts"/>
                </div>
                <span style="margin-left: 5px">次，将执行通知策略</span>
              </div>
            </div>
      </div>
      <div class="orgList receives">
      <el-form-item label="接收组 :" prop="receives">
            <treeselect
            :multiple="true"
            :options="deptList"
            :flat="true"
            :sort-value-by="sortValueBy"
            :default-expand-level="1"
            placeholder="请选择接收组"
            v-model="ruleForm.receives"
            />
    </el-form-item>
    </div>
      <div class="foots">
        <el-button type="primary" @click="submitSetting('ruleForm')">确定</el-button>
        <el-button @click="reset">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { listChargGroupCode } from "@/api/alarm/alarmmonitorcenter.js";
import { upDateList, getAlarmTitle } from "@/api/alarm/celve.js";
import { getAllOrgOfCompany } from '@/api/common'
import { addList, getChargManu, getChargeBySite } from "@/api/alarm/faultalarmBase.js";
export default {
  props: {
    levelList: {
      type: Array,
      default: function() {
        return [];
      },
    },
    faultInfo: {
      type: Object,
      default: function() {
        return {};
      },
    },
    subType: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      sortValueBy: 'ORDER_SELECTED',
      deptList: [], // 接收组列表(组织机构列表)
      alarmTitleSelect: [], //告警名称
      siteList: [], //网点
      vendersSelect: [], //厂商数组
      chargList: [], //充电设备数组
      ruleForm: {
        alarmCodes: null,
        alarmSeverity: null,
        count: undefined,
        deviceVersons: null,
        deviceNames: null,
        stations: null,
        deviceTypes: null,
        period: undefined,
        ruleName: null,
        timeUnit: null,
        receives: [],
        type: 1,
        deviceVenders: null
      }, 
      rules: {
        //form表单验证逻辑
        ruleName: [
          { required: true, message: "请输入告警名称", trigger: "blur" },
        ],
        deviceTypes: [
          { required: false, message: "请选择设备类型", trigger: "change" },
        ],
        alarmCodes: [
          { required: true, message: "请选择告警名称", trigger: "change" },
        ],
        alarmSeverity: [
          { required: true, message: "请选择告警等级", trigger: "change" },
        ],
        receives: [
            { required: true, message: "请选择接收组", trigger: "change" }, 
        ]
      }
    }
  },
  computed: {
    ...mapGetters(["dictInfo"]),
  },
  created() {
    this.getChargManu();
    this.getName(); 
    this.fetchAllOrg()
    if(this.subType !== 1) {
      this.ruleForm = this.faultInfo;
    }
    if (this.ruleForm.alarmSeverity) {
      this.fetchAlarmTitle(this.ruleForm.alarmSeverity);
    }
    if(this.ruleForm.receives.length > 0) {
        this.ruleForm.receives = JSON.parse(this.ruleForm.receives)
    }
  },
  methods: {
    //告警等级点击事件
    severityClick(val) {
      this.alarmTitleSelect = []
      if (val) {
        this.fetchAlarmTitle(val);
      }
    },
    //获取告警名称
    async fetchAlarmTitle(val) {
      const res = await getAlarmTitle({ alarmSeverity: val, type: 1 });
      if (res.code == 200) {
        this.alarmTitleSelect = res.data;
      }
    },

    // 获取机构列表
    async fetchAllOrg() {
        const rsp = await getAllOrgOfCompany()
        if(rsp.code === 200) {
            this.deptList = rsp.data
        }
    },

    //获取设备厂商
    async getChargManu() {
      const res = await getChargManu();
      if (res.code == 200) {
        this.vendersSelect = res.data;
      }
    },
    //获取网点下拉数据
    async getName() {
      const res = await listChargGroupCode();
      if (res.code === 200) {
        this.siteList = res.data;
      }
    },

    // 切换网点
    changeSite(val) {
      this.chargeList = []
      this.ruleForm.deviceNames = null
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

    reset() {
      this.$emit("cleraDialog", 2);
    },
    // 修改告警知识库方法
    submitSetting(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
             if(!this.ruleForm.period) {
               this.$message({
                    type: 'warning',
                    message: '请输入告警周期'
                })
                return  
            }
              if(!this.ruleForm.alarmCounts) {
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
          this.ruleForm.stopTag = this.ruleForm.stopTag  ? 1 : 0;
          this.ruleForm.operationService =
            this.ruleForm.operationService  ? 1 : 0;
          if (this.subType == 1) {
            //调用列表新增方法
            this.addList();
          } else {
            //调用列表修改方法
            this.upDateList();
          }
        } else {
          return false;
        }
      });
    },

    //新增告警知识库
    async addList() {
      this.ruleForm.type = 1
      const res = await addList(this.ruleForm);
      if (res.code == 200) {
        this.$message({
          message: "添加成功",
          type: "success",
        });
        this.$emit("cleraDialog", 1);
      }
    },

    //修改知识库
    async upDateList() {
      this.ruleForm.type = 1
      const res = await upDateList(this.ruleForm);
      if (res.code == 200) {
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.$emit("cleraDialog", 1);
      }
    },
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
.receives {
    .vue-treeselect {
    width: 630px;
    height: 32px;
    line-height: 32px;
}
}
.addFault {
  .formContent {
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .dataInput {
    display: inline-block;
    width: 70px;
    /*margin-right: 5px;*/
  }
  .dataInput .el-input__inner {
    width: 70px !important;
  }
  .el-radio {
    margin-right: 3px !important;
    /*margin-left: 10px;*/
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .switchs {
    .el-form-item__label {
      width: 160px !important;
      margin-right: 10px;
    }
  }
  .switchContent {
    .el-form-item__label {
      margin-right: 20px;
    }
  }
}
</style>

<style scoped lang="scss">
@import "@/assets/styles/global.scss";
.formContent {
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
.formList {
  flex: 1;
  max-width: 49%;
}
.foots {
  text-align: center;
  margin-top: 20px;
}
</style>
