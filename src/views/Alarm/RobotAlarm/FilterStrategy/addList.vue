<template>
  <div class="addFault">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <div class="formContent">
        <div class="formList">
          <el-form-item label="过滤策略名称 :" prop="ruleName">
            <el-input
              maxlength="32"
              v-model.trim="ruleForm.ruleName"
              placeholder="请输入告警过滤策略名称"
            ></el-input>
          </el-form-item>
        </div>
        <div class="formList">
          <el-form-item label="充电机器人厂商 :" prop="vender">
              <el-select
              v-model="ruleForm.vender"
              clearable
              placeholder="请选择充电机器人厂商"
            >
              <el-option
                v-for="item in robotFacturerList"
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
        <div class="formList">
          <el-form-item label="告警级别 :" prop="alarmSeverity">
            <el-select
              v-model="ruleForm.alarmSeverity"
              clearable
              @change="severityClick"
              placeholder="请选择告警级别"
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
          <el-form-item label="告警名称 :" prop="alarmCode">
            <el-select
              v-model="ruleForm.alarmCode"
              filterable
              @change="changeAlarm"
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
            <!--<el-input v-model="ruleForm.alarmTitle" placeholder="请输入告警名称"></el-input>-->
          </el-form-item>
        </div>
      </div>
      <div class="formContent">
        <div class="formList">
          <el-form-item label="充电机器人型号 :" prop="deviceModel">
             <el-input maxlength="32" v-model.trim="ruleForm.deviceModel" placeholder="请输入充电机器人型号"/>
          </el-form-item>
        </div>
        <div class="formList">
          <el-form-item label="软件版本号 :" prop="protocolVersion">
            <el-select
              v-model="ruleForm.protocolVersion"
              clearable
              placeholder="请选择软件版本号"
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
        </div>
      </div>
      <div class="formContent">
        <div class="formList">
          <el-form-item label="网点 :" prop="deviceStie">
               <el-select
                v-model="ruleForm.deviceStie"
                @change="changeSite"
                clearable
                placeholder="请选择充电网点"
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
          <el-form-item label="充电机器人名称 :" prop="deviceName">
               <el-select
                v-model="ruleForm.deviceName"
                clearable
                placeholder="请选择充电机器人名称"
              >
                <el-option
                  v-for="item in robotList"
                  :key="item.assetNum"
                  :label="item.robotName"
                  :value="item.robotName"
                >
                </el-option>
              </el-select>
          </el-form-item>
        </div>
      </div>
       <div class="formContent">
        <!-- <div class="formList"> -->
             <el-form-item label="触发时机 :" prop="period">
                 <div style="display: flex;">
                 <div class="dataInput" style="margin-right: 5px">
                    <el-input-number :controls="false" v-model="ruleForm.period" :precision="0" :min="1" style="width: 50px;"></el-input-number>
                  </div>
                  <div class="timeUnit">
                   <el-select
                    v-model="ruleForm.timeUnit"
                >
                    <el-option label="小时" value="小时"></el-option>
                    <el-option label="分钟" value="分钟"></el-option>
                    <el-option label="秒" value="秒"></el-option>
                 </el-select>
              </div>
              内, 产生告警达到 
               <div class="dataInput" style="margin: 0 5px;">
                    <el-input-number :controls="false" :precision="0" v-model="ruleForm.count" :min="1" style="width: 50px;"></el-input-number>
                  </div>次
              </div>
             </el-form-item>
        <!-- </div> -->
       </div>
      <div class="foots">
        <el-button type="primary" @click="submitSetting('ruleForm')"
          >确定</el-button
        >
        <el-button @click="closeSetting">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { listChargGroupCode } from "@/api/alarm/alarmmonitorcenter";
import { upDateLists, addList, getAlarmTitle } from "@/api/alarm/celve";
import { getFacturer } from '@/api/asset/manufacturer'
import { getRobotSoftList, getRobotList } from '@/api/alarm/robot/alarm'
export default {
  props: {
    levelLists: {
      //定义接收报警级别数组
      type: Array, //数据类型
      required: true, //是否必传
    },
    ruleForms: {
      //接收父组件传来的修改值
      type: Object,
      required: false,
    },
    subTypes: {
      type: Number,
      required: true,
    },
  },
  data() {
    var validPeriod = (rule, value, callback) => {
        if (Number(value) === 0) {
            callback(new Error("触发时机时间不能为0"));
        } else {
            callback();
        }
    }            
    return {
      alarmTitleSelect: [], //告警名称数组
      siteList: [], //网点
      ruleForm: {
        ruleName: null, 
        vender: null,
        alarmSeverity: null,
        alarmCode: null,
        deviceModel: null,
        protocolVersion: null,
        deviceStie: null,
        deviceName: null,
        period: undefined,
        timeUnit: null,
        count: undefined,
      }, 
      robotSoftList: [], // 机器人版本号
      robotFacturerList: [], // 机器人厂商
      robotList: [], // 机器人列表
      rules: {
        ruleName: [ { required: true, message: "请输入告警过滤策略名称", trigger: "blur" } ],
        vender: [{ required: true, message: "请选择充电机器人厂商", trigger: "change" }],
        alarmSeverity: [
          { required: true, message: "请选择告警等级", trigger: "change" },
        ],
        alarmCode: [
          { required: true, message: "请选择告警名称", trigger: "change" },
        ],
        period: [
          { required: true, message: "请输入触发时机", trigger: "blur" },
          {validator: validPeriod, trigger: 'blur', }
        ],
      },
      levelList: [],
      subType: 1,
    };
  },
  computed: {
    ...mapGetters(["dictInfo"]),
  },
  created() {
    this.levelList = this.levelLists;
    this.subType = this.subTypes;
    if(this.subTypes !== 1) {
       this.ruleForm = this.ruleForms;
    }
    if(!this.ruleForm.timeUnit) {
        this.ruleForm.timeUnit = '分钟'
    }
    if(this.ruleForm.alarmSeverity) {
         this.getAlarmTitle(this.ruleForm.alarmSeverity);
    }
     if(this.ruleForm.deviceStie) {
      this.fetchRobotList(this.ruleForm.deviceStie)
    }
    this.fetchSiteList(); 
    this.fetchRobotSoft()
    this.fetchRobotFacturer()
  },
  methods: {
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

    severityClick(val) {
      this.alarmTitleSelect = [];
      this.ruleForm.alarmCode = null
      if(val) {
        this.getAlarmTitle(val);
      }
      
    },
    //获取告警名称
    async getAlarmTitle(val) {
      const res = await getAlarmTitle({ alarmSeverity: val, type: 3 });
      if (res.code == 200) {
        this.alarmTitleSelect = res.data;
      }
    },

    changeSite(val) {
        this.robotList = []
        this.ruleForm.deviceName = null
        if(val) {
          this.fetchRobotList(val)
        }  
    },

    changeAlarm(val) {
       const arr = this.alarmTitleSelect.filter(item => item.alarmCode === val)
       if(arr.length > 0) {
           this.ruleForm.alarmTitle = arr[0].alarmTitle
       }
    },

    async fetchRobotList(val) {
        const rsp = await getRobotList({chargGroupId: val})
        if(rsp.code === 200) {
            this.robotList = rsp.data.result
        }
    },

    closeSetting() {
      this.$emit("clearDialog", 2);
    },
    // 修改告警知识库方法
    submitSetting(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.ruleForm.count) {
              this.$message({
                  type: 'warning',
                  message: '请填写告警达到的次数'
              })
              return
          }
          if(!this.ruleForm.period) {
              this.$message({
                  type: 'warning',
                  message: '请填写告警达到的次数'
              })
              return
          }
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

    async addList() {
     this.ruleForm.type = 3
      const res = await addList(this.ruleForm);
      if (res.code == 200) {
        this.$message({
          message: "添加成功",
          type: "success",
        });
        this.$emit("clearDialog", 1);
      }
    },

    async upDateList() {
      this.ruleForm.type = 3
      const res = await upDateLists(this.ruleForm);
      if (res.code == 200) {
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.$emit("clearDialog", 1);
      }
    },
    //获取网点下拉数据
    async fetchSiteList() {
      const res = await listChargGroupCode();
      if (res.code === 200) {
        this.siteList = res.data;
      }
    },
  },
};
</script>
<style lang="scss">
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
  
  .timeUnit {
      margin-right: 5px;
      .el-input__inner {
          width: 80px;
      }
  }
}
</style>


<style scoped lang="scss">
@import "@/assets/styles/global.scss";
.formContent {
  display: flex;
  margin-bottom: 20px;
}
.formList {
  flex: 1;
  max-width: 49%;
}
.foots {
  margin-top: 30px;
  text-align: center;
}
</style>
