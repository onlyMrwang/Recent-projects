<template>
  <div>
    <div>
      <el-button type="text" icon="el-icon-back" @click="goback"
        >返回上一页</el-button
      >
    </div>
    <div class="card" style="padding:20px">
      <TopTitle Title :titleName="title.basic" :width="title.small"></TopTitle>
      <el-container style="padding:20px 0">
        <table width="97%" align="center">
          <tr>
            <td width="12%" align="right" class="tdstyle">工单编号</td>
            <td width="20%">{{ tableData.jobCode }}</td>
            <td width="12%" align="right" class="tdstyle">工单来源</td>
            <td width="20%">{{ form }}</td>
            <td width="12%" align="right" class="tdstyle">网点名称</td>
            <td width="20%">{{ tableData.chargGroupName }}</td>
          </tr>
          <tr>
            <td width="12%" align="right" class="tdstyle">工单状态</td>
            <td width="20%">{{ jobState }}</td>
            <td width="12%" align="right" class="tdstyle">设备类型</td>
            <td width="20%">
              {{ tableData.chargEquipType == 0 ? '自流充电机' : '交流充电机' }}
            </td>
            <td width="12%" align="right" class="tdstyle">充电设备</td>
            <td width="20%">
              <div>{{ tableData.chargName }}</div>

              ({{ tableData.assetsNum }})
            </td>
          </tr>
          <tr>
            <td width="12%" align="right" class="tdstyle">设备功率(kW)</td>
            <td width="20%">{{ tableData.ratedPow }}</td>
            <td width="12%" align="right" class="tdstyle">设备电压(V)</td>
            <td width="20%">{{ tableData.voltageTop }}</td>
            <td width="12%" align="right" class="tdstyle">充电机器人</td>
            <td width="20%">
              <div v-for="(item, index) in tableData.mainRoboot" :key="index">
                <div>{{ item.robotName }}</div>
                <div>({{ item.assetNum }})</div>
              </div>
            </td>
          </tr>
          <tr>
            <td width="12%" align="right" class="tdstyle">组织机构</td>
            <td width="20%">{{ tableData.orgName }}</td>
            <td width="12%" align="right" class="tdstyle">巡检人</td>
            <td width="20%">{{ tableData.inspector }}</td>
            <td width="12%" align="right" class="tdstyle">巡检日期</td>
            <td width="20%">{{ tableData.inspectionTime }}</td>
          </tr>
        </table>
      </el-container>
      <!-- <TopTitle :titleName="title.inspect"></TopTitle> -->
      <TopTitle :titleName="title.inspect" :width="85"></TopTitle>
      <el-container style="padding:20px 0">
        <div class="boxins">
          <span class="tip">
            巡检内容
          </span>
          <el-row :gutter="20">
            <el-col>
              <div
                class="selected"
                v-for="(item, index) in tableData.itemList1"
                :key="index"
              >
                {{ index + 1 }},{{ item.label1 ? item.label1 : '其他检查' }}
                <el-radio-group
                  :key="index"
                  v-if="item.label1"
                  v-model="item.inspectionItemState"
                  style="border-bottom: 1px solid #ccc;"
                >
                  <el-radio
                    :disabled="item.inspectionItemState == 1 ? false : true"
                    :label="1"
                    >是</el-radio
                  >
                  <el-radio
                    :disabled="item.inspectionItemState == 2 ? false : true"
                    :label="2"
                    >否</el-radio
                  >
                  <el-radio
                    :disabled="item.inspectionItemState == 0 ? false : true"
                    :label="0"
                    >无</el-radio
                  >
                </el-radio-group>
                <span v-else style="margin-left:15px">{{
                  item.inspectionItemCustomize
                }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-container>
      <TopTitle :titleName="title.robot" :width="85"></TopTitle>
      <el-container style="padding:20px 0">
        <div class="boxins">
          <span class="tip">
            巡检内容
          </span>
          <el-row :gutter="20">
            <el-col>
              <div
                class="selected"
                v-for="(item, index) in tableData.itemList2"
                :key="index"
              >
                {{ index + 1 }},{{ item.label2 ? item.label2 : '其他检查' }}
                <el-radio-group
                  v-if="item.label2"
                  v-model="item.inspectionItemState"
                >
                  <el-radio
                    :disabled="item.inspectionItemState == 1 ? false : true"
                    :label="1"
                    >是</el-radio
                  >
                  <el-radio
                    :disabled="item.inspectionItemState == 2 ? false : true"
                    :label="2"
                    >否</el-radio
                  >
                  <el-radio
                    :disabled="item.inspectionItemState == 0 ? false : true"
                    :label="0"
                    >无</el-radio
                  >
                </el-radio-group>
                <span v-else style="margin-left:15px">{{
                  item.inspectionItemCustomize
                }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-container>
      <TopTitle :titleName="title.result" :width="84"></TopTitle>
      <div>
        <el-form ref="form" label-width="150px">
          <el-row :gutter="40">
            <el-col>
              <el-form-item label="转维修工单:">
                <el-button type="text" @click="goto(tableData.jobToCode)">{{
                  tableData.jobToCode
                }}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-container>
        <div class="boxins">
          <span class="tip">
            故障描述
          </span>
          <el-row :gutter="20">
            <el-col
              :span="3"
              align="right"
              style="color:#484848;font-size:14px"
            >
              设备情况:
            </el-col>
            <el-col :span="20">
              {{ tableData.chargState == 0 ? '故障' : '正常' }}
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3" align="right" style="color:#484848;font-size:14px"
              >附件:</el-col
            >
            <el-col :span="20">
              <div
                class="img_div"
                v-for="(item, index) in tableData.inspectionFileList"
                :key="index"
              >
                <img class="pic" :src="item.fileAddre" alt="" />
                <div class="mask">
                  <i class="el-icon-zoom-in" @click="look(item.fileAddre)"></i>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-container>
    </div>
    <el-dialog :visible.sync="open">
      <img width="100%" :src="imgurl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
// 标题组件
import TopTitle from '../components/title.vue'
import { getDetail } from '@/api/maintenance/inspectionorder/index'
export default {
  components: { TopTitle },
  data() {
    return {
      title: {
        basic: '基本情况',
        inspect: '充电设备巡检',
        robot: '充电机器人巡检',
        mini: 90,
        normal: 92,
        small: 88,
        result: '巡检结果及其他结果'
      },
      tableData: {},
      imgurl: '',
      open: false,
      radio: 1
    }
  },
  computed: {
    //
    // 状态
    jobState() {
      if (this.tableData.jobState == 0) {
        return '已提交'
      } else if (this.tableData.jobState == 1) {
        return '已上报  '
      } else if (this.tableData.jobState == 2) {
        return '处理中'
      } else {
        return '已完结'
      }
    },
    // 来源
    form() {
      if (this.tableData.jobFrom == 0) {
        return '自建'
      } else if (this.tableData.jobFrom == 1) {
        return '客服派单'
      } else if (this.tableData.jobFrom == 2) {
        return '转派'
      } else {
        return '告警'
      }
    }
  },
  created() {
    getDetail(this.$route.params.id).then((res) => {
      this.tableData = res.data.result
      // this.name =
      //   res.data.result.mainRoboot.robotName +
      //   '(' +
      //   res.data.result.mainRoboot.assetNum +
      //   ')'
    })
  },
  methods: {
    // 查看
    look(val) {
      this.imgurl = val
      this.open = true
    },
    // 关联维修工单
    goto(val) {
      let code = val
      this.$store.commit(
        'settings/changeSiderMenuIndex',
        '/airweb/maintenance/repairdetail'
      )
      this.$router.push({ path: `/airweb/maintenance/repairdetail/${code}` })
    },
    goback() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.boxins {
  border: solid 1px #ccc;
  width: 97%;
  margin: 0 auto;
  height: auto;
  padding: 20px 0;
  // height: 50px;
}
.tip {
  position: relative;
  top: -33px;
  left: 26px;
  background-color: White;
}
table {
  font-size: 14px;
  border-collapse: collapse;
}
table,
table tr td {
  border: 1px solid #ccc;
}
table tr td {
  padding: 5px 10px;
}
.tdstyle {
  background: rgb(242, 246, 247);
}
ol li {
  border-bottom: 1px solid #dcdfe6;
}
.selected {
  // width: 31.25rem;
  margin: 10px 0 10px 25px;
}
::v-deep .el-radio-group {
  border-bottom: 1px solid #ccc;
  margin-left: 15px;
}
.pic {
  width: 100px;
  height: 100px;
}
.img_div {
  position: relative;
  width: 100px;
  height: 100px;
  display: inline-block;
  margin-right: 0.3125rem;
}
.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  background: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  opacity: 0;
  text-align: center;
  line-height: 100px;
}
.img_div:hover .mask {
  opacity: 1;
}
</style>
