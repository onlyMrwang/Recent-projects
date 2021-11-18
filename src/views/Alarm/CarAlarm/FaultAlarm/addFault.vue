<template>
  <div class="addFault">
    <el-form
      :model="dataInfo"
      :rules="rules"
      size="small"
      ref="form"
      class="demo-dataInfo"
      label-width="120px"
    >
      <div class="formContent">
        <div class="formList">
          <el-form-item label="告警编码:" prop="alarmCode">
            <el-input v-model="dataInfo.alarmCode"></el-input>
          </el-form-item>
        </div>
        <div class="formList">
          <el-form-item label="通信协议:" prop="protocolVersion">
            <el-select
              v-model="dataInfo.protocolVersion"
              clearable
              placeholder="请选择通信协议"
              @change="changeType"
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
      </div>
      <div class="formContent">
        <div class="formList">
          <el-form-item label="告警类型:" prop="alarmType">
            <el-select
              v-model="dataInfo.alarmType"
              clearable
              placeholder="请选择告警类型"
              @change="changeTitle"
            >
              <el-option
                v-for="item in alarmTypeList"
                :key="item.value"
                :label="item.label"
                :value="Number(item.value)"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="formList">
          <el-form-item label="告警名称:" prop="alarmTitle">
            <el-select
              v-model="dataInfo.alarmTitle"
              clearable
              placeholder="请选择告警类型"
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
      <el-form-item label="告警描述:" prop="alarmDesc">
        <el-input v-model="dataInfo.alarmDesc" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="处理措施:" prop="treatNeasures">
        <el-input v-model="dataInfo.treatNeasures" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="处理方案:" prop="treatProgram">
        <el-input v-model="dataInfo.treatProgram" type="textarea"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getAlarmTypeByComm,
  getAlarmTitleByType //获取告警名称
} from '@/api/alarm/caralarm/monitoringcenter'
import { getAlarmDetail } from '@/api/alarm/faultalarmBase'
import { stopWledgeConfig } from '@/api/alarm/caralarm/faultalarm'
import { mapGetters } from 'vuex'
export default {
  props: {
    rowInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    let space = (rule, value, cb) => {
      let reg = /^\S*$/
      if (!reg.test(value)) {
        cb(new Error('不能为空'))
      } else {
        cb()
      }
    }
    return {
      levelList: [],
      dataInfo: {
        alarmCode: '',
        protocolVersion: '',
        alarmType: '',
        alarmTitle: '',
        treatNeasures: '',
        devicType: 2
      },
      rules: {
        alarmCode: [
          { validator: space, trigger: 'blur' },
          { required: true, message: '请输入告警编码', trigger: 'blur' }
        ],
        protocolVersion: [
          { required: true, message: '请选择通信协议', trigger: 'blur' }
        ],
        alarmType: [
          { required: true, message: '请选择告警类型', trigger: 'blur' }
        ],
        alarmTitle: [
          { required: true, message: '请选择告警名称', trigger: 'blur' }
        ],
        treatNeasures: [
          { validator: space, trigger: 'blur' },
          { required: true, message: '请选择处理措施', trigger: 'blur' }
        ]
      },
      alarmTypeList: [],
      alarmTitleSelect: []
    }
  },
  computed: {
    ...mapGetters(['dictInfo'])
  },
  created() {
    this.levelList = this.dictInfo.commProtocol
    this.dataInfo = this.rowInfo
    getAlarmTypeByComm({ protocolVersion: this.dataInfo.protocolVersion }).then(
      (res) => {
        this.alarmTypeList = res.data
      }
    )
    getAlarmTitleByType({ alarmType: this.dataInfo.alarmType }).then((res) => {
      this.alarmTitleSelect = res.data
    })
  },
  methods: {
    // 请求告警类型
    changeType(e) {
      this.dataInfo.alarmType = ''
      this.dataInfo.alarmTitle = ''
      const obj = {}
      obj.protocolVersion = e
      getAlarmTypeByComm(obj).then((res) => {
        this.alarmTypeList = res.data
      })
    },
    // 请求告警名称
    changeTitle(e) {
      this.dataInfo.alarmTitle = ''
      getAlarmTitleByType({ alarmType: e }).then((res) => {
        this.alarmTitleSelect = res.data
      })
    },
    async fetchAlarmDetail(data) {
      const rsp = await getAlarmDetail(data)
      if (rsp.code === 200) {
        this.dataInfo = rsp.data
        this.dataInfo.stopTag = this.dataInfo.stopTag == 1 ? true : false
        this.dataInfo.operationService =
          this.dataInfo.operationService == 1 ? true : false
      }
    },
    // 修改告警知识库方法
    submitSetting() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          stopWledgeConfig(this.dataInfo).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.closeSetting()
            }
          })
        }
      })
    },
    closeSetting() {
      this.$emit('closeDialog')
    }
  }
}
</script>
<style lang="scss">
/*弹出框form样式样式重构修改*/
/*//修改form表格列表下边距位置*/
/*修改滑块lebel宽度以及又边距*/
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
@import '@/assets/styles/global.scss';
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
}
::v-deep .el-textarea {
  margin-top: 5px;
}
</style>
