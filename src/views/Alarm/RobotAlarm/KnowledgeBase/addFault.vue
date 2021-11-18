<template>
  <div class="addFault">
    <el-form :model="dataInfo" :rules="rules" size="medium" ref="dataInfo" label-width="130px" class="demo-dataInfo">
            <el-row :gutter="10">
                   <el-col :span="12">
                     <el-form-item label="告警编码 :" prop="alarmCode">
                        <el-input :disabled="subType === 2 ? true : false" maxlength="32" v-model.trim="dataInfo.alarmCode" placeholder="请输入告警编码"></el-input>
                      </el-form-item>
                   </el-col>
                   <el-col :span="12">
                      <el-form-item label="告警类型 :" prop="alarmType">
                        <el-select
                          v-model="dataInfo.alarmType"
                          clearable
                          placeholder="请选择告警类型"
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
                        clearable
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
                </el-col>
                 <el-col :span="12">
                   <el-form-item label="软件版本号 :" prop="protocolVersion">
                      <el-select
                        v-model="dataInfo.protocolVersion"
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
                </el-col>
                <el-col :span="12">
                   <el-form-item label="充电机器人型号 :" prop="deviceVersion">
                    <el-select
                      v-model="dataInfo.deviceVersion"
                      clearable
                      placeholder="请选择充电机器人型号"
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
                      <el-input maxlength="32" v-model.trim="dataInfo.msgCode" placeholder="请输入相关故障代码"/>
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
import { getFacturer } from '@/api/asset/manufacturer'
import { getRobotTypeList, getRobotSoftList, addRobotBase, editRobotBase } from '@/api/alarm/robot/alarm'
import { mapGetters } from "vuex";
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
      rules: {
        alarmCode: [
          { required: true, message: "请输入告警编码", trigger: "blur" },
        ], 
        alarmTitle: [
          { required: true, message: "请输入告警名称", trigger: "blur" },
        ], 
        alarmSeverity: [
          { required: true, message: "请选择告警等级", trigger: "change" },
        ],
        alarmType: [
          { required: true, message: "请选择告警类型", trigger: "change" },
        ], 
        vender: [
          { required: true, message: "请选择告充电机器人厂商", trigger: "change" },
        ], 
        protocolVersion: [
          { required: true, message: "请选择软件版本号", trigger: "change" },
        ], 
        deviceVersion: [
          { required: true, message: "请输入充电机器人型号", trigger: "blur" },
        ], 
        // alarmDesc: [
        //   { required: true, message: "请输入告警描述", trigger: "blur" },
        // ], //告警描述
        // treatNeasures: [
        //   { required: true, message: "请输入处理措施", trigger: "blur" },
        // ], //处理措施
        // treatProgram: [
        //   { required: true, message: "请输入处理方案", trigger: "blur" },
        // ], //处理方案
      },
      btnLoading: false, 
      dataInfo: {
        alarmCode: null,
        alarmType: null,
        alarmSeverity: null,
        alarmTitle: null,
        vender: null,
        protocolVersion: null,
        deviceVersion: null,
        msgCode: null,
        alarmDesc: null,
        treatNeasures: null,
        treatProgram: null,
      },
      robotModelList: [], // 机器人型号
      robotSoftList: [], // 机器人版本号
      robotFacturerList: [] // 机器人厂商
    };
  },
  computed: {
    ...mapGetters(["dictInfo"]),
  },
  created() {
    if(this.subType !== 1) {
      this.dataInfo = this.faultInfo;
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
    // 修改告警知识库方法
    submitSetting(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dataInfo.stopTag = this.dataInfo.stopTag ? 1 : 0;
          this.dataInfo.operationService = this.dataInfo.operationService
            ? 1
            : 0;
          this.btnLoading = true;
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

    closeSetting() {
      this.$emit("clearDialog", 2);
    },

    //新增告警知识库
    async addList() {
      const res = await addRobotBase(this.dataInfo);
      if (res.code == 200) {
        this.$message({
          message: "添加成功",
          type: "success",
        });
        this.btnLoading = false;
        this.$emit("clearDialog", 1);
      }
    },

    //修改知识库
    async upDateList() {
      const res = await editRobotBase(this.dataInfo);
      if (res.code == 200) {
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.btnLoading = false;
        this.$emit("clearDialog", 1);
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
  margin-bottom: 10px;
}
.formList {
  flex: 1;
  max-width: 49%;
}
.foots {
  text-align: center;
  margin-left: -50px;
}
</style>
