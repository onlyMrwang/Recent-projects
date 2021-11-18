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
              v-model.trim="ruleForm.ruleName"
              placeholder="请输入过滤策略名称"
            ></el-input>
          </el-form-item>
        </div>
        <div class="formList">
          <el-form-item label="通信协议 :" prop="commProtocol">
            <el-select
              v-model="ruleForm.commProtocol"
              clearable
              placeholder="请选择通信协议"
              @change="changeType"
            >
              <el-option
                v-for="item in dictInfo.commProtocol"
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
          <el-form-item label="告警类型 :" prop="alarmSeverity">
            <el-select
              v-model="ruleForm.alarmSeverity"
              clearable
              placeholder="请选择告警类型"
              @change="changeTitle"
            >
              <el-option
                v-for="item in alarmTypeList"
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
              clearable
              filterable
              :placeholder="
                ruleForm.alarmSeverity ? '请选择告警名称' : '请先选择告警类型'
              "
            >
              <el-option
                v-for="item in alarmTitleSelect"
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
          <div class="orgList">
          <el-form-item label="所属组织机构 :" prop="institutionalId">
            <treeselect
              :clearable="false"
              v-model="ruleForm.institutionalId"
              :default-expand-level="2"
              :options="deptList"
              :normalizer="normalizer"
              placeholder="请选择所属组织机构"
            />
          </el-form-item>
          </div>
        </div>
        <div class="formList">
          <el-form-item label="车牌号 :" prop="deviceNos">
            <el-input
              v-model="ruleForm.deviceNos"
              placeholder="请输入车牌号"
            ></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="formContent">
        <div class="formList">
          <el-form-item label="厂商 :" prop="vender">
            <el-select
              v-model="ruleForm.vender"
              clearable
              placeholder="请选择厂商"
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
        <div class="formList">
          <el-form-item label="型号 :" prop="deviceModel">
            <el-input
              placeholder="请输入型号"
              v-model="ruleForm.deviceModel"
            ></el-input>
            <!-- <el-select
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
            </el-select> -->
          </el-form-item>
        </div>
      </div>
      <div class="formContent">
        <div class="item">
          <div class="label">触发时机:</div>
          <div class="value">
            在&nbsp;
            <div class="numInput">
              <el-input-number
                :min="0"
                :controls="false"
                v-model="ruleForm.period"
              />
            </div>
            <div class="numInput1">
              <el-select v-model="ruleForm.timeUnit" placeholder="单位">
                <el-option label="小时" value="小时"></el-option>
                <el-option label="分钟" value="分钟"></el-option>
                <el-option label="秒" value="秒"></el-option>
              </el-select>
            </div>
            &nbsp;内,
            <span style="margin: 0 5px">产生告警次数达到</span>
            <div class="numInput">
              <el-input-number
                :min="0"
                :controls="false"
                v-model="ruleForm.count"
              />
            </div>
            <span>&nbsp;次，开启过滤，直到此告警事件清除</span>
          </div>
        </div>
      </div>
      <div class="foots">
        <el-button
          type="primary"
          @click="submitSetting('ruleForm')"
          :loading="showLoading"
          >提交</el-button
        >
        <el-button @click="reset">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listChargGroupCode } from '@/api/alarm/alarmmonitorcenter.js'
import { upDateList, getAlarmTitle } from '@/api/alarm/celve.js'
import { getAllOrgOfCompany } from '@/api/common'
import {
  getAlarmTypeByComm,
  getAlarmTitleByType //获取告警名称
} from '@/api/alarm/caralarm/monitoringcenter'
import {
  addList,
  getChargManu,
  getChargingInfo
} from '@/api/alarm/faultalarmBase.js'
export default {
  props: {
    levelLists: {
      type: Array,
      default: function() {
        return []
      }
    },
    ruleForms: {
      //接收父组件传来的修改值
      type: Object,
      required: false
    },
    faultInfo: {
      type: Object,
      default: function() {
        return {}
      }
    },
    subTypes: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      showLoading: false,
      sortValueBy: 'ORDER_SELECTED',
      deptList: [], // 接收组列表(组织机构列表)
      alarmTitleSelect: [], //告警名称
      siteList: [], //网点
      vendersSelect: [], //厂商数组
      ChargingInfoSelect: [], //充电设备数组
      ruleForm: {}, //form表单接收数据对象
      subType: 1,
      alarmTypeList: [],
      rules: {
        //form表单验证逻辑
        ruleName: [
          { required: true, message: '请输入告警名称', trigger: 'blur' }
        ],
        deviceTypes: [
          { required: false, message: '请选择设备类型', trigger: 'change' }
        ],
        alarmCode: [
          { required: true, message: '请选择告警名称', trigger: 'change' }
        ],
        alarmSeverity: [
          { required: true, message: '请选择告警等级', trigger: 'change' }
        ],
        receives: [
          { required: true, message: '请选择接收组', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['dictInfo'])
  },
  created() {
    this.getChargManu()
    this.getChargingInfos()
    this.getName()
    this.fetchAllOrg()
    this.ruleForm = this.ruleForms
    this.subType = this.subTypes
    // if (!this.ruleForm.timeUnit) {
    //   this.ruleForm.timeUnit = '小时'
    // }
    if (this.ruleForm.alarmSeverity) {
      this.fetchAlarmTitle(this.ruleForm.alarmSeverity)
    }
    if (this.ruleForm.receives) {
      this.ruleForm.receives = JSON.parse(this.ruleForm.receives)
    }
  },
  methods: {
    normalizer(node) {
      //去掉children=[]的children属性
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children
      }
    },
    // 请求告警类型
    changeType(e) {
      if (this.alarmTypeList !== [] || this.alarmTitleSelect !== []) {
        if (this.ruleForm.alarmSeverity) {
          this.ruleForm.alarmSeverity = ''
          this.ruleForm.alarmCode = ''
        }
        this.alarmTypeList = []
        this.alarmTitleSelect = []
      }

      const obj = {}
      obj.protocolVersion = e
      getAlarmTypeByComm(obj).then((res) => {
        this.alarmTypeList = res.data
      })
    },
    // 请求告警名称
    changeTitle(e) {
      if (this.ruleForm.alarmCode) {
        this.ruleForm.alarmCode = ''
      }
      getAlarmTitleByType({ alarmType: e }).then((res) => {
        this.alarmTitleSelect = res.data
      })
    },
    //告警等级点击事件
    severityClick(val) {
      this.alarmTitleSelect = []
      if (val) {
        this.fetchAlarmTitle(val)
      }
    },
    //获取告警名称
    async fetchAlarmTitle(val) {
      const res = await getAlarmTitle({ alarmSeverity: val })
      if (res.code == 200) {
        this.alarmTitleSelect = res.data
      }
    },

    // 获取机构列表
    async fetchAllOrg() {
      const rsp = await getAllOrgOfCompany()
      if (rsp.code === 200) {
        this.deptList = rsp.data
      }
    },

    //获取设备厂商
    async getChargManu() {
      const res = await getChargManu()
      if (res.code == 200) {
        this.vendersSelect = res.data
      }
    },

    //充电设备查询
    async getChargingInfos() {
      const res = await getChargingInfo()
      if (res.code == 200) {
        this.ChargingInfoSelect = res.data
      }
    },

    //获取网点下拉数据
    async getName() {
      const res = await listChargGroupCode()
      if (res.code === 200) {
        this.siteList = res.data
      }
    },

    reset() {
      this.$emit('clearDialog', 2)
    },
    // 修改告警知识库方法
    submitSetting(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.ruleForm.period) {
            this.$message({
              type: 'warning',
              message: '请输入告警周期'
            })
            return
          }
          if (!this.ruleForm.count) {
            this.$message({
              type: 'warning',
              message: '请输入告警次数'
            })
            return
          }
          if (!this.ruleForm.timeUnit) {
            this.$message({
              type: 'warning',
              message: '请选择时间单位'
            })
            return
          }
          this.ruleForm.stopTag = this.ruleForm.stopTag ? 1 : 0
          this.ruleForm.operationService = this.ruleForm.operationService
            ? 1
            : 0
          if (this.subType == 1) {
            //调用列表新增方法
            this.addList()
          } else {
            //调用列表修改方法
            this.upDateList()
          }
        } else {
          return false
        }
      })
    },

    //新增告警知识库
    async addList() {
      this.showLoading = true
      this.ruleForm.type = 1
      const res = await addList(this.ruleForm)
      if (res.code == 200) {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.$emit('cleraDialog', 1)
      }
      this.showLoading = false
    },

    //修改知识库
    async upDateList() {
      this.showLoading = true

      this.ruleForm.type = 1
      const res = await upDateList(this.ruleForm)
      if (res.code == 200) {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.$emit('cleraDialog', 1)
      }
      this.showLoading = false
    }
  }
}
</script>
<style lang="scss">
.numInput {
  .el-input__inner {
    width: 65px !important;
  }
}
.numInput1 {
  .el-input__inner {
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
@import '@/assets/styles/global.scss';
.formContent {
  display: flex;
  margin-bottom: 20px;
  .item {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    margin-left: 4.1875rem;
    font-size: 14px;
    .label {
      margin-right: 1.0625rem;
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
::v-deep .el-form-item__error {
  padding: 0;
}
::v-deep.el-form-item__content {
  line-height: 2rem;
  margin-top: 0.25rem;
}
</style>
