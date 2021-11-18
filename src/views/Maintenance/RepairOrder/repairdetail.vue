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
            <td width="12%"></td>
            <td width="20%"></td>
            <td width="12%"></td>
            <td width="20%"></td>
          </tr>
        </table>
      </el-container>
      <TopTitle :titleName="title.fault" :width="91"></TopTitle>
      <el-form ref="form" label-width="150px" size="small">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="故障时间:">
              {{ tableData.createTime }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报修人:">
              <el-button type="text">{{ tableData.inspector }}</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话:">
              <el-button type="text">{{ tableData.inspectorPhone }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="转派工单:">
              <el-button
                type="text"
                @click="goto(tableData.jobFromType, tableData.jobFromCode)"
                >{{ tableData.jobFromCode }}</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-container>
        <div class="boxrepair">
          <span class="tip">
            故障内容
          </span>
          <el-row :gutter="20">
            <el-col
              :span="3"
              style="font-size:14px;color:#484848"
              align="right"
            >
              故障描述:
            </el-col>
            <el-col :span="20">
              {{ tableData.faultDesc }}
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3" align="right" style="font-size:14px;color:#484848"
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
          </el-row>
        </div>
      </el-container>
      <TopTitle :titleName="title.together" :width="91"></TopTitle>
      <el-form ref="form" label-width="150px" size="small">
        <el-row :gutter="40">
          <el-col :span="8">
            <el-form-item label="处理次数:">
              {{ tableData.handleList ? tableData.handleList.length : 0 }}
              <!-- {{ len }} -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-container>
        <div class="boxrepair">
          <span class="tip">
            协同处理(流转)
          </span>
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in tableData.handleList"
              :key="index"
            >
              <div class="item">
                <div>
                  <i
                    v-if="isshow(item.handleType)"
                    :class="[
                      showList[index].rotate
                        ? 'el-icon-arrow-right go'
                        : ' el-icon-arrow-right aa'
                    ]"
                    @click="rote(index)"
                  ></i>
                  <span style="color:#87ceeb">{{
                    getType(item.handleType)
                  }}</span>
                  {{ item.operator }}提交于{{ item.handleTime }}
                </div>
                <transition name="draw" v-if="isshow(item.handleType)">
                  <el-form label-width="110px">
                    <div class="box1" v-show="showList[index].show">
                      <el-row>
                        <el-col :span="6">
                          <el-form-item label="故障处理人:">{{
                            item.operator
                          }}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="处理时间:">{{
                            item.handleTime
                          }}</el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item label="故障等级:"
                            >{{ item.failureLevel }}级</el-form-item
                          >
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="处理方式:">
                            {{ getHandleMethod(item.handleMethodList) }}
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col>
                          <el-form-item
                            class="formitemstyle"
                            label="故障原因及现场故障描述:"
                          >
                            {{ item.faultDesc }}
                          </el-form-item>
                        </el-col>
                        <el-col>
                          <el-form-item label="设备情况:">
                            {{ item.deviceDesc }}
                          </el-form-item>
                        </el-col>
                        <el-col class="nextplan">
                          <el-form-item label="下一步工作计划:">
                            {{ item.nextWorkPlan }}
                          </el-form-item>
                        </el-col>
                        <el-col>
                          <el-form-item label="附件:">
                            <div
                              class="img_div"
                              v-for="(el, index) in item.imgList"
                              :key="index"
                            >
                              <img class="pic" :src="el.fileAddre" alt="" />
                              <div class="mask">
                                <i
                                  class="el-icon-zoom-in"
                                  @click="look(el.fileAddre)"
                                ></i>
                              </div>
                            </div>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </div>
                  </el-form>
                </transition>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-container>
    </div>
    <el-dialog :visible.sync="open">
      <img width="100%" :src="imgurl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { getOneRepair } from '@/api/maintenance/repairorder/index'
// 标题组件
import TopTitle from '../components/title.vue'
export default {
  components: { TopTitle },
  data() {
    return {
      open: false,
      rotate: false,
      boxshow: false,
      isShow: true,
      showList: [],
      title: {
        basic: '基本情况',
        fault: '现场情况',
        together: '协同处理'
      },
      timeline: [
        { title: '新建', content: '陈伟创建于2020/03/04', show: false },
        { title: '接收', content: '陈伟创建于2020/03/04', show: true },
        { title: '处理', content: '陈伟创建于2020/03/04', show: true },
        { title: '提交', content: '陈伟创建于2020/03/04', show: true }
      ],
      tableData: {},
      name: '',
      len: 0,
      imgurl: '',
      oldUrl: ''
    }
  },
  computed: {
    //
    // 状态
    jobState() {
      if (this.tableData.jobState == 0) {
        return '创建'
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
    },

    // 计算类型
    getType() {
      return function(type) {
        if (type == 0) {
          return '新建'
        } else if (type == null) {
          return '新建'
        } else if (type == 1) {
          return '接收'
        } else {
          return type == 2 ? '处理' : '提交'
        }
      }
    },
    isshow() {
      return function(type) {
        if (type == null) {
          return false
        } else if (type == 0) {
          return false
        } else if (type == 1) {
          return false
        } else {
          return true
        }
      }
    },
    // 处理方式
    getHandleMethod() {
      return function(arr) {
        let newArr = []
        if (arr.length > 0) {
          for (let i = 0; i <= arr.length - 1; i++) {
            if (arr[i] == 0) {
              newArr[i] = '现场处理'
            } else {
              newArr[i] = arr[i] == 1 ? '更换器件' : '返厂维修'
            }
          }
        }
        return newArr.join(',')
      }
    }
  },
  created() {
    getOneRepair(this.$route.params.id).then((res) => {
      this.tableData = res.data.result
      this.name =
        res.data.result.mainRoboot.robotName +
        '(' +
        res.data.result.mainRoboot.assetNum +
        ')'
      this.len = res.data.result.handleList.length
      for (let i = 0; i < this.len; i++) {
        this.showList.push({ show: false, rotate: false })
      }
    })
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // 通过 `vm` 访问组件实例,将值传入oldUrl
      vm.oldUrl = from.path
    })
  },
  mounted() {
    this.$nextTick(() => {
      // 验证是否获取到了上页的url
      /* eslint-disable no-console */
      // console.log(this.oldUrl)
    })
  },
  methods: {
    openpdf() {
      window.open(
        'file:///C:/Users/Administrator/Desktop/web-%E5%85%85%E7%94%B5%E8%AE%BE%E5%A4%87%E5%B7%A5%E5%8D%95%E7%AE%A1%E7%90%86%EF%BC%88%E5%8C%85%E5%90%AB%E6%9C%BA%E5%99%A8%E4%BA%BA%EF%BC%89%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3%E8%AF%B4%E6%98%8E%E4%B9%A6.pdf'
      )
    },
    look(val) {
      this.imgurl = val
      this.open = true
    },
    rote(index) {
      // this.rotate = !this.rotate
      // this.boxshow = !this.boxshow
      this.showList[index].show = !this.showList[index].show
      this.showList[index].rotate = !this.showList[index].rotate
    },
    // 转派工单
    goto(val, e) {
      const id = e
      if (val == 0) {
        //巡检
        this.$store.commit(
          'settings/changeSiderMenuIndex',
          '/airweb/maintenance/inspectdetail'
        )
        this.$router.push({ path: `/airweb/maintenance/inspectdetail/${id}` })
      } else {
        //故障
        this.$store.commit(
          'settings/changeSiderMenuIndex',
          '/airweb/maintenance/faultdetail'
        )
        this.$router.push({ path: `/airweb/maintenance/faultdetail/${id}` })
      }
    },
    goback() {
      // this.$router.push("/maintenance/repairorder")
      this.$router.go(-1)
    },
    // 状态钩子，文件上传成功或失败都会被调用
    imgChange() {},
    // 点击已上传时的钩子
    handlePictureCardPreview() {},
    // 移除时的钩子
    handleRemove() {}
  }
}
</script>
<style lang="scss" scoped>
.boxrepair {
  border: solid 1px #ccc;
  width: 97%;
  margin: 0 auto;
  height: auto;
  padding: 20px 0;
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
.box1 {
  height: auto;
  width: 98%;
  background-color: #edf3f4;
}
.draw-enter-active,
.draw-leave-active {
  transition: all 5s;
}
.draw-enter,
.draw-leave-to {
  height: 0;
}
.aa {
  transition: all 1s;
}
.go {
  transform: rotate(90deg);
  transition: all 1s;
}
.pic {
  width: 100px;
  height: 100px;
}
.img_div {
  position: relative;
  padding-right: 10px;
  display: inline-block;
  width: 100px;
  height: 100px;
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
::v-deep.el-dialog__header {
  padding: 18px 20px;
}
.formitemstyle {
  ::v-deep .el-form-item__label {
    line-height: 1.25rem !important;
  }
}
.nextplan {
  ::v-deep .el-form-item__label {
    line-height: 1.25rem;
  }
}
</style>
