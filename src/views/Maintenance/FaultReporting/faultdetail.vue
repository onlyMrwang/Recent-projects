<template>
  <div>
    <div>
      <el-button type="text" icon="el-icon-back" @click="goback"
        >返回上一页</el-button
      >
    </div>
    <div class="card" style="padding:20px">
      <!-- 标题 -->
      <TopTitle :titleName="title.basic" :width="91"></TopTitle>

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
            <td width="12%" align="right" class="tdstyle">报修人</td>
            <td width="20%">{{ tableData.inspector }}</td>
            <td width="12%" align="right" class="tdstyle">充电设备</td>
            <td width="20%">
              <div>{{ tableData.chargName }}</div>
              ({{ tableData.assetsNum }})
            </td>
          </tr>
          <tr>
            <td width="12%" align="right" class="tdstyle">报修日期</td>
            <td width="20%">{{ tableData.createTime }}</td>
            <td width="12%" align="right" class="tdstyle">报修电话</td>
            <td width="20%">{{ tableData.inspectorPhone }}</td>
            <td width="12%" align="right" class="tdstyle">充电机器人</td>
            <td width="20%">
              <!-- {{ name }} -->
              <div v-for="(item, index) in tableData.mainRoboot" :key="index">
                <div>{{ item.robotName }}</div>
                <div>({{ item.assetNum }})</div>
              </div>
            </td>
          </tr>
          <tr>
            <td width="12%" align="right" class="tdstyle">上报组织机构</td>
            <td width="20%">{{ tableData.orgName }}</td>
            <td width="12%"></td>
            <td width="20%"></td>
            <td width="12%"></td>
            <td width="20%"></td>
          </tr>
        </table>
      </el-container>
      <TopTitle :titleName="title.fault" :width="91"></TopTitle>
      <el-form ref="form" label-width="150px" size="small">
        <el-row :gutter="40">
          <el-col :span="8">
            <el-form-item label="处理组:">
              {{ tableData.handleOrgName }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关联维修工单:">
              <el-button type="text" @click="goto(tableData.jobToCode)">{{
                tableData.jobToCode
              }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-container>
        <div class="boxfault">
          <span class="tip">
            故障描述
          </span>
          <el-row :gutter="20">
            <el-col
              :span="3"
              align="right"
              style="color:#484848;font-size:14px"
            >
              故障描述:
            </el-col>
            <el-col :span="20">
              {{ tableData.faultDesc }}
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3" align="right" style="color:#484848;font-size:14px"
              >附件:</el-col
            >
            <el-col :span="20">
              <div
                class="img_div"
                v-for="(item, index) in tableData.faultFileList"
                :key="index"
              >
                <img class="pic" :src="item.fileAddre" alt="" />
                <div class="mask">
                  <i class="el-icon-zoom-in" @click="look(item.fileAddre)"></i>
                </div>
              </div>
            </el-col>
            <!-- <el-col :span="20"> </el-col> -->
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
import { getDetail } from '@/api/maintenance/faultreporting/index'
export default {
  components: { TopTitle },
  data() {
    return {
      title: {
        basic: '基本情况',
        fault: '故障描述'
      },
      tableData: {},
      name: '',
      imgurl: '',
      open: false
    }
  },
  computed: {
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
      this.name =
        res.data.result.mainRoboot.robotName +
        '(' +
        res.data.result.mainRoboot.assetNum +
        ')'
    })
  },
  methods: {
    look(val) {
      this.imgurl = val
      this.open = true
    },
    goback() {
      this.$router.go(-1)
    },
    // 关联维修工单
    goto(val) {
      let code = val
      this.$store.commit(
        'settings/changeSiderMenuIndex',
        '/airweb/maintenance/repairdetail'
      )
      this.$router.push({ path: `/airweb/maintenance/repairdetail/${code}` })
    }
  }
}
</script>
<style lang="scss" scoped>
// .top {
//   line-height: 20px;
// }
// .title {
//   width: 20px;
//   color: skyblue;
// }
.boxfault {
  border: solid 1px #ccc;
  width: 97%;
  margin: 0 auto;
  height: auto;
  padding: 20px 0;
  // height: 50px;
}
.tip {
  position: relative;
  top: -35px;
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
::v-deep .el-dialog__header {
  padding: 15px 20px;
  height: 8px;
}
</style>
