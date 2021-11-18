<template>
  <div class="addFault">
    <el-form
      :model="dataInfo"
      :rules="rules"
      size="small"
      ref="dataInfo"
      class="demo-dataInfo"
      label-width="120px"
    >
      <div class="formContent">
        <div class="formList">
          <el-form-item label="告警编码 :" prop="alarmTitle">
            <el-input v-model="dataInfo.alarmTitle" disabled></el-input>
          </el-form-item>
        </div>
        <div class="formList">
          <el-form-item label="通信协议 :" prop="alarmSeverity">
            <el-select
              v-model="dataInfo.alarmSeverity"
              disabled
              clearable
              placeholder="请选择通信协议"
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
          <el-form-item label="告警类型 :" prop="alarmType">
            <el-select
              v-model="dataInfo.alarmType"
              disabled
              clearable
              placeholder="请选择告警类型"
            >
              <el-option
                v-for="item in dictInfo.alarmType"
                :key="item.value"
                :label="item.label"
                :value="Number(item.value)"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="formList">
          <el-form-item label="告警名称 :" prop="alarmDto">
            <el-select
              v-model="dataInfo.alarmType"
              disabled
              clearable
              placeholder="请选择告警名称"
            >
              <el-option
                v-for="item in dictInfo.alarmType"
                :key="item.value"
                :label="item.label"
                :value="Number(item.value)"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <el-form-item label="告警描述 :" prop="alarmDesc">
        <el-input
          v-model="dataInfo.alarmDesc"
          disabled
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="处理措施 :" prop="treatNeasures">
        <el-input
          v-model="dataInfo.treatNeasures"
          disabled
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="处理方案 :" prop="treatProgram">
        <el-input
          v-model="dataInfo.treatProgram"
          disabled
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <!-- <div class="foots">
          <el-button @click="closeSetting">关闭</el-button>
        </div> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getAlarmDetail } from '@/api/alarm/faultalarmBase'
import { mapGetters } from 'vuex'
export default {
  props: {
    alarmTitle: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      levelList: [
        { label: '1级', value: 1 },
        { label: '2级', value: 2 },
        { label: '3级', value: 3 }
      ],
      dataInfo: {}
    }
  },
  computed: {
    ...mapGetters(['dictInfo'])
  },
  created() {
    if (this.alarmTitle) {
      this.fetchAlarmDetail({ alarmTitle: this.alarmTitle })
    }
  },
  methods: {
    async fetchAlarmDetail(data) {
      const rsp = await getAlarmDetail(data)
      if (rsp.code === 200) {
        this.dataInfo = rsp.data
        this.dataInfo.stopTag = this.dataInfo.stopTag == 1 ? true : false
        this.dataInfo.operationService =
          this.dataInfo.operationService == 1 ? true : false
      }
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
</style>
